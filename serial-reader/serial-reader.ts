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
  // Parse value from "Light: 0.75"
  const match = data.match(/Light:\s*([\d.]+)/);
  if (match) {
    const value = parseFloat(match[1]);
    const serverUrl = `${config.serverUrl}:${config.serverPort}/reading`;
    try {
      const response = await axios.post(serverUrl, { value });
      console.log('Server response:', response.data);
    } catch (err: any) {
      console.error('Failed to send reading:', err.message);
    }
  }
});

port.on('error', (err: Error) => {
  console.error('Error: ', err.message);
});
