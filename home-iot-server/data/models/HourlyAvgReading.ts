import { ViewEntity, ViewColumn } from "typeorm";

@ViewEntity({
  name: "hourly_avg_readings",
  expression: `
    SELECT
      reading.type AS type,
      DATE_FORMAT(reading.timestamp, '%Y-%m-%d %H:00:00') AS hour,
      AVG(reading.value) AS avg_value
    FROM reading
    GROUP BY reading.type, DATE_FORMAT(reading.timestamp, '%Y-%m-%d %H:00:00')
  `,
  synchronize: false
})
export class HourlyAvgReading {
  @ViewColumn()
  type!: string;

  @ViewColumn()
  hour!: Date;

  @ViewColumn()
  avg_value!: number;
}