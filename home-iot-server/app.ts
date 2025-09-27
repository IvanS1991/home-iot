import express from 'express';
import bodyParser from 'body-parser';
import { Conf } from '../shared/types/conf';

export class App {
  private readonly app: ReturnType<typeof express>;

  constructor(private readonly config: Conf) {
    this.app = express();
    const port = config.serverPort;

    this.app.use(bodyParser.json());
  }

  getInstance() {
    return this.app;
  }

  start() {
    const port = this.config.serverPort;

    this.app.listen(port, () => {
      console.log(`Home IoT server listening on port ${port}`);
    });
  }
}