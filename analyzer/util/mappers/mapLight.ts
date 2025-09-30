import { ANALOG_MAX } from "../../../shared/constants/arduino";
import { HourlyAvgReading } from "../../../shared/models/HourlyAvgReading";

export type MappedLight = {
  timestamp: Date;
  lightLevel: number;
};

export function mapLight(data: HourlyAvgReading): MappedLight {
  return {
    timestamp: data.hour,
    lightLevel: data.avg_value / ANALOG_MAX,
  };
}