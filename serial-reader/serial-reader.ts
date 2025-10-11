// TypeScript script to read serial communication from Arduino
// Requires: npm install serialport @serialport/parser-readline


import os from 'os';
import si from 'systeminformation';
import { SerialPort } from 'serialport';
import { readConfig } from '../shared/helpers/conf';
import { ANALOG_MAX, VREF } from '../shared/constants/arduino';
import { ReadlineParser } from '@serialport/parser-readline';
import { Server } from '../shared/helpers/server';
import axios from 'axios';

const config = readConfig();
const server = new Server(config);

async function getCpuUsagePercent(): Promise<string> {
  const load = await si.currentLoad();
  return load.currentLoad.toFixed(1); // This is the total CPU usage percent
}

async function writeStatus(port: SerialPort) {
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
  for (const line of lines) {
    port.write(line + '\n');
  }

  console.log(lines);
}

config.microcontrollers.forEach((microcontroller) => {
  const portName = microcontroller.serialPort;
  const baudRate = 9600;

  const port = new SerialPort({ path: portName, baudRate });
  const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));
  const server = new Server(config);

  let lastDataTimestamp = 0;

  port.on('open', () => {
    console.log(`Serial port ${portName} opened at ${baudRate} baud.`);
    writeStatus(port); // Initial status write
  });

  parser.on('data', async (data: string) => {
    if (Date.now() - lastDataTimestamp < 60000) {
      return;
    }

    console.log(`Received: ${data}`);
    // Parse new format: {pin}:{type}:{vendor}:{model}:{reading}
    const parts = data.trim().split(":");
    if (parts.length === 5) {
      const [pin, type, vendor, model, reading] = parts;
      const serverUrl = server.getUrl('/reading');
      try {
        const response = await axios.post(serverUrl, {
          pin: Number(pin),
          type,
          vendor,
          model,
          reading: Number(reading)
        });
        console.log('Server response:', response.data);
        lastDataTimestamp = Date.now();
      } catch (err: any) {
        console.error('Failed to send reading:', err.message);
      }
    } else {
      console.warn('Invalid data format:', data);
    }
  });

  port.on('error', (err: Error) => {
    console.error('Error: ', err.message);
  });

  setInterval(() => writeStatus(port), 1000); // Update status every minute
});

