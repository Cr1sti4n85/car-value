import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { Report } from './report.entity';
import { ReportSubscriber } from './report.subscriber';

@Module({
  imports: [TypeOrmModule.forFeature([Report])],
  providers: [ReportsService, ReportSubscriber],
  controllers: [ReportsController],
})
export class ReportsModule {}
