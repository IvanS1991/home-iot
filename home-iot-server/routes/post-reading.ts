import { App } from "../app";
import { Reading } from "../data/models/Reading";
import { DB } from "../db";

export default (app: App, db: DB) => {
  app.getInstance().post('/reading', async (req: any, res: any) => {
    const { sensorId, value, timestamp } = req.body;
    // Validate request body
    if (!sensorId || !value || !timestamp) {
      return res.status(400).json({ error: 'Invalid request body' });
    }
    // Insert reading into the database
    try {
      await db.getRepo(Reading).save({ sensorId, value, timestamp });
      return res.status(201).json({ message: 'Reading added successfully' });
    } catch (error) {
      console.error('Error inserting reading:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
};