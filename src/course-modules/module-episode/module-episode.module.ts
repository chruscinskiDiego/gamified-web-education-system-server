import { Module } from '@nestjs/common';
import { ModuleEpisodeService } from './module-episode.service';
import { ModuleEpisodeController } from './module-episode.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModuleEpisode } from './entities/module-episode.entity';
import { AmazonS3Module } from 'src/external-tools/amazon-s3/amazon-s3.module';

@Module({
  imports: [TypeOrmModule.forFeature([ModuleEpisode]), AmazonS3Module],
  controllers: [ModuleEpisodeController],
  providers: [ModuleEpisodeService],
})
export class ModuleEpisodeModule {}
