import * as fs from 'fs';
import * as path from 'path';
import mariadb from 'mariadb';
import { DataSource, EntityTarget } from 'typeorm';
import { Reading } from './data/models/Reading';
import { Conf } from '../shared/types/conf';

export class DB {
  private dataSource: DataSource;

  constructor(config: Conf) {
    this.dataSource = new DataSource({
      host: config.dbHost,
      username: config.dbUser,
      password: config.dbPassword,
      database: config.dbName,
      port: Number(config.dbPort) || 3306,
      type: 'mariadb',
      entities: [Reading],
      synchronize: true,
    });
  }
  
  async initialize() {
    await this.dataSource.initialize();
  }

  getRepo(repo: EntityTarget<Reading>) {
    return this.dataSource.getRepository(repo);
  }
}