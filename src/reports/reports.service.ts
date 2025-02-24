import { Injectable } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';

@Injectable()
export class ReportsService {
  async create(body: CreateReportDto) {
    return 'This action creates a new report';
  }
}
