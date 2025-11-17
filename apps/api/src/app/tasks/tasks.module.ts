import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from '../entities/task.entity';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TasksPermissionGuard } from './tasks-permission.guard';
import { Reflector } from '@nestjs/core';
import { AuditLogModule } from '../audit-log/audit-log.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), AuditLogModule],
  providers: [TasksService, TasksPermissionGuard, Reflector],
  controllers: [TasksController],
  exports: [TasksService],
})
export class TasksModule {}
