import 'reflect-metadata';

import { readConfig } from './helpers/conf';
import { DB } from './db';
import { App } from './app';
import { Routes } from './routes';
import { MCUComms } from './mcu-comms';
import { EventLogger } from './event-logger';

const config = readConfig();
const db = new DB(config);
const eventLogger = new EventLogger(db);
const app = new App(config, eventLogger);
const mcuComs = new MCUComms(config, db, eventLogger);

db.initialize()
  .then(async () => {
    await eventLogger.logSuccess('system', 'Database connected');
    const routes = new Routes(app, db, eventLogger);
    await eventLogger.logInfo('system', 'Loading routes...');
    return routes.initialize();
  })
  .catch(async (err) => {
    await eventLogger.logError('system', `DB init failed: ${err.message}`);
    process.exit(1);
  })
  .then(async () => {
    await eventLogger.logSuccess('system', 'Routes loaded');
    return mcuComs.start();
  })
  .then(async () => {
    app.start();
    await eventLogger.logSuccess('system', 'Application started');
  });

// Graceful shutdown handlers
process.on('SIGTERM', async () => {
  await eventLogger.logInfo('system', 'SIGTERM received, shutting down');
  process.exit(0);
});

process.on('SIGINT', async () => {
  await eventLogger.logInfo('system', 'SIGINT received, shutting down');
  process.exit(0);
});

// Unhandled error handlers
process.on('unhandledRejection', async (reason) => {
  await eventLogger.logError('system', `Unhandled rejection: ${reason}`);
});

process.on('uncaughtException', async (err) => {
  await eventLogger.logError('system', `Uncaught exception: ${err.message}`);
  process.exit(1);
});
