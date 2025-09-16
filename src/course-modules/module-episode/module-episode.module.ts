import { Module } from '@nestjs/common';
import { ModuleEpisodeService } from './module-episode.service';
import { ModuleEpisodeController } from './module-episode.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModuleEpisode } from './entities/module-episode.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ModuleEpisode])],
  controllers: [ModuleEpisodeController],
  providers: [ModuleEpisodeService],
})
export class ModuleEpisodeModule {}
