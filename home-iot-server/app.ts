import express from 'express';
import bodyParser from 'body-parser';
import { Config } from '../shared/types/config';

export class App {
  private readonly app: ReturnType<typeof express>;

  constructor(private readonly config: Config) {
    this.app = express();

    this.app.use(bodyParser.json());
  }

  getInstance() {
    return this.app;
  }

  start() {
    const port = this.config.edge.port;

    this.app.listen(port, () => {
      console.log(`Home IoT server listening on port ${port}`);
    });
  }
}