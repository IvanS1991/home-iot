import { DataSource, EntityTarget } from 'typeorm';
import { Readings } from './models/Reading';
import { Config } from './types/config';
import { Events } from './models/Event';

export class DB {
  private dataSource: DataSource;

  constructor(config: Config) {
    this.dataSource = new DataSource({
      host: config.edge.database.host,
      username: config.edge.database.user,
      password: config.edge.database.password,
      database: config.edge.database.name,
      port: Number(config.edge.database.port) || 3306,
      type: config.edge.database.type,
      entities: [Readings, Events],
      synchronize: true,
    });
  }
  
  async initialize() {
    await this.dataSource.initialize();
  }

  getRepo<TTarget extends (Readings | Events)>(repo: EntityTarget<TTarget>) {
    return this.dataSource.getRepository(repo);
  }
}