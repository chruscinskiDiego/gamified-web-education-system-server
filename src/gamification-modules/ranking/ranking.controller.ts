import { Controller, Get, UseGuards } from '@nestjs/common';
import { RankingService } from './ranking.service';
import { AuthTokenGuard } from 'src/user-modules/auth/guards/auth-token.guard';

@UseGuards(AuthTokenGuard)
@Controller('ranking')
export class RankingController {
  constructor(private readonly rankingService: RankingService) {}

  @Get()
  async getStudentsRanking() {

    return this.rankingService.getStudentsRanking();

  }

}
