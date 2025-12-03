import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TasksPermissionGuard } from '../tasks/tasks-permission.guard';
import { Reflector } from '@nestjs/core';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  providers: [UsersService, TasksPermissionGuard, Reflector],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
