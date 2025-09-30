import { ANALOG_MAX, VREF } from "../../../shared/constants/arduino";
import { HourlyAvgReading } from "../../../shared/models/HourlyAvgReading";

export type MappedTemperature = {
  timestamp: Date;
  temperatureC: number;
};

export function mapTemperature(data: HourlyAvgReading): MappedTemperature {
  return {
    timestamp: data.hour,
    temperatureC: ((data.avg_value / ANALOG_MAX) * VREF - 0.5) / 0.01,
  };
}