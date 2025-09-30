import axios from "axios";
import JSON5 from "json5";
import { Conf } from '../shared/types/conf';
import { Server } from '../shared/helpers/server';
import { PostHourlyReadingsRequestPayload, PostHourlyReadingsResponsePayload } from "../shared/types/hourly-readings";
import { LLMRequestPayload, LLMResponsePayload } from "../shared/types/llm";
import { HourlyAvgReading } from "../shared/models/HourlyAvgReading";
import { TimeFrame } from "../shared/types/api";
import { raw } from "body-parser";

export default async function main<TOutput>(
    config: Conf,
    server: Server,
    type: string,
    timeFrame: TimeFrame,
    mapper: (data: HourlyAvgReading) => TOutput,
    getPrompt: (data: Array<TOutput>) => string,
    getAnalysisValue: (data: TOutput) => number
) {
  // 1. Fetch hourly readings from your API
  const hourlyReadingUrl = server.getUrl("/reading/hourly");

  const body: PostHourlyReadingsRequestPayload = {
    ...timeFrame,
    type,
    size: 10,
    offset: 0
  };

  const hourlyRes = await axios.post<PostHourlyReadingsResponsePayload>(hourlyReadingUrl, body);
  const hourlyData = hourlyRes.data;
  const hourlyDataRows = hourlyData.rows.map(mapper);

  // 2. Send data to LLM for analysis
  const llmBody: LLMRequestPayload = {
    model: config.llmModel,
    prompt: getPrompt(hourlyDataRows),
    stream: false
  };

  const llmRes = await axios.post<LLMResponsePayload>(config.llmUrl, llmBody);
  const llmOutput = llmRes.data;

  const indexOfJsonStart = llmOutput.response.indexOf('{');
  if (indexOfJsonStart !== -1) {
    llmOutput.response = llmOutput.response.slice(indexOfJsonStart);
  }

  const indexOfJsonEnd = llmOutput.response.indexOf('}');
  if (indexOfJsonEnd !== -1) {
    llmOutput.response = llmOutput.response.slice(0, indexOfJsonEnd + 1);
  }

  try {
    const llmJson = JSON5.parse(llmOutput.response.trim());

    // 3. Output the result
    console.log(llmJson);

    const sixHourAnalysisUrl = server.getUrl("/six-hour-analysis");
    const values = hourlyDataRows.map(getAnalysisValue);
    const analysisBody = {
      type,
      startTime: timeFrame.from,
      endTime: timeFrame.to,
      minValue: Math.min(...values),
      maxValue: Math.max(...values),
      avgValue: values.reduce((sum: number, v: number) => sum + v, 0) / values.length,
      comfortLevel: Number(llmJson.comfort_level),
      trend: Number(llmJson.trend),
      expectedChanges: llmJson.expected_changes
    };

    await axios.post(sixHourAnalysisUrl, analysisBody);
  } catch (err) {
    console.error("Error parsing LLM response:", err);
    console.error("LLM response was:", llmOutput.response);
  }
};
