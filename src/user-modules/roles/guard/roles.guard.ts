import { Injectable, CanActivate, ExecutionContext, UnauthorizedException,} from '@nestjs/common';
import { REQUEST_TOKEN_PAYLOAD_KEY } from '../../auth/auth.constants';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorator/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {

  constructor(private reflector: Reflector){}

  canActivate(context: ExecutionContext): boolean {

    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) return true;

    const req = context.switchToHttp().getRequest();
  
    const payload = req[REQUEST_TOKEN_PAYLOAD_KEY] ?? req.userPayload;

    if (!payload) {
      throw new UnauthorizedException('Usuário não autenticado');
    }

    const userRole = payload.role;

    const hasRole = requiredRoles.some((role) => role === userRole);

    if (!hasRole) {
      throw new UnauthorizedException('Acesso negado');
    }

    return true;
    
  }

}
