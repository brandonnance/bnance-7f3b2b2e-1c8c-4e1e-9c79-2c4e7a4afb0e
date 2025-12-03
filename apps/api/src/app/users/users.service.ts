import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../entities/user.entity';
import { Role, RoleName } from '../entities/role.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>
  ) {}

  async create(dto: CreateUserDto) {
    if (!dto.email || !dto.password) {
      throw new BadRequestException('Email and password are required');
    }

    const existing = await this.userRepo.findOne({
      where: { email: dto.email },
    });

    if (existing) {
      throw new BadRequestException('Email is already in use');
    }

    const roleName = ((dto.roleName ?? 'VIEWER') as string).toUpperCase() as RoleName;
    const role = await this.roleRepo.findOne({ where: { name: roleName } });

    if (!role) {
      throw new BadRequestException(`Role ${roleName} does not exist`);
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = this.userRepo.create({
      email: dto.email,
      name: dto.name ?? null,
      passwordHash,
      organizationId: dto.organizationId ?? null,
      roleId: role.id,
      role,
    });

    const saved = await this.userRepo.save(user);

    const { passwordHash: _ignored, ...safeUser } = saved;
    return safeUser;
  }
}
