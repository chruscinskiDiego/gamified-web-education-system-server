import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { HashingServiceProtocol } from "./hashing/hashing.service";
import jwtConfig from "./config/jwt.config";
import { ConfigType } from "@nestjs/config";
import { User } from "src/user-modules/user/entities/user.entity";
import { LoginDTO } from "./dto/login.dto";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly hashingService: HashingServiceProtocol,
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
        private readonly jwtService: JwtService,
    ) { }

    async login(loginDTO: LoginDTO) {
        const user = await this.userRepository.findOne({
            where: { email: loginDTO.email },
        });

        if (!user) {
            throw new UnauthorizedException('Email ou senha inválidos!');
        }

        if(!user.active){
            throw new UnauthorizedException('Usuário inativo. Contate o administrador do sistema.');
        }

        const passwordIsValid = await this.hashingService.compare(
            loginDTO.password,
            user.password
        );

        if (!passwordIsValid) {
            throw new UnauthorizedException('Email ou senha inválidos!');
        }

        const accessToken = await this.jwtService.signAsync(
            {
                sub: user.id_user,
                email: user.email,
                role: user.type === 'T' ? 'teacher' : user.type === 'A' ? 'admin' : 'student',
            },
            {
                secret: this.jwtConfiguration.secret,
                audience: this.jwtConfiguration.audience,
                issuer: this.jwtConfiguration.issuer,
                expiresIn: this.jwtConfiguration.expiresIn,
            }
        );

        return {
            access_token: accessToken,
            user_id: user.id_user,
            user_type: user.type,
            ...(user.profile_picture_link && { user_profile_pic: user.profile_picture_link })
        };
    }

}