import axios from 'axios';
import os from 'os';
import si from 'systeminformation';
import { SerialPort } from 'serialport';
import { readConfig } from '../shared/helpers/conf';
import { Server } from '../shared/helpers/server';
import { ANALOG_MAX, VREF } from '../shared/constants/arduino';

const config = readConfig();
const server = new Server(config);

const serialPorts = config.microcontrollers.map(mc =>
  new SerialPort({ path: mc.serialPort, baudRate: mc.baudRate || 9600 })
);

async function getCpuUsagePercent(): Promise<string> {
  const load = await si.currentLoad();
  return load.currentLoad.toFixed(1); // This is the total CPU usage percent
}

async function main() {
  // 1. Query server for latest readings
  const hourlyReadingUrl = server.getUrl("/reading/list");
  const { data: tempData } = await axios.post(hourlyReadingUrl, { type: 'T', size: 1, offset: 0});
  const { data: lightData } = await axios.post(hourlyReadingUrl, { type: 'L', size: 1, offset: 0});

  // 2. Calculate values
  const temperatureC = ((tempData.rows[0].value / ANALOG_MAX) * VREF - 0.5) / 0.01; // Example formula
  const lightPercent = (lightData.rows[0].value / 1023) * 100;

  // 3. Get CPU and RAM usage
  const totalMem = os.totalmem() / (1024 ** 3); // in GB
  const freeMem = os.freemem() / (1024 ** 3);
  const usedMem = totalMem - freeMem;
  const ramStr = `${usedMem.toFixed(1)}G`;
  // For CPU, you may want to use a package like 'systeminformation' for % usage
  const cpuPercent = await getCpuUsagePercent(); // implement this

  // 4. Get current time
  const now = new Date();
  const hh = now.getHours().toString().padStart(2, '0');
  const mm = now.getMinutes().toString().padStart(2, '0');
  const timeStr = `${hh}:${mm}`;

  // 5. Emit lines
  const lines = [
    `Home:${temperatureC.toFixed(1)}C:${lightPercent.toFixed(1)}%`,
    `Clock:${timeStr}`,
    `Edge:${cpuPercent}%:${ramStr}`
  ];

  // Write to all serial ports
  for (const port of serialPorts) {
    for (const line of lines) {
      port.write(line + '\n');
    }
  }
  console.log(lines);
}

main();