import { Request, Response } from "express";
import { App } from "../app";
import { DB } from "../db";
import { SixHourAnalysis } from "../data/models/SixHourAnalysis";

type PostSixHourAnalysisRequest = Request<{}, {}, {
  type: string;
  startTime: Date;
  endTime: Date;
  minValue: number;
  maxValue: number;
  avgValue: number;
  comfortLevel: number; // 1 (low), 2 (medium), 3 (high)
  trend: number; // 1 (rising), 0 (stable), -1 (falling)
  expectedChanges: string; // Description of expected changes
}>;

export default (app: App, db: DB) => {
  app.getInstance().post('/six-hour-analysis', async (req: PostSixHourAnalysisRequest, res: Response) => {
    const {
      type,
      startTime,
      endTime,
      minValue,
      maxValue,
      avgValue,
      comfortLevel,
      trend,
      expectedChanges
    } = req.body;
    // Validate request body
    if (
        !startTime ||
        !endTime ||
        !Number.isFinite(minValue) ||
        !Number.isFinite(maxValue) ||
        !Number.isFinite(avgValue) ||
        !Number.isFinite(comfortLevel) ||
        !Number.isFinite(trend) ||
        !expectedChanges?.length
    ) {
      console.log(`Invalid request body: ${JSON.stringify(req.body)}`);
      return res.status(400).json({ error: 'Invalid request body' });
    }
    // Insert reading into the database
    try {
      await db.getRepo(SixHourAnalysis).save({
        type,
        start_time: startTime,
        end_time: endTime,
        min_value: minValue,
        max_value: maxValue,
        avg_value: avgValue,
        comfort_level: comfortLevel,
        trend,
        expected_changes: expectedChanges,
        timestamp: new Date()
      });
      return res.status(201).json({ message: 'SixHourAnalysis added successfully' });
    } catch (error) {
      console.error('Error inserting SixHourAnalysis:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
};