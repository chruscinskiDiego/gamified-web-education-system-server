import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserXpService } from './user-xp.service';
import { AuthTokenGuard } from '../auth/guards/auth-token.guard';
import { RolesGuard } from '../roles/guard/roles.guard';
import { Roles } from '../roles/decorator/roles.decorator';
import { Role } from '../roles/enum/roles.enum';
import { JwtUserReqParam } from '../auth/params/token-payload.params';
import { TokenPayloadDto } from '../auth/dto/token-payload.dto';


@UseGuards(AuthTokenGuard, RolesGuard)
@Roles(Role.STUDENT, Role.ADMIN)
@Controller('user-xp')
export class UserXpController {
  constructor(private readonly userXpService: UserXpService) {}

  @Get()
  async getUserXpByUserId(
    @JwtUserReqParam() userReq: TokenPayloadDto,
  ){
    return await this.userXpService.getUserXpByUserId(userReq.sub);
  }

}
