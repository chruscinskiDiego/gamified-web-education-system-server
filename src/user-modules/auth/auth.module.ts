import { Global, Module } from "@nestjs/common";
import { HashingServiceProtocol } from "./hashing/hashing.service";
import { BcryptService } from "./hashing/bcrypt.service";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import jwtConfig from "./config/jwt.config";
import { User } from "../user/entities/user.entity";


@Global()
@Module({
    providers: [
        {
            provide: HashingServiceProtocol,
            useClass: BcryptService,
        },
        AuthService,

    ],
    controllers: [
        AuthController
    ],
    exports: [
        HashingServiceProtocol,
        ConfigModule,
    ],
    imports: [
        TypeOrmModule.forFeature([User]),
        ConfigModule.forFeature(jwtConfig),
    ]
})
export class AuthModule {}