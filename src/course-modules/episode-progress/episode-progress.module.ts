import { Module } from '@nestjs/common';
import { EpisodeProgressService } from './episode-progress.service';
import { EpisodeProgressController } from './episode-progress.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EpisodeProgress } from './entities/episode-progress.entity';
import { UserModule } from 'src/user-modules/user/user.module';
import { UserXpModule } from 'src/user-modules/user-xp/user-xp.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EpisodeProgress]),
    UserModule,
    UserXpModule
  ],
  controllers: [EpisodeProgressController],
  providers: [EpisodeProgressService],
})
export class EpisodeProgressModule {}
