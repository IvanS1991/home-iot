import { DataSource, EntityTarget } from 'typeorm';
import { Reading } from './data/models/Reading';
import { Conf } from '../shared/types/conf';
import { HourlyAvgReading } from './data/models/HourlyAvgReading';
import { SixHourAnalysis } from './data/models/SixHourAnalysis';

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
      entities: [Reading, HourlyAvgReading, SixHourAnalysis],
      synchronize: true,
    });
  }
  
  async initialize() {
    await this.dataSource.initialize();
  }

  getRepo<TTarget extends (Reading | HourlyAvgReading | SixHourAnalysis)>(repo: EntityTarget<TTarget>) {
    return this.dataSource.getRepository(repo);
  }
}