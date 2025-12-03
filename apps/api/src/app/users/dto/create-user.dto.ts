import {
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  name?: string | null;

  @IsOptional()
  @IsString()
  organizationId?: string | null;

  @IsOptional()
  @IsIn(['OWNER', 'ADMIN', 'VIEWER'])
  roleName?: 'OWNER' | 'ADMIN' | 'VIEWER';
}
