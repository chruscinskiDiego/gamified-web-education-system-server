import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ChallengeService } from './challenge.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { AuthTokenGuard } from 'src/user-modules/auth/guards/auth-token.guard';
import { RolesGuard } from 'src/user-modules/roles/guard/roles.guard';
import { Roles } from 'src/user-modules/roles/decorator/roles.decorator';
import { Role } from 'src/user-modules/roles/enum/roles.enum';
import { JwtUserReqParam } from 'src/user-modules/auth/params/token-payload.params';
import { TokenPayloadDto } from 'src/user-modules/auth/dto/token-payload.dto';

@Controller('challenge')
export class ChallengeController {
  constructor(private readonly challengeService: ChallengeService) { }


  @UseGuards(AuthTokenGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('/create')
  async createChallenge(
    @Body() createChallengeDto: CreateChallengeDto
  ) {
    return this.challengeService.createChallenge(createChallengeDto);
  }

  @UseGuards(AuthTokenGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('/view-all')
  async findAllChallenges() {
    return this.challengeService.findAllChallenges();
  }

  @UseGuards(AuthTokenGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('/view-by-id/:id')
  async findChallengeById(
    @Param('id') id: string
  ) {
    return this.challengeService.findChallengeById(+id);
  }

  @UseGuards(AuthTokenGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch('/update/:id')
  async updateChallengeById(
    @Param('id') id: string,
    @Body() updateChallengeDto: UpdateChallengeDto
  ) {
    return this.challengeService.updateChallengeById(+id, updateChallengeDto);
  }

  @UseGuards(AuthTokenGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete('/delete/:id')
  async removeChallengeById(
    @Param('id') id: string
  ) {
    return this.challengeService.removeChallengeById(+id);
  }

  @UseGuards(AuthTokenGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.STUDENT)
  @Get('/student-view/all')
  async findAllChallengesForStudentView(
    @JwtUserReqParam() userReq: TokenPayloadDto
  ) {

    return this.challengeService.findAllChallengesForStudentView(userReq);

  }

  @UseGuards(AuthTokenGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.STUDENT)
  @Get('/student-view/id/:id')
  async findChallengeByIdForStudentView(
    @Param('id') id: number,
    @JwtUserReqParam() userReq: TokenPayloadDto
  ) {
    return this.challengeService.findChallengeByIdForStudentView(id, userReq)
  }
}
