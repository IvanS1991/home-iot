import fs from "fs";
import path from "path";
import { App } from "../app";
import { DB } from "../db";

export class Routes {
  constructor(private readonly app: App, private readonly db: DB) { }

  async initialize() {
    const routesDir = path.resolve(__dirname);
    const files = fs.readdirSync(routesDir);

    for (const file of files) {
      if (file === 'index.ts' || !file.endsWith('.ts')) continue;
      const routePath = path.join(routesDir, file);
      // Dynamic import
      const routeModule = await import(routePath);
      // Call the default export as a function
      if (typeof routeModule.default === 'function') {
        routeModule.default(this.app, this.db);
      }
    }
  }
}