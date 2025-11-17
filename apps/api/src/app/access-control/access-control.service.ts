import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Role, RoleName } from '../entities/role.entity';
import { Permission } from '../entities/permission.entity';
import {
  ALL_PERMISSIONS,
  ROLE_PERMISSIONS,
  PermissionKey,
} from './permissions.constants';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AccessControlService implements OnModuleInit {
  private readonly logger = new Logger(AccessControlService.name);

  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permRepo: Repository<Permission>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>
  ) {}

  async onModuleInit() {
    this.logger.log('Seeding roles and permissions...');
    await this.seedPermissions();
    await this.seedRoles();
    await this.seedDefaultUser();
    this.logger.log('Roles and permissions seeding complete.');
  }

  private async seedPermissions() {
    // Find existing permissions
    const existing = await this.permRepo.find({
      where: { key: In(ALL_PERMISSIONS as string[]) },
    });

    const existingKeys = new Set(existing.map((p) => p.key));

    const toCreate = ALL_PERMISSIONS.filter((key) => !existingKeys.has(key));

    if (toCreate.length === 0) {
      return;
    }

    const newPerms = toCreate.map((key) =>
      this.permRepo.create({
        key,
        description: key, // simple description for now
      })
    );

    await this.permRepo.save(newPerms);
  }

  private async seedRoles() {
    const roleNames: RoleName[] = ['OWNER', 'ADMIN', 'VIEWER'];

    let roles = await this.roleRepo.find({
      where: { name: In(roleNames as RoleName[]) as any },
    });

    const existingNames = new Set<RoleName>(roles.map((r) => r.name));
    const toCreateNames = roleNames.filter((name) => !existingNames.has(name));

    if (toCreateNames.length > 0) {
      const newRoles = toCreateNames.map((name) =>
        this.roleRepo.create({
          name,
          description: `${name} role`,
        })
      );
      const saved = await this.roleRepo.save(newRoles);
      roles = [...roles, ...saved];
    }

    // NOTE: we are NOT assigning entity-level permissions here anymore.
    // The mapping lives in ROLE_PERMISSIONS and will be used in guards.
  }

  private async seedDefaultUser() {
    const existing = await this.userRepo.findOne({
      where: { email: 'owner@example.com' },
    });

    if (existing) {
      return;
    }

    const ownerRole = await this.roleRepo.findOne({
      where: { name: 'OWNER' },
    });

    const passwordHash = await bcrypt.hash('password123', 10);

    const user = this.userRepo.create({
      email: 'owner@example.com',
      name: 'Owner User',
      passwordHash,
      organizationId: 'ORG-A',
      role: ownerRole ?? null,
      roleId: ownerRole?.id ?? null,
    });

    await this.userRepo.save(user);
  }

  async getRolesWithPermissions() {
    const roles = await this.roleRepo.find({
      order: { name: 'ASC' },
    });

    return roles.map((role) => ({
      ...role,
      permissionKeys: ROLE_PERMISSIONS[role.name] ?? [],
    }));
  }
}
