import axios from "axios";
import { Conf } from '../shared/types/conf';
import { Server } from '../shared/helpers/server';
import { readConfig } from '../shared/helpers/conf';
import { ANALOG_MAX, VREF } from "../shared/constants/arduino";
import { getTimeFrame } from "../shared/helpers/time";

const config: Conf = readConfig();
const server = new Server(config);

async function main() {
  // 1. Fetch hourly readings from your API
  const apiUrl = server.getUrl("/reading/hourly");
  const { from, to } = getTimeFrame(6);

  const body = {
    type: "T", // Change as needed
    from,
    to,
    size: 10,
    offset: 0
  };

  const hourlyRes = await axios.post(apiUrl, body);
  const hourlyData = hourlyRes.data;

  hourlyData.rows = hourlyData.rows.map((entry: any) => ({
    ...entry,
    temperatureC: ((entry.avg_value / ANALOG_MAX) * VREF - 0.5) / 0.01
  }));

  // 2. Send data to LLM for analysis
  const llmBody = {
    model: config.llmModel,
    prompt: `Give actionable advise based on the home temperature trend. Keep it short - 1 sentence, up to 15 words. Mention the time frame.\n${JSON.stringify(hourlyData)}`,
    stream: false
  };

  const llmRes = await axios.post(config.llmUrl, llmBody);
  const llmOutput = llmRes.data;

  // 3. Output the result
  console.log(llmOutput.response);
}

main().catch(err => {
  console.error("Error running analyzer:", err);
});
