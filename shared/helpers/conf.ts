import * as fs from 'fs';
import * as path from 'path';
import { Conf } from '../types/conf';

export function readConfig(configFile: string = 'etc/conf.json'): Conf {
  const configPath = path.resolve(process.cwd(), configFile);
  try {
    return JSON.parse(fs.readFileSync(configPath, 'utf-8')) as Conf;
  } catch (err) {
    console.error(`Failed to read config file at ${configPath}:`, err);
    process.exit(1);
  }
}
