import express from 'express';
import bodyParser from 'body-parser';
import { Config } from './types/config';
import { EventLogger } from './event-logger';

export class App {
  private readonly app: ReturnType<typeof express>;

  constructor(private readonly config: Config, private readonly eventLogger: EventLogger) {
    this.app = express();

    this.app.use(bodyParser.json());
  }

  getInstance() {
    return this.app;
  }

  start() {
    const port = this.config.edge.port;

    const server = this.app.listen(port, async () => {
      await this.eventLogger.logSuccess('http', `HTTP Server started on port ${port}`);
    });

    server.on('error', async (err: any) => {
      if (err.code === 'EADDRINUSE') {
        await this.eventLogger.logError('http', `Port ${port} already in use`);
      } else {
        await this.eventLogger.logError('http', `Server error: ${err.message}`);
      }
      process.exit(1);
    });
  }
}