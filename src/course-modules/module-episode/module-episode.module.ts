import { Module } from '@nestjs/common';
import { ModuleEpisodeService } from './module-episode.service';
import { ModuleEpisodeController } from './module-episode.controller';

@Module({
  controllers: [ModuleEpisodeController],
  providers: [ModuleEpisodeService],
})
export class ModuleEpisodeModule {}
