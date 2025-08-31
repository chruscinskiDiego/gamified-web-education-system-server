import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthTokenGuard } from '../auth/guards/auth-token.guard';
import { RolesGuard } from '../roles/guard/roles.guard';
import { Roles } from '../roles/decorator/roles.decorator';
import { Role } from '../roles/enum/roles.enum';
import { JwtUserReqParam } from '../auth/params/token-payload.params';
import { TokenPayloadDto } from '../auth/dto/token-payload.dto';

@Controller('user-profile')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('/create')
  async createUserProfile(
    @Body() createUserDto: CreateUserDto
  ) {
    return await this.userService.createUserProfile(createUserDto);
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
