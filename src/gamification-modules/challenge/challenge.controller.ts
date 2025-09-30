import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ChallengeService } from './challenge.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { AuthTokenGuard } from 'src/user-modules/auth/guards/auth-token.guard';
import { RolesGuard } from 'src/user-modules/roles/guard/roles.guard';
import { Roles } from 'src/user-modules/roles/decorator/roles.decorator';
import { Role } from 'src/user-modules/roles/enum/roles.enum';

@UseGuards(AuthTokenGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('challenge')
export class ChallengeController {
  constructor(private readonly challengeService: ChallengeService) { }

  @Post('/create')
  async createChallenge(
    @Body() createChallengeDto: CreateChallengeDto
  ) {
    return this.challengeService.createChallenge(createChallengeDto);
  }

  @Get('/view-all')
  async findAllChallenges() {
    return this.challengeService.findAllChallenges();
  }

  @Get('/view-by-id/:id')
  async findChallengeById(
    @Param('id') id: string
  ) {
    return this.challengeService.findChallengeById(+id);
  }

  @Patch('/update/:id')
  async updateChallengeById(
    @Param('id') id: string,
    @Body() updateChallengeDto: UpdateChallengeDto
  ) {
    return this.challengeService.updateChallengeById(+id, updateChallengeDto);
  }

  @Delete('/delete/:id')
  async removeChallengeById(
    @Param('id') id: string
  ) {
    return this.challengeService.removeChallengeById(+id);
  }
}
