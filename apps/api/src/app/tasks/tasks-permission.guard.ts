import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSION_KEY } from '../access-control/permission.decorator';
import {
  ROLE_PERMISSIONS,
  PermissionKey,
} from '../access-control/permissions.constants';
import { RoleName } from '../entities/role.entity';

@Injectable()
export class TasksPermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Which permission does this endpoint require?
    const required = this.reflectRequiredPermission(context);
    if (!required) {
      // No permission metadata -> allow
      return true;
    }

    const request = context.switchToHttp().getRequest();

    //  Now we read role from the JWT-decoded user
    const user = request.user as
      | { role?: string; organizationId?: string; userId?: string }
      | undefined;

    if (!user || !user.role) {
      throw new ForbiddenException('User has no role assigned');
    }

    const role = user.role.toUpperCase() as RoleName;

    const allowedPermissions = ROLE_PERMISSIONS[role] ?? [];

    if (!allowedPermissions.includes(required)) {
      throw new ForbiddenException(
        `Role ${role} does not have permission ${required}`
      );
    }

    return true;
  }

  private reflectRequiredPermission(
    context: ExecutionContext
  ): PermissionKey | undefined {
    const handler = context.getHandler();
    const cls = context.getClass();
    const permission = this.reflector.getAllAndOverride<PermissionKey>(
      PERMISSION_KEY,
      [handler, cls]
    );
    return permission;
  }
}
