import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { EpisodeProgressService } from './episode-progress.service';
import { SaveEpisodeProgressDto } from './dto/create-episode-progress.dto';
import { JwtUserReqParam } from 'src/user-modules/auth/params/token-payload.params';
import { AuthTokenGuard } from 'src/user-modules/auth/guards/auth-token.guard';

@UseGuards(AuthTokenGuard)
@Controller('episode-progress')
export class EpisodeProgressController {
  constructor(private readonly episodeProgressService: EpisodeProgressService) {}

  @Post('/save')
  async createEpisodeProgress(
    @Body() createEpisodeProgressDto: SaveEpisodeProgressDto,
    @JwtUserReqParam() userReq
  ) {
    return this.episodeProgressService.createEpisodeProgress(createEpisodeProgressDto, userReq);
  }

}
