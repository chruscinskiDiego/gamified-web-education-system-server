import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ChallengeUserProgressService } from './challenge-user-progress.service';
import { JoinChallengeDto } from './dto/join-challenge.dto';
import { FinishChallengeDto } from './dto/finish-challenge.dto';
import { JwtUserReqParam } from 'src/user-modules/auth/params/token-payload.params';
import { TokenPayloadDto } from 'src/user-modules/auth/dto/token-payload.dto';
import { AuthTokenGuard } from 'src/user-modules/auth/guards/auth-token.guard';
import { RolesGuard } from 'src/user-modules/roles/guard/roles.guard';
import { Roles } from 'src/user-modules/roles/decorator/roles.decorator';
import { Role } from 'src/user-modules/roles/enum/roles.enum';

@UseGuards(AuthTokenGuard, RolesGuard)
@Roles(Role.ADMIN, Role.STUDENT)
@Controller('challenge-user')
export class ChallengeUserProgressController {
  constructor(private readonly challengeUserProgressService: ChallengeUserProgressService) { }

  @Post('/join')
  async joinInChallenge(
    @Body() joinChallengeDto: JoinChallengeDto,
    @JwtUserReqParam() userReq: TokenPayloadDto
  ) {
    return this.challengeUserProgressService.joinInChallenge(joinChallengeDto, userReq);
  }

  @Patch('/finish')
  async finishChallenge(
    @Body() finishChallengeDto: FinishChallengeDto,
    @JwtUserReqParam() userReq: TokenPayloadDto
  ) {
    return this.challengeUserProgressService.finishChallenge(finishChallengeDto, userReq);
  }

  @Delete('/leave/:id')
  async leaveChallenge(
    @Param('id') id: number,
    @JwtUserReqParam() userReq: TokenPayloadDto
  ) {
    return this.challengeUserProgressService.leaveChallenge(id, userReq);
  }
}
