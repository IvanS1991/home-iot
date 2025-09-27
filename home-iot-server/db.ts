import { DataSource, EntityTarget } from 'typeorm';
import { Sensor } from './data/models/Sensor';
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
      entities: [Sensor, Reading],
      synchronize: true,
    });
  }
  
  async initialize() {
    await this.dataSource.initialize();
  }

  getRepo(repo: EntityTarget<Sensor | Reading>) {
    return this.dataSource.getRepository(repo);
  }
}