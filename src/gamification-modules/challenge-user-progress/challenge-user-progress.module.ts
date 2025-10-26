import { Module } from '@nestjs/common';
import { ChallengeUserProgressService } from './challenge-user-progress.service';
import { ChallengeUserProgressController } from './challenge-user-progress.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChallengeUserProgress } from './entities/challenge-user-progress.entity';
import { UserXpModule } from 'src/user-modules/user-xp/user-xp.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChallengeUserProgress]),
    UserXpModule
  ],
  controllers: [ChallengeUserProgressController],
  providers: [ChallengeUserProgressService],
})
export class ChallengeUserProgressModule { }
