import { Module } from '@nestjs/common';
import { EpisodeProgressService } from './episode-progress.service';
import { EpisodeProgressController } from './episode-progress.controller';

@Module({
  controllers: [EpisodeProgressController],
  providers: [EpisodeProgressService],
})
export class EpisodeProgressModule {}
