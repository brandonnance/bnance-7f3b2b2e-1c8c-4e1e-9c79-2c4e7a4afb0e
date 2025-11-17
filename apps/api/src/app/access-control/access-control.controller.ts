import { Controller, Get } from '@nestjs/common';
import { AccessControlService } from './access-control.service';

@Controller('debug/access-control')
export class AccessControlController {
  constructor(private readonly acService: AccessControlService) {}

  @Get('roles')
  getRoles() {
    return this.acService.getRolesWithPermissions();
  }
}
