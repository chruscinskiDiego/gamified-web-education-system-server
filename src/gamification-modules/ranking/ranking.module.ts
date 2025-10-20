import { Module } from '@nestjs/common';
import { RankingService } from './ranking.service';
import { RankingController } from './ranking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserXp } from 'src/user-modules/user-xp/entities/user-xp.entity';

@Module({
  imports:[TypeOrmModule.forFeature([UserXp])],
  controllers: [RankingController],
  providers: [RankingService],
})
export class RankingModule {}
