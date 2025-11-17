import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../entities/role.entity';
import { Permission } from '../entities/permission.entity';
import { AccessControlService } from './access-control.service';
import { AccessControlController } from './access-control.controller';
import { User } from '../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission, User])],
  providers: [AccessControlService],
  exports: [AccessControlService],
})
export class AccessControlModule {}
