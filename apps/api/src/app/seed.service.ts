// apps/api/src/app/seed.service.ts
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { User } from './entities/user.entity';
import { Role, RoleName } from './entities/role.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>
  ) {}

  async onModuleInit() {
    await this.seedDemoUsers();
  }

  private async seedDemoUsers() {
    await this.ensureUser('owner@example.com', 'password123', 'OWNER', 'ORG-A');

    await this.ensureUser(
      'viewer@example.com',
      'password123',
      'VIEWER',
      'ORG-A'
    );
  }

  private async ensureUser(
    email: string,
    password: string,
    roleName: RoleName,
    organizationId: string
  ) {
    const existing = await this.userRepo.findOne({
      where: { email },
    });

    if (existing) {
      this.logger.log(`User ${email} already exists. Skipping.`);
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // 1️⃣ Ensure the role exists
    const role = await this.ensureRole(roleName);

    // 2️⃣ Create a new user with that role entity attached
    const user = this.userRepo.create({
      email,
      passwordHash,
      organizationId,
      role, // 👈 full Role entity, not a partial { name: ... }
    });

    await this.userRepo.save(user);

    this.logger.log(`Seeded user: ${email} with role ${roleName}`);
  }

  private async ensureRole(name: RoleName): Promise<Role> {
    let role = await this.roleRepo.findOne({ where: { name } });

    if (!role) {
      role = this.roleRepo.create({ name });
      role = await this.roleRepo.save(role);
      this.logger.log(`Seeded role: ${name}`);
    }

    return role;
  }
}
