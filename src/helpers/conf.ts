import * as fs from 'fs';
import * as path from 'path';
import { Config } from '../types/config';

export function readConfig(configFile: string = 'etc/conf.json'): Config {
  const configPath = path.resolve(process.cwd(), configFile);
  try {
    return JSON.parse(fs.readFileSync(configPath, 'utf-8')) as Config;
  } catch (err) {
    console.error(`Failed to read config file at ${configPath}:`, err);
    process.exit(1);
  }
}
