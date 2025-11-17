import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { TasksPermissionGuard } from '../tasks/tasks-permission.guard';
import { RequirePermission } from '../access-control/permission.decorator';

@Controller('audit-log')
@UseGuards(TasksPermissionGuard)
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Get()
  @RequirePermission('audit.read')
  findAll() {
    return this.auditLogService.findAll();
  }
}
