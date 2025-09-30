import { Conf } from '../shared/types/conf';
import { Server } from '../shared/helpers/server';
import { readConfig } from '../shared/helpers/conf';
import analyzeHourlyBase from './analyze-hourly-base';
import { getTimeFrame } from "../shared/helpers/time";
import { MappedTemperature, mapTemperature } from './util/mappers/mapTemperature';
import { mapLight, MappedLight } from './util/mappers/mapLight';

const config: Conf = readConfig();
const server = new Server(config);
const timeFrame = getTimeFrame(6);

async function main() {
  function getTaskMetadata(type: string) {
    const target = type === "T" ? "temperature (in Celsius)" : "light level (in Decimal Percent)";

    return `
      Your role: Expert in home environment analysis and forecasting.
      Analyze the following hourly ${target} data. Respond with the following data structure:
      { comfort_level: 1 | 2 | 3, trend: 1 | 0 | -1, expected_changes: string }
      
      Where:
      - comfort_level: 1 (low), 2 (medium), 3 (high) based on how comfortable the ${target} is.
      - trend: 1 (rising), 0 (stable), -1 (falling) based on the ${target} trend. Stable means changes within 5%.
      - expected_changes: a brief forecast and reason for this forecast.

      [CRITICAL] Ensure valid JSON output. Ensure wrapping strings in double quotes.
      [CRITICAL] Add no additional text outside the JSON.
      [CRITICAL] Don't mention location, time, or any other metadata in the output.
      [CRITICAL] Keep it concise and to the point.
    `;
  }

  function getCurrentConditionsMetadata() {
    return `
      Location: Sofia, Bulgaria
      Facing: West
      Current Hour: ${timeFrame.to}
      Data Timeframe: Last 6 hours
      Forecast Timeframe: Next 6 hours

    `;
  }

  function getTemperaturePrompt(data: Array<MappedTemperature>): string {
    return `
      ${getTaskMetadata('T')}
      ${getCurrentConditionsMetadata()} 
      ${JSON.stringify(data, null, 2)}
    `;
  }

  function getLightPrompt(data: Array<MappedLight>): string {
    return `
      ${getTaskMetadata('L')}
      ${getCurrentConditionsMetadata()}
      ${JSON.stringify(data, null, 2)}
    `;
  }

  await analyzeHourlyBase(
    config,
    server,
    "T",
    timeFrame,
    mapTemperature,
    getTemperaturePrompt,
    (data) => data.temperatureC
  );
  await analyzeHourlyBase(
    config,
    server,
    "L",
    timeFrame,
    mapLight,
    getLightPrompt,
    (data) => data.lightLevel
  );
};

main().catch(err => {
  console.error("Error running analyzer:", err);
});
