import { Conf } from '../shared/types/conf';
import { Server } from '../shared/helpers/server';
import { readConfig } from '../shared/helpers/conf';
import analyzeHourlyBase from './analyze-hourly-base';
import { getTimeFrame } from "../shared/helpers/time";
import { MappedTemperature, mapTemperature } from './util/mappers/mapTemperature';
import { mapLight, MappedLight } from './util/mappers/mapLight';
import { parseDataBlock } from './util/parsers/parse-data-block';

const config: Conf = readConfig();
const server = new Server(config);
const targetTime = process.argv[2]; // 'YYYY-MM-DD HH:MM:SS'
if (targetTime && !/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(targetTime)) {
  console.error("Usage: npm run analyze-hourly <targetTime> <targetReading>");
  console.error("<targetTime> should be in 'YYYY-MM-DD HH:MM:SS' format.");
  process.exit(1);
}
const targetReading = process.argv[3] || 'TL'; // 'T' or 'L' or 'TL' or 'LT'
if (!/^[TL]{1,2}$/.test(targetReading)) {
  console.error("Usage: npm run analyze-hourly <targetTime> <targetReading>");
  console.error("<targetReading> should be 'T' for temperature, 'L' for light, or 'TL'/'LT' for both.");
  process.exit(1);
}
const timeFrame = getTimeFrame(6, targetTime);

async function main() {
  function getTaskMetadata(type: string) {
    const target = type === "T" ? "indoor temperature (in Celsius)" : "indoor light level (in Decimal Percent)";
    const valueRange = type === "T" ? "15C (cold) to 28C (hot)" : "0 (dark) to 1 (bright)";

    return `
Rules to follow strictly:
* Output ONLY the following data block, with no comments, no quotes, and no extra text.
* Do not explain, interpret, or justify your answers.
* Do not add any information beyond the required values.
* Be concise and minimal.

Data structure (this is how the data looks like, do not include this in your output, but follow the format exactly):
!data_begin
comfort_level: number (1: low, 2: medium, 3: high)
trend: number (1: rising, 0: stable, -1: falling)
expected_changes: string (one sentence forecast)
!data_end

Format example (this is an example, do not include this in your output):
!data_begin
comfort_level: 2
trend: -1
expected_changes: The indoor light level is expected to decrease slightly during the next 6 hours.
!data_end

Analyze the following hourly ${target} data in the range ${valueRange}.
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

  if (targetReading.includes("T")) {
    await analyzeHourlyBase(
      config,
      server,
      "T",
      timeFrame,
      mapTemperature,
      getTemperaturePrompt,
      (data) => data.temperatureC,
      (input) => parseDataBlock(input)
    );
  }

  if (targetReading.includes("L")) {
    await analyzeHourlyBase(
      config,
      server,
      "L",
      timeFrame,
      mapLight,
      getLightPrompt,
      (data) => data.lightLevel,
      (input) => parseDataBlock(input)
    );
  }
}

main().catch(err => {
  console.error("Error running analyzer:", err);
});
