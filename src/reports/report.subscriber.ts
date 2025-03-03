import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { Report } from './report.entity';
import { Logger } from '@nestjs/common';

@EventSubscriber()
export class ReportSubscriber implements EntitySubscriberInterface<Report> {
  private readonly logger = new Logger(ReportSubscriber.name);

  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Report;
  }

  beforeInsert(event: InsertEvent<Report>): void | Promise<any> {
    this.logger.log(`beforeInsert`, JSON.stringify(event.entity));
  }

  afterInsert(event: InsertEvent<Report>): void | Promise<any> {
    this.logger.log(`afterInsert`, JSON.stringify(event.entity));
  }
}
