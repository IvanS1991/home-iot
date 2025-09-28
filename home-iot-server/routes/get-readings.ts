import { Request, Response } from "express";
import { App } from "../app";
import { Reading } from "../data/models/Reading";
import { DB } from "../db";

type PostReadingsRequest = Request<{}, {}, {
  type?: string;
  size: number;
  offset: number;
}>;

type PostReadingsResponse = Response<{
  rows: Reading[];
  total: number;
}>;


export default (app: App, db: DB) => {
  app.getInstance().post('/reading', async (req: PostReadingsRequest, res: PostReadingsResponse) => {
    const { type, size, offset } = req.body;
    const repo = db.getRepo(Reading);
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
    return res.json({ rows, total });
  });
};