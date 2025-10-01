import { Injectable, NotFoundException } from '@nestjs/common';
import { JoinChallengeDto } from './dto/join-challenge.dto';
import { FinishChallengeDto } from './dto/finish-challenge.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ChallengeUserProgress } from './entities/challenge-user-progress.entity';
import { Repository } from 'typeorm';
import { TokenPayloadDto } from 'src/user-modules/auth/dto/token-payload.dto';

@Injectable()
export class ChallengeUserProgressService {

  constructor(
    @InjectRepository(ChallengeUserProgress)
    private readonly challengeUserProgressRepository: Repository<ChallengeUserProgress>,
  ) { }

  async joinInChallenge(joinChallengeDto: JoinChallengeDto, userReq: TokenPayloadDto) {

    const joinChallenge = {
      start_xp: joinChallengeDto.start_xp,
      fk_id_challenge: joinChallengeDto.id_challenge,
      fk_id_student: userReq.sub,
      fk_id_course: joinChallengeDto.id_course,
    };

    try {

      const createdJoinChallenge = await this.challengeUserProgressRepository.create(joinChallenge);

      const savedJoinChallenge = await this.challengeUserProgressRepository.save(createdJoinChallenge);

      return {
        message: 'Desafio iniciado com sucesso!',
        joined_challenge_user_id: savedJoinChallenge.id_challenge_user_progress
      }

    } catch (error) {

      if (error.code === '23503') throw new NotFoundException('Desafio não encontrado!');
      
      throw error;
    }
  }

  async finishChallenge( finishChallengeDto: FinishChallengeDto, userReq: TokenPayloadDto) {

    const finishedChallenge = await this.challengeUserProgressRepository.preload({
      id_challenge_user_progress: finishChallengeDto.id_challenge_user_progress,
      end_xp: finishChallengeDto.end_xp,
      status: 'F',
    });

    if(! finishedChallenge ) throw new NotFoundException('Progresso do desafio não encontrado!');

    if( finishedChallenge.fk_id_student !== userReq.sub ) throw new NotFoundException('Progresso do desafio não encontrado!');
    
    await this.challengeUserProgressRepository.save(finishedChallenge);

    return {
      message: 'Desafio finalizado com sucesso!',
      finished_user_finished_id: finishedChallenge.id_challenge_user_progress
    }

  }

  async leaveChallenge(id: number, userReq: TokenPayloadDto) {

    const challenge = await this.challengeUserProgressRepository.findOne({
      where: {
        id_challenge_user_progress: id,
        fk_id_student: userReq.sub,
        status: 'P'
      },
      select: {
        id_challenge_user_progress: true
      }
    });

    if( !challenge ) throw new NotFoundException('Progresso do desafio não encontrado!');

    await this.challengeUserProgressRepository.remove(challenge);

    return {
      message: 'Desafio abandonado com sucesso!',
    }
    
  }
}
