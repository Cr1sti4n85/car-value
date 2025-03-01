import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from './src/users/user.entity';
import { Report } from './src/reports/report.entity';

config();

const configService = new ConfigService();

export default new DataSource({
  type: 'sqlite',
  database: configService.getOrThrow<string>('DB_NAME'),
  entities: [User, Report],
  migrations: ['migrations/**'],
});
