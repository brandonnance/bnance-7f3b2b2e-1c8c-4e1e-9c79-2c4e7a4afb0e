import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Param,
  Delete,
  Put,
  Req,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksPermissionGuard } from './tasks-permission.guard';
import { RequirePermission } from '../access-control/permission.decorator';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuditLogService } from '../audit-log/audit-log.service';

@Controller('tasks')
@UseGuards(TasksPermissionGuard) // apply guard to all routes in this controller
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly auditLogService: AuditLogService
  ) {}

  @Get()
  @RequirePermission('tasks.read')
  findAll(@Req() req: any) {
    const orgId = req.user?.organizationId as string | undefined;
    console.log('GET /tasks for user', req.user, '-> orgId =', orgId);
    return this.tasksService.findAll(orgId);
  }

  @Post()
  @RequirePermission('tasks.create')
  async create(@Req() req: any, @Body() dto: CreateTaskDto) {
    const jwtUser = req.user as
      | { organizationId?: string; role?: string }
      | undefined;

    const role = (
      jwtUser?.role ||
      (req.headers['x-role'] as string) ||
      'VIEWER'
    ).toUpperCase();

    const orgId =
      jwtUser?.organizationId ??
      (req.headers['x-org-id'] as string | undefined) ??
      dto.organizationId ??
      null;

    console.log('POST /tasks for user', jwtUser, '-> orgId =', orgId);
    const task = await this.tasksService.create({
      ...dto,
      organizationId: orgId,
    });

    await this.auditLogService.logTaskAction({
      action: 'TASK_CREATED',
      taskId: task.id,
      organizationId: orgId,
      role,
      details: `Created task "${task.title}"`,
    });

    return task;
  }

  @Delete(':id')
  @RequirePermission('tasks.delete')
  async remove(@Param('id') id: string, @Req() req: any) {
    const role = ((req.headers['x-role'] as string) || 'VIEWER').toUpperCase();
    const orgId = (req.headers['x-org-id'] as string) ?? null;

    await this.auditLogService.logTaskAction({
      action: 'TASK_DELETED',
      taskId: id,
      organizationId: orgId,
      role,
      details: 'Deleted task ${id}',
    });

    return this.tasksService.remove(id);
  }

  @Put(':id')
  @RequirePermission('tasks.update')
  async update(
    @Param('id') id: string,
    @Req() req: any,
    @Body() dto: UpdateTaskDto
  ) {
    const role = ((req.headers['x-role'] as string) || 'VIEWER').toUpperCase();
    const orgId = (req.headers['x-org-id'] as string) ?? null;

    const task = await this.tasksService.update(id, dto);

    await this.auditLogService.logTaskAction({
      action: 'TASK_UPDATED',
      taskId: id,
      organizationId: orgId,
      role,
      details: 'Updated task ${id}',
    });

    return task;
  }
}
