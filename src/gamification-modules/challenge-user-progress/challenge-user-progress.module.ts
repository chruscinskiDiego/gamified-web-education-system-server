import { Module } from '@nestjs/common';
import { ChallengeUserProgressService } from './challenge-user-progress.service';
import { ChallengeUserProgressController } from './challenge-user-progress.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChallengeUserProgress } from './entities/challenge-user-progress.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChallengeUserProgress])],
  controllers: [ChallengeUserProgressController],
  providers: [ChallengeUserProgressService],
})
export class ChallengeUserProgressModule {}
