import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Not, Repository } from 'typeorm';
import { HashingServiceProtocol } from '../auth/hashing/hashing.service';
import { UserXpService } from '../user-xp/user-xp.service';
import { TokenPayloadDto } from '../auth/dto/token-payload.dto';
import { AmazonS3Service } from 'src/external-tools/amazon-s3/amazon-s3.service';
import { CreateUserAdminDto } from './dto/create-user-admin.dto';
import { MailService } from 'src/external-tools/mail/mail.service';
import { randomInt } from 'crypto';
import { PasswordUpdateDto } from './dto/password-update.dto';

@Injectable()
export class UserService {

  constructor(

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly hashingService: HashingServiceProtocol,

    private readonly userXpService: UserXpService,

    private readonly amazonS3Service: AmazonS3Service,

    private readonly mailService: MailService

  ) { }

  async createUserProfile(createUserDto: CreateUserDto) {

    try {

      const { password, ...userData } = createUserDto;

      const passwordHash = await this.hashingService.hash(password);

      const userDTO = {
        ...userData,
        password: passwordHash,
      };

      const user = await this.userRepository.create(userDTO as User);

      const createdUser = await this.userRepository.save(user);

      if (user.type === 'S') {
        const createdStarterXp = await this.userXpService.createStarterUserXpByUserId(createdUser.id_user);

        if (!createdStarterXp) {
          throw new ConflictException(`XP já criado para o ID de usuário: ${createdUser.id_user}`);
        }

      }

      return {
        message: 'Usuário criado com sucesso!',
        created_user_id: createdUser.id_user
      }

    }
    catch (error) {

      if (error.code === '23505') {

        throw new ConflictException('Email já cadastrado');

      }

      throw error;

    }
  }

  async createUserAdminProfile(createUserDto: CreateUserAdminDto) {

    try {

      const { password, ...userData } = createUserDto;

      const passwordHash = await this.hashingService.hash(password);

      const userDTO = {
        ...userData,
        password: passwordHash,
        type: 'A'
      };

      const user = await this.userRepository.create(userDTO as User);

      const createdUser = await this.userRepository.save(user);

      const createdStarterXp = await this.userXpService.createStarterUserXpByUserId(createdUser.id_user);

      if (!createdStarterXp) {
        throw new ConflictException(`XP já criado para o ID de usuário: ${createdUser.id_user}`);
      }

      return {
        message: 'Usuário ADM criado com sucesso!',
        created_user_id: createdUser.id_user
      }

    }
    catch (error) {

      if (error.code === '23505') {

        throw new ConflictException('Email já cadastrado');

      }

      throw error;

    }
  }

    async updateUserPasswordById(id:string, userPasswordDto: PasswordUpdateDto) {

    try {

      const { password } = userPasswordDto;

      const passwordHash = await this.hashingService.hash(password);

      await this.userRepository.update(id, {
        password: passwordHash
      });

      return {
        message: 'Senha de usuário atualizada com sucesso!'
      }

    }
    catch (error) {

      if (error.code === '23505') {

        throw new ConflictException('Email já cadastrado');

      }

      throw error;

    }
  }

  async findAllAdminUsers(){

    const admins = await this.userRepository.find({
      where:{
        type: 'A' as any,
      },
      select: {
        id_user: true,
        name: true,
        surname: true,
        email: true,
        profile_picture_link: true,
        active: true
      }
    });

    return admins;
  }

  async setUserProfilePicture(id: string, file: Express.Multer.File, sub: string) {

    if (sub !== id) {
      throw new UnauthorizedException(`Você não tem permissão para alterar a foto de perfil de outro usuário.`);
    }

    try {

      const imageUrl: string = await this.amazonS3Service.uploadProfilePicture(file, id);

      await this.userRepository.update(id, {
        profile_picture_link: imageUrl
      });

      return {
        message: 'Foto de perfil atualizada com sucesso!',
        profile_picture_link: imageUrl
      }

    } catch (error) {

      throw error;

    }
  }

  async findUserProfileById(id: string, jwtUserReq: TokenPayloadDto) {

    if ((jwtUserReq.sub !== id) && (jwtUserReq.role !== 'admin')) {
      throw new UnauthorizedException(`Você não tem permissão para acessar o perfil de outro usuário.`);
    }

    const user = await this.userRepository.findOne({
      where: { id_user: id },
      select: {
        id_user: true,
        name: true,
        surname: true,
        email: true,
        profile_picture_link: true,
        birth_date: true,
        active: true,
      }
    });

    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    return user;

  }

  async updateUserProfileById(id: string, updateUserDto: UpdateUserDto, jwtUserReq: TokenPayloadDto) {

    if ((jwtUserReq.sub !== id) && (jwtUserReq.role !== 'admin')) {
      throw new UnauthorizedException(`Você não tem permissão para acessar o perfil de outro usuário.`);
    }

    const user = await this.userRepository.preload({
      id_user: id,
      ...updateUserDto,
    });

    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    await this.userRepository.save(user);

    return {
      message: 'Usuário atualizado com sucesso!',
      updated_user_id: user.id_user
    }

  }

  async disableUserProfileById(id: string, jwtUserReq: TokenPayloadDto) {

    if ((jwtUserReq.sub !== id) && (jwtUserReq.role !== 'admin')) {
      throw new UnauthorizedException(`Você não tem permissão para acessar o perfil de outro usuário.`);
    }

    const user = await this.userRepository.findOne({
      where: {
        id_user: id
      },
      select: {
        id_user: true,
        active: true,
      }
    });


    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    if (!user.active) {
      throw new ConflictException(`Usuário com ID ${id} já está desativado`);
    }

    await this.userRepository.update(id, {
      active: false
    });

    return {
      message: 'Usuário desativado com sucesso!',
      deactivated_user_id: user.id_user
    }
  }

  async enableUserProfileById(id: string, jwtUserReq: TokenPayloadDto) {

    if ((jwtUserReq.sub !== id) && (jwtUserReq.role !== 'admin')) {
      throw new UnauthorizedException(`Você não tem permissão para acessar o perfil de outro usuário.`);
    }

    const user = await this.userRepository.findOne({
      where: {
        id_user: id
      },
      select: {
        id_user: true,
        active: true,
      }
    });


    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    if (user.active) {
      throw new ConflictException(`Usuário com ID ${id} já está ativado`);
    }

    await this.userRepository.update(id, {
      active: true
    });

    return {
      message: 'Usuário ativado com sucesso!',
      activated_user_id: user.id_user
    }
  }

  async passwordRecoveryByEmail(email: string) {

    try {

      const newPassword = this.generateRandomPassword();

      const hashedPassword = await this.hashingService.hash(newPassword);

      const result = await this.userRepository.update(
        {
          email
        },
        {
          password: hashedPassword
        }
      );

      if (result.affected === 0) {
        throw new NotFoundException('Usuário não encontrado');
      }

      const response = await this.mailService.send({
        to: email,
        subject: 'Sua nova senha',
        html: `
        <!doctype html>
        <html lang="pt-br">
          <head>
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
            <meta name="x-apple-disable-message-reformatting" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>{{titulo}}</title>
          </head>
          <body style="margin:0; padding:0; background:#f3f6fb;">
            <!-- Wrapper -->
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f3f6fb;">
              <tr>
                <td align="center" style="padding:24px;">
                  <!-- Card -->
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px; width:100%; background:#ffffff; border-radius:12px; overflow:hidden;">
                    <!-- Top gradient bar -->
                    <tr>
                      <td style="
                        height:6px;
                        line-height:6px;
                        background:#5D70F6;
                        background-image:linear-gradient(90deg, #5D70F6 0%, #49A0FB 100%);
                      ">&nbsp;</td>
                    </tr>

                    <!-- Content -->
                    <tr>
                      <td style="padding:24px 28px 28px 28px; font-family:Arial, Helvetica, sans-serif; color:#2a2a2a;">
                        <h1 style="margin:0; font-size:20px; line-height:1.3; font-weight:700; color:#1f1f1f;">
                          Nova senha gerada com sucesso!
                        </h1>
                        <!-- tiny decorative underline -->
                        <div style="
                          margin:10px 0 18px 0;
                          width:88px;
                          height:4px;
                          background:#5D70F6;
                          background-image:linear-gradient(90deg, #5D70F6 0%, #49A0FB 100%);
                          border-radius:999px;
                        "></div>

                        <p style="margin:0 0 14px 0; font-size:15px; line-height:1.6; color:#3a3a3a;">
                          Essa é sua nova senha: <strong>${newPassword}</strong>
                        </p>

                      </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                      <td style="padding:14px 28px 24px 28px; font-family:Arial, Helvetica, sans-serif; text-align:center;">
                        <span style="display:inline-block; font-size:12px; color:#8a8a8a;">
                          © 2025 — Enviado automaticamente
                        </span>
                      </td>
                    </tr>
                  </table>
                  <!-- /Card -->
                </td>
              </tr>
            </table>
          </body>
        </html>

        `
      });

      const sendedEmailId = response.messageId;
      const accepted = response.accepted.length > 0;

      if (!accepted) {

        return {

          message: 'Seu gerenciador de e-mail não aceitou a mensagem contendo a nova senha, verifique as configurações'

        }

      }

      return {
        message: `Nova senha enviada para o e-mail ${email}`,
        emailId: sendedEmailId
      }

    } catch (error) {

      throw error;

    }

  }

  generateRandomPassword(length = 14) {

    const charset = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789@#$%?';

    return Array.from({ length }, () => charset[randomInt(0, charset.length)]).join('');

  }

}
