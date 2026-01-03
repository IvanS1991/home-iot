import os from 'os';
import si from 'systeminformation';
import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';
import 'reflect-metadata';
import net from 'net';
import readline from 'readline';
import { Config } from './types/config';
import { Readings } from './models/Reading';
import { DB } from './db';
import { EventLogger } from './event-logger';
import { EventType } from './constants/events';

export class MCUComms {
  constructor(private readonly config: Config, private readonly db: DB, private readonly eventLogger: EventLogger) {}

  private async getCpuUsagePercent(): Promise<string> {
    const load = await si.currentLoad();
    return load.currentLoad.toFixed(1); // This is the total CPU usage percent
  }

  private async getStatus() {
    // 1. Query server for latest readings
    // @todo

    // 3. Get CPU and RAM usage
    const totalMem = os.totalmem() / (1024 ** 3); // in GB
    const freeMem = os.freemem() / (1024 ** 3);
    const usedMem = totalMem - freeMem;
    const ramStr = `${usedMem.toFixed(1)}G`;
    // For CPU, you may want to use a package like 'systeminformation' for % usage
    const cpuPercent = await this.getCpuUsagePercent(); // implement this

    // 4. Get current time
    const now = new Date();
    const hh = now.getHours().toString().padStart(2, '0');
    const mm = now.getMinutes().toString().padStart(2, '0');
    const timeStr = `${hh}:${mm}`;

    return [
      `Home:27.5C:37.2%`,
      `Clock:${timeStr}`,
      `Edge:${cpuPercent}%:${ramStr}`
    ];
  }

  private async parseData(data: string, source: EventType) {// Parse new format: {pin}:{type}:{vendor}:{model}:{reading}
    const parts = data.trim().split(":");
    if (parts.length === 7) {
      const [vref, adcMax, pin, type, vendor, model, reading] = parts;
      const body = {
        vref: Number(vref),
        adcMax: Number(adcMax),
        pin: Number(pin),
        type,
        vendor,
        model,
        value: Number(reading)
      };
      // Validate request body
      if (!Number.isFinite(body.vref) || !Number.isFinite(body.adcMax) || !Number.isFinite(body.pin) || !body.type || !body.vendor || !body.model || !Number.isFinite(body.value)) {
        return this.eventLogger.logError(source, `Invalid format: ${data}`);
      }
      // Insert reading into the database
      try {
        await this.db.getRepo(Readings).save({ ...body, timestamp: new Date() });
        await this.eventLogger.logSuccess(source, 'Reading saved');
        return;
      } catch (err: any) {
        return this.eventLogger.logError(source, `Failed insert: ${err.message}`);
      }
    } else {
      return this.eventLogger.logError(source, `Invalid format: ${data}`);
    }
  }

  private startSerialPorts() {
    this.config.microcontrollers.forEach((microcontroller) => {
      if (!microcontroller.serialPort) {
        return;
      }

      const portName = microcontroller.serialPort;
      const baudRate = microcontroller.baudRate;

      let port: SerialPort;
      try {
        port = new SerialPort({ path: portName, baudRate });
      } catch (err: any) {
        this.eventLogger.logError('serial', `Failed to open ${portName}: ${err.message}`);
        return;
      }

      const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

      port.on('open', async () => {
        await this.eventLogger.logSuccess('serial', `Serial: ${portName} at ${baudRate} baud.`);
        for (const line of await this.getStatus()) {
          port.write(line + '\n');
        }
      });

      parser.on('data', async (data: string) => {
        await this.parseData(data, 'serial');
      });

      port.on('error', async (err: Error) => {
        await this.eventLogger.logError('serial', `Serial: ${err.message}`);
      });

      port.on('close', async () => {
        await this.eventLogger.logInfo('serial', `Port closed: ${portName}`);
      });

      setInterval(async () => {
        for (const line of await this.getStatus()) {
          port.write(line + '\n');
        }
      }, 5000); // Update status every 5 seconds
    });
  }

  // Start TCP server to receive data from other microcontrollers
  private startTcpServer() {
    const tcpPort = this.config.edge.tcpPort || 3030;  // Add this to your config

    const server = net.createServer(async (socket) => {
      await this.eventLogger.logInfo('tcp', `Connect: ${socket.remoteAddress}:${socket.remotePort}`);
      
      const rl = readline.createInterface({
        input: socket,
        crlfDelay: Infinity
      });

      rl.on('error', async (err) => {
        await this.eventLogger.logError('tcp', `Readline: ${err.message}`);
      });
      
      // Read sensor data from device
      rl.on('line', async (line) => {
        await this.parseData(line, 'tcp');
      });

      socket.on('close', async () => {
        await this.eventLogger.logInfo('tcp', `Disconnect: ${socket.remoteAddress}`);
      });
      
      socket.on('error', async (err) => {
        await this.eventLogger.logError('tcp', `${socket.remoteAddress}: ${err.message}`);
      });


      setInterval(async () => {
        for (const line of await this.getStatus()) {
          socket.write(line + '\n');
        }
      }, 5000); // Update status every 5 seconds
    });

    server.listen(tcpPort, '0.0.0.0', async () => {
      await this.eventLogger.logSuccess('tcp', `Server: ${tcpPort}`);
    });

    server.on('error', async (err) => {
      await this.eventLogger.logError('tcp', `Server error: ${err.message}`);
    });
  }

  async start() {
    this.startSerialPorts();
    this.startTcpServer();
    await this.eventLogger.logSuccess('system', 'MCU communications started');
  }
}
