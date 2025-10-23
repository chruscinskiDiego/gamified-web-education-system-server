import { Controller, Get, Post, Body, Patch, Param, UseGuards, UseInterceptors, BadRequestException, UploadedFile, HttpCode, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthTokenGuard } from '../auth/guards/auth-token.guard';
import { RolesGuard } from '../roles/guard/roles.guard';
import { Roles } from '../roles/decorator/roles.decorator';
import { Role } from '../roles/enum/roles.enum';
import { JwtUserReqParam } from '../auth/params/token-payload.params';
import { TokenPayloadDto } from '../auth/dto/token-payload.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateUserAdminDto } from './dto/create-user-admin.dto';
import { PasswordRecovery } from './dto/password-recovery.dto';

@Controller('user-profile')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('/create')
  async createUserProfile(
    @Body() createUserDto: CreateUserDto
  ) {
    return await this.userService.createUserProfile(createUserDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/password-recovery')
  async passwordRecoveryByEmail(
    @Body() passwordRecoveryDto: PasswordRecovery
  ) {
    return await this.userService.passwordRecoveryByEmail(passwordRecoveryDto.email);
  }

  @UseGuards(AuthTokenGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('/create-admin')
  async createUserAdminProfile(
    @Body() createUserAdminDto: CreateUserAdminDto
  ) {
    return await this.userService.createUserAdminProfile(createUserAdminDto);
  }

  @UseGuards(AuthTokenGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 }, // 5mb de limite
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          cb(new BadRequestException('Somente imagens são permitidas'), false);
        } else {
          cb(null, true);
        }
      },
    }),
  )
  @Post('/set-profile-picture/:id')
  async setUserProfilePicture(
    @Param('id') id: string,
    @JwtUserReqParam() userReq: TokenPayloadDto,
    @UploadedFile() file: Express.Multer.File
  ) {

    if (!file) {
      throw new BadRequestException('Arquivo não enviado');
    }

    if (!id) {
      throw new BadRequestException('ID da do usuário não enviado');
    }

    return await this.userService.setUserProfilePicture(id, file, userReq.sub);

  }

  @UseGuards(AuthTokenGuard, RolesGuard)
  @Get('/view/:id')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  async findUserProfileById(
    @Param('id') id: string,
    @JwtUserReqParam() userReq: TokenPayloadDto
  ) {

    return await this.userService.findUserProfileById(id, userReq);

  }

  @UseGuards(AuthTokenGuard)
  @Patch('/update/:id')
  async updateUserProfile(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @JwtUserReqParam() userReq: TokenPayloadDto
  ) {
    return await this.userService.updateUserProfileById(id, updateUserDto, userReq);
  }

  @UseGuards(AuthTokenGuard)
  @Patch('/disable/:id')
  async disableUserProfileById(
    @Param('id') id: string,
    @JwtUserReqParam() userReq: TokenPayloadDto
  ) {
    return await this.userService.disableUserProfileById(id, userReq);
  }

}
