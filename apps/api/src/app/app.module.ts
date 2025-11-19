import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Organization } from './entities/organization.entity';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { permission } from 'process';
import { Task } from './entities/task.entity';
import { TasksModule } from './tasks/tasks.module';
import { AccessControlModule } from './access-control/access-control.module';
import { AuditLog } from './audit-log/audit-log.entity';
import { AuditLogModule } from './audit-log/audit-log.module';
import { AuthModule } from './auth/auth.module';
import { SeedService } from './seed.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'dev.sqlite',
      entities: [User, Organization, Role, Permission, Task, AuditLog],
      synchronize: true,
      dropSchema: true,
    }),
    TasksModule,
    AccessControlModule,
    AuditLogModule,
    AuthModule,
    TypeOrmModule.forFeature([User, Organization, Role, Permission, Task]),
  ],
  controllers: [AppController],
  providers: [AppService, SeedService],
})
export class AppModule {}
