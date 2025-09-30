import { Request, Response } from "express";
import { App } from "../app";
import { DB } from "../db";
import { SixHourAnalysis } from "../../shared/models/SixHourAnalysis";

type PostSixHourAnalysisRequest = Request<{}, {}, {
  type?: string;
  size: number;
  offset: number;
}>;

type PostSixHourAnalysisResponse = Response<{
  rows: SixHourAnalysis[];
  total: number;
}>;


export default (app: App, db: DB) => {
  app.getInstance().post('/six-hour-analysis/list', async (req: PostSixHourAnalysisRequest, res: PostSixHourAnalysisResponse) => {
    const { type, size, offset } = req.body;
    const repo = db.getRepo(SixHourAnalysis);
    // Build query conditionally
    const where = type ? { type } : {};
    const take = typeof size === 'number' && size > 0 ? size : 20;
    const skip = typeof offset === 'number' && offset >= 0 ? offset : 0;
    // Get total count
    const total = await repo.count({ where });
    // Get paginated rows
    const rows = await repo.find({
      where,
      order: { timestamp: "DESC" },
      skip,
      take,
    });
    return res.json({ rows, total });
  });
};