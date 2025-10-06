import { DataSource, EntityTarget } from 'typeorm';
import { Reading } from '../shared/models/Reading';
import { Config } from '../shared/types/config';
import { HourlyAvgReading } from '../shared/models/HourlyAvgReading';
import { SixHourAnalysis } from '../shared/models/SixHourAnalysis';

export class DB {
  private dataSource: DataSource;

  constructor(config: Config) {
    this.dataSource = new DataSource({
      host: config.edge.database.host,
      username: config.edge.database.user,
      password: config.edge.database.password,
      database: config.edge.database.name,
      port: Number(config.edge.database.port) || 3306,
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