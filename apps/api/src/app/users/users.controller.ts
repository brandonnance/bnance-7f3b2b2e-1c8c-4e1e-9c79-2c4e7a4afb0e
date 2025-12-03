import {
  Body,
  Controller,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { TasksPermissionGuard } from '../tasks/tasks-permission.guard';
import { RequirePermission } from '../access-control/permission.decorator';

@Controller('users')
@UseGuards(TasksPermissionGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @RequirePermission('users.manage')
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    })
  )
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }
}
