import { Conf } from '../shared/types/conf';
import { Server } from '../shared/helpers/server';
import { readConfig } from '../shared/helpers/conf';
import analyzeHourlyTemperature from './analyze-hourly-temperature';
import analyzeHourlyLight from './analyze-hourly-light';

const config: Conf = readConfig();
const server = new Server(config);

async function main() {
  await analyzeHourlyTemperature(config, server);
  await analyzeHourlyLight(config, server);
};

main().catch(err => {
  console.error("Error running analyzer:", err);
});
