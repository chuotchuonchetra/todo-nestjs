import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import type { Role } from '../user/role.enum.js';
import { ROLES_KEY } from './decorators/roles.decorator.js';
import type { AuthUser } from './jwt.strategy.js';

// runs after JwtAuthGuard, so req.user is already set
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(ctx: ExecutionContext) {
    const roles = this.reflector.getAllAndOverride<Role[] | undefined>(
      ROLES_KEY,
      [ctx.getHandler(), ctx.getClass()],
    );
    if (!roles?.length) return true;
    const { user } = ctx
      .switchToHttp()
      .getRequest<Request & { user?: AuthUser }>();
    return !!user && roles.includes(user.role);
  }
}
