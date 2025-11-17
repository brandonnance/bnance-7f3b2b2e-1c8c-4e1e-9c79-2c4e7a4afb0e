import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './audit-log.entity';

type TaskAction = 'TASK_CREATED' | 'TASK_UPDATED' | 'TASK_DELETED';

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly repo: Repository<AuditLog>
  ) {}

  async logTaskAction(params: {
    action: TaskAction;
    taskId: string;
    organizationId?: string | null;
    role: string;
    details?: string;
  }) {
    const entry = this.repo.create({
      action: params.action,
      taskId: params.taskId,
      organizationId: params.organizationId ?? null,
      role: params.role,
      details: params.details ?? null,
    });

    await this.repo.save(entry);
  }

  findAll() {
    return this.repo.find({
      order: { createdAt: 'DESC' },
    });
  }
}
