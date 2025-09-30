import { Module } from '@nestjs/common';
import { ChallengeService } from './challenge.service';
import { ChallengeController } from './challenge.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Challenge } from './entities/challenge.entity';
import { Insignia } from '../insignia/entities/insignia.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Challenge, Insignia])],
  controllers: [ChallengeController],
  providers: [ChallengeService],
})
export class ChallengeModule {}
