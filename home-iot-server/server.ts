
import express from 'express';
import mariadb from 'mariadb';
import bodyParser from 'body-parser';

import { readConfig } from '../shared/helpers/conf';
import { Conf } from '../shared/types/conf';

const config: Conf = readConfig();

const app = express();
const port = config.serverPort;

app.use(bodyParser.json());

// Parse dbConnString (mariadb://user:password@host:port/dbname)
const dbUrl = new URL(config.dbConnString);
const pool = mariadb.createPool({
  host: dbUrl.hostname,
  user: dbUrl.username,
  password: dbUrl.password,
  database: dbUrl.pathname.replace(/^\//, ''),
  port: Number(dbUrl.port) || 3306,
  connectionLimit: config.dbPoolLimit
});

app.post('/reading', async (req, res) => {
  const { value } = req.body;
  if (typeof value === 'undefined') {
    return res.status(400).json({ error: 'Missing value' });
  }
  console.log('Received reading:', value);
  let conn;
  try {
    conn = await pool.getConnection();
    // Generate timestamp server-side
    const timestamp = Date.now();
    await conn.query('INSERT INTO readings (value, timestamp) VALUES (?, ?)', [value, timestamp]);
    res.status(201).json({ message: 'Reading stored' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
});

app.listen(port, () => {
  console.log(`Home IoT server listening on port ${port}`);
});
