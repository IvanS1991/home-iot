import axios from "axios";
import JSON5 from "json5";
import { Conf } from '../shared/types/conf';
import { Server } from '../shared/helpers/server';
import { ANALOG_MAX } from "../shared/constants/arduino";
import { getTimeFrame } from "../shared/helpers/time";

export default async function main(config: Conf, server: Server) {
  // 1. Fetch hourly readings from your API
  const hourlyReadingUrl = server.getUrl("/reading/hourly");
  const { from, to } = getTimeFrame(6);

  const body = {
    type: "L", // Change as needed
    from,
    to,
    size: 10,
    offset: 0
  };

  const hourlyRes = await axios.post(hourlyReadingUrl, body);
  const hourlyData = hourlyRes.data;

  hourlyData.rows = hourlyData.rows.map((entry: any) => ({
    timestamp: entry.timestamp,
    lightLevel: entry.avg_value / ANALOG_MAX,
  }));

  // 2. Send data to LLM for analysis
  const llmBody = {
    model: config.llmModel,
    prompt: `
    Analyze the following hourly light level data (in Lux). Respond with the following data structure:
    { comfort_level: 1 | 2 | 3, trend: 1 | 0 | -1, expected_changes: string }
    
    Where:
    - comfort_level: 1 (low), 2 (medium), 3 (high) based on how comfortable the light level is.
    - trend: 1 (rising), 0 (stable), -1 (falling) based on the light level trend. Stable means changes within ±50 Lux.
    - expected_changes: a brief description of any expected changes in the next 6 hours, based on the current day in Southeastern Europe.

    Add no additional formatting or text.
    Data:
    \n${JSON.stringify(hourlyData)}`,
    stream: false
  };

  const llmRes = await axios.post(config.llmUrl, llmBody);
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
    const values = hourlyData.rows.map((r: any) => r.lightLevel);
    const analysisBody = {
      type: "L",
      startTime: from,
      endTime: to,
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
