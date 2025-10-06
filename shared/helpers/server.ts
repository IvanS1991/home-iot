import { Config } from '../types/config';

export class Server {
  private config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  getUrl(path: string): string {
    // Ensure no double slashes and port is included
    const base = this.config.edge.host.replace(/\/$/, '');
    const port = this.config.edge.port;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${base}:${port}${cleanPath}`;
  }
}
