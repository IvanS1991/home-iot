import { Request, Response } from "express";
import { App } from "../app";
import { Readings } from "../models/Reading";
import { DB } from "../db";
import { EventLogger } from "../event-logger";

type PostReadingsRequest = Request<{}, {}, {
  type?: string;
  size: number;
  offset: number;
}>;

type PostReadingsResponse = Response<{
  rows: Readings[];
  total: number;
}>;


export default async(app: App, db: DB, eventLogger: EventLogger) => {
  app.getInstance().post('/reading/list', async (req: PostReadingsRequest, res: PostReadingsResponse) => {
    const { type, size, offset } = req.body;

    try {
      const repo = db.getRepo(Readings);
      // Build query conditionally
      const where = type ? { type } : {};
      // Get total count
      const total = await repo.count({ where });
      // Get paginated rows
      const rows = await repo.find({
        where,
        order: { timestamp: "DESC" },
        skip: offset,
        take: size,
      });
      await eventLogger.logSuccess('http', `Fetched ${rows.length} out of ${total} readings`);
      return res.json({ rows, total });
    } catch (err: any) {
      await eventLogger.logError('http', `Query failed: ${err.message}`);
      return res.status(500).json({ error: 'Database query failed' });
    }
  });
};