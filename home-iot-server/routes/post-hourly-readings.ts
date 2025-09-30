import { Request, Response } from "express";
import { Between } from 'typeorm';
import { App } from "../app";
import { DB } from "../db";
import { HourlyAvgReading } from "../../shared/models/HourlyAvgReading";
import { PostHourlyReadingsRequestPayload, PostHourlyReadingsResponsePayload } from "../../shared/types/hourly-readings";

type PostHourlyReadingsRequest = Request<{}, {}, PostHourlyReadingsRequestPayload>;

type PostHourlyReadingsResponse = Response<PostHourlyReadingsResponsePayload | { error: string; }>;


export default (app: App, db: DB) => {
  app.getInstance().post('/reading/hourly', async (req: PostHourlyReadingsRequest, res: PostHourlyReadingsResponse) => {
    const { type, from, to, size, offset } = req.body;
    // Validate required fields
    if (!type || !from || !to) {
      return res.status(400).json({ error: "Missing required fields: type, from, to" });
    }
    // Set defaults for optional fields
    const take = typeof size === 'number' && size > 0 ? size : 20;
    const skip = typeof offset === 'number' && offset >= 0 ? offset : 0;
    const repo = db.getRepo(HourlyAvgReading);
    // Build query conditionally
    const where = type ? { type, hour: Between(new Date(from), new Date(to)) } : {};
    // Get total count
    const total = await repo.count({ where });
    // Get paginated rows
    const rows = await repo.find({
      where,
      order: { hour: "DESC" },
      skip,
      take,
    });
    return res.json({ rows, total });
  });
};