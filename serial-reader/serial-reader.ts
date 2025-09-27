// TypeScript script to read serial communication from Arduino
// Requires: npm install serialport @serialport/parser-readline


import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';
import { Conf } from '../shared/types/conf';
import { Server } from '../shared/helpers/server';
import { readConfig } from '../shared/helpers/conf';
import axios from 'axios';

const config: Conf = readConfig();

const portName = config.serialPort;
const baudRate = 9600;

const port = new SerialPort({ path: portName, baudRate });
const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));
const server = new Server(config)

port.on('open', () => {
  console.log(`Serial port ${portName} opened at ${baudRate} baud.`);
});

parser.on('data', async (data: string) => {
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
