import { HourlyAvgReading } from "../models/HourlyAvgReading";
import { TimeFrame } from "./api";

export type PostHourlyReadingsRequestPayload = TimeFrame & {
  type: string;
  size?: number;
  offset?: number;
};

export type PostHourlyReadingsResponsePayload = {
  rows: HourlyAvgReading[];
  total: number;
};