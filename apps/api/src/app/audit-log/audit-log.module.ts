import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from './audit-log.entity';
import { AuditLogService } from './audit-log.service';
import { AuditLogController } from './audit-log.controller';
import { TasksPermissionGuard } from '../tasks/tasks-permission.guard';
import { Reflector } from '@nestjs/core';

@Module({
  imports: [TypeOrmModule.forFeature([AuditLog])],
  providers: [AuditLogService, TasksPermissionGuard, Reflector],
  controllers: [AuditLogController],
  exports: [AuditLogService],
})
export class AuditLogModule {}
