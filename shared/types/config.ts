interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  name: string;
  poolLimit: number;
}

interface EdgeConfig {
  host: string;
  port: number;
  database: DatabaseConfig;
}

interface ElectronicComponentConfig {
  id: string;
  vendor: string;
  model: string;
}

interface SensorConfig extends ElectronicComponentConfig {
  type: string;
  pin: number;
  class: string;
}

interface MicrocontrollerConfig extends ElectronicComponentConfig {
  serialPort: string;
  baudRate: number;
  sensors: SensorConfig[];
}

interface LLMConfig {
  url: string;
  model: string;
}

interface RemoteLLMConfig extends LLMConfig {
  apiKey: string;
}

export interface Config {
  edge: EdgeConfig;
  microcontrollers: MicrocontrollerConfig[];
  localLLM: LLMConfig;
  remoteLLM?: RemoteLLMConfig;
  remoteDatabase?: DatabaseConfig;
}
