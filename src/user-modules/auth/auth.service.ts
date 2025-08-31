import { Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { HashingServiceProtocol } from "./hashing/hashing.service";
import jwtConfig from "./config/jwt.config";
import { ConfigType } from "@nestjs/config";
import { User } from "src/user-modules/user/entities/user.entity";

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly hashingService: HashingServiceProtocol,
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    ) { }

    /*async login(loginDTO: LoginDTO) {

        let passwordIsValid = false;

        const user = await this.usersRepository.findOneBy({
            email: loginDTO.email
        });

        if (user) {
            passwordIsValid = await this.hashingService.compare(
                loginDTO.password,
                user.password
            );

            passwordIsValid = true;
        };

        if (!user || !passwordIsValid) {
            throw new UnauthorizedException('Email ou senha inválidos!');
        }

        const accessToken = await this.jwtService.signAsync(
            {
                sub: user.id_user,
                email: user.email,
                role: user.role,
            },
            {
                secret: this.jwtConfiguration.secret,
                audience: this.jwtConfiguration.audience,
                issuer: this.jwtConfiguration.issuer,
                expiresIn: this.jwtConfiguration.expiresIn,
            }
        );

        await this.loginLogsService.createLoginLog({
            userId: user.id_user,
            userEmail: user.email,
            userName: user.name,
            loginDate: new Date().toISOString()
        });

        //TODO OLHAR MELHOR ESSA PARTE DO CÓDIGO

        return {
            accessToken,
            userId: user.id_user,
        }
    }*/
}