import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AdmService } from './adm.service';
import { FindUserDto } from './dto/find-user.dto';
import { AuthTokenGuard } from '../auth/guards/auth-token.guard';
import { RolesGuard } from '../roles/guard/roles.guard';
import { Roles } from '../roles/decorator/roles.decorator';
import { Role } from '../roles/enum/roles.enum';

@UseGuards(AuthTokenGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('adm')
export class AdmController {
  constructor(
    private readonly admService: AdmService
  ) { }


  @HttpCode(HttpStatus.OK)
  @Post('/find-user-profile')
  async findUserProfile(
    @Body() findUserDto: FindUserDto
  ) {

    return await this.admService.findUserProfile(findUserDto.property, findUserDto.value);

  }
}
