import 'reflect-metadata';

import { readConfig } from '../shared/helpers/conf';
import { DB } from './db';
import { App } from './app';
import { Routes } from './routes';

const config = readConfig();
const app = new App(config);
const db = new DB(config);

db.initialize().then(() => {
  const routes = new Routes(app, db);
  return routes.initialize();
}).then(() => {
  app.start();
});
