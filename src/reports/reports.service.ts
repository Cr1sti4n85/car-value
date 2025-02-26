import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './report.entity';
import { User } from '../users/user.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report) private reportRepo: Repository<Report>,
  ) {}
  create(body: CreateReportDto, user: User) {
    const report = this.reportRepo.create(body);
    report.user = user;
    return this.reportRepo.save(report);
  }

  async changeApproval(id: number, approved: boolean) {
    const report = await this.reportRepo.findOne({ where: { id } });
    if (!report) {
      throw new NotFoundException('Report not found');
    }

    report.approved = approved;
    this.reportRepo.save(report);
    return report;
  }
}
