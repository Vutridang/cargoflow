import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { AuditLogsService } from './audit-logs.service';

@Controller('audit-logs')
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Get()
  findAll() {
    return this.auditLogsService.findAll();
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.auditLogsService.findByUser(userId);
  }

  @Get('resource/search/:resource')
  searchByResource(@Param('resource') resource: string) {
    return this.auditLogsService.searchByResource(resource);
  }

  @Delete(':id')
  deleteOne(@Param('id') id: string) {
    return this.auditLogsService.deleteOne(id);
  }

  @Delete()
  deleteAll() {
    return this.auditLogsService.deleteAll();
  }
}
