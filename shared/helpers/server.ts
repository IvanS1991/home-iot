import { Conf } from '../types/conf';

export class Server {
  private config: Conf;

  constructor(config: Conf) {
    this.config = config;
  }

  getUrl(path: string): string {
    // Ensure no double slashes and port is included
    const base = this.config.serverUrl.replace(/\/$/, '');
    const port = this.config.serverPort;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${base}:${port}${cleanPath}`;
  }
}
