import axios from "axios";
import { Config } from '../shared/types/config';
import { Server } from '../shared/helpers/server';
import { PostHourlyReadingsRequestPayload, PostHourlyReadingsResponsePayload } from "../shared/types/hourly-readings";
import { LLMRequestPayload, LLMResponsePayload } from "../shared/types/llm";
import { HourlyAvgReading } from "../shared/models/HourlyAvgReading";
import { TimeFrame } from "../shared/types/api";
import { LLMAnalysisOutput } from "./types/llm-output";

export default async function main<TOutput>(
    config: Config,
    server: Server,
    type: string,
    timeFrame: TimeFrame,
    mapper: (data: HourlyAvgReading) => TOutput,
    getPrompt: (data: Array<TOutput>) => string,
    getAnalysisValue: (data: TOutput) => number,
    parseLLMResponse: (input: string) => LLMAnalysisOutput | null
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
    model: config.localLLM.model,
    prompt: getPrompt(hourlyDataRows),
    stream: false
  };

  const llmRes = await axios.post<LLMResponsePayload>(config.localLLM.url, llmBody);
  const llmOutput = llmRes.data;

  try {
    const llmJson = parseLLMResponse(llmOutput.response);

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
      comfortLevel: Number(llmJson!.comfort_level),
      trend: Number(llmJson!.trend),
      expectedChanges: llmJson!.expected_changes
    };

    await axios.post(sixHourAnalysisUrl, analysisBody);
  } catch (err) {
    console.error("Error parsing LLM response:", err);
    console.error("LLM response was:", llmOutput.response);
  }
};
