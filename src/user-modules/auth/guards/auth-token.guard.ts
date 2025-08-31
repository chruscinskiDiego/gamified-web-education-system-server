import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import jwtConfig from "src/user-modules/auth/config/jwt.config";
import { REQUEST_TOKEN_PAYLOAD_KEY } from "../auth.constants";

@Injectable()
export class AuthTokenGuard implements CanActivate {

    constructor(
        private readonly jwtService: JwtService,
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    ){}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const token = this.extractTokenFromHeader(request);

        if(!token){
            throw new UnauthorizedException('Usuário não autenticado!');
        }

        try{

            const payload = await this.jwtService.verifyAsync(
                token,
                this.jwtConfiguration
            );

            request[REQUEST_TOKEN_PAYLOAD_KEY] = payload;

        }catch (error) {
            throw new UnauthorizedException('Usuário não autenticado!');
        }

        return true;
    }

    extractTokenFromHeader(request: Request): string | undefined {

        const authorization = request.headers?.authorization;

        if(!authorization || typeof authorization !== 'string'){
            return;
        }

        return authorization.split(' ')[1];

    }

}