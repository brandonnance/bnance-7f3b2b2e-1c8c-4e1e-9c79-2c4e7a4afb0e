import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>
  ) {}

  findAll(orgId?: string) {
    const where = orgId ? { organizationId: orgId } : {};

    return this.taskRepo.find({
      where,
      relations: ['assignee'],
      order: { createdAt: 'DESC' },
    });
  }

  async create(dto: CreateTaskDto) {
    const task = this.taskRepo.create({
      title: dto.title,
      description: dto.description ?? null,
      status: dto.status ?? 'OPEN',
      dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
      organizationId: dto.organizationId ?? null,
      assigneeId: dto.assigneeId ?? null,
    });

    return this.taskRepo.save(task);
  }

  async remove(id: string, userOrgId: string) {
    const task = await this.taskRepo.findOne({ where: { id } });

    if (!task) {
      throw new NotFoundException('Task with id {id} not found');
    }
    if (task.organizationId !== userOrgId) {
      throw new NotFoundException(
        'Cannot delete tasks that are not in your organization'
      );
    }

    await this.taskRepo.remove(task);

    return { success: true };
  }

  async update(id: string, userOrgId: string, dto: UpdateTaskDto) {
    const task = await this.taskRepo.findOne({ where: { id } });

    if (!task) {
      throw new NotFoundException('Task with id ${id} not found');
    }

    if (task.organizationId !== userOrgId) {
      throw new NotFoundException(
        'Cannot update tasks that are not in your organization'
      );
    }

    // Apply Updates
    if (dto.title !== undefined) task.title = dto.title;
    if (dto.description !== undefined) task.description = dto.description;
    if (dto.status !== undefined) task.status = dto.status;
    if (dto.dueDate !== undefined)
      task.dueDate = dto.dueDate ? new Date(dto.dueDate) : null;

    if (dto.organizationId !== undefined)
      task.organizationId = dto.organizationId;
    if (dto.assigneeId !== undefined) task.assigneeId = dto.assigneeId;

    return this.taskRepo.save(task);
  }
}
