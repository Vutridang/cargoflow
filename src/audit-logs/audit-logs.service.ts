import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AuditLog, AuditLogDocument } from './schemas/audit-logs.schema';
import { buildSearchFilter } from 'src/common/helpers/search.helper';

@Injectable()
export class AuditLogsService {
  constructor(
    @InjectModel(AuditLog.name)
    private readonly auditLogModel: Model<AuditLogDocument>,
  ) {}

  async create(data: Partial<AuditLog>) {
    return await this.auditLogModel.create(data);
  }

  async findAll() {
    return await this.auditLogModel.find().sort({ createdAt: -1 }).exec();
  }

  async findByUser(userId: string) {
    return await this.auditLogModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  async searchByResource(resource: string) {
    return await this.auditLogModel
      .find(buildSearchFilter('resource', resource))
      .sort({ createdAt: -1 })
      .exec();
  }

  async deleteOne(id: string) {
    const auditLog = await this.auditLogModel.findById(id).exec();

    if (!auditLog) {
      throw new NotFoundException('Audit log not found');
    }

    await auditLog.deleteOne();

    return {
      message: 'Audit log deleted successfully',
    };
  }

  async deleteAll() {
    const result = await this.auditLogModel.deleteMany({}).exec();

    return {
      message: 'All audit logs deleted successfully',
      deletedCount: result.deletedCount,
    };
  }
}
