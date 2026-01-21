import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { JoinChallengeDto } from './dto/join-challenge.dto';
import { FinishChallengeDto } from './dto/finish-challenge.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ChallengeUserProgress } from './entities/challenge-user-progress.entity';
import { Repository } from 'typeorm';
import { TokenPayloadDto } from 'src/user-modules/auth/dto/token-payload.dto';
import { UserXpService } from 'src/user-modules/user-xp/user-xp.service';

@Injectable()
export class ChallengeUserProgressService {

  constructor(
    @InjectRepository(ChallengeUserProgress)
    private readonly challengeUserProgressRepository: Repository<ChallengeUserProgress>,

    private readonly userXpService: UserXpService
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

  async finishChallenge(finishChallengeDto: FinishChallengeDto, userReq: TokenPayloadDto) {

    const challengeProgress = await this.challengeUserProgressRepository.findOne({
      where: {
        id_challenge_user_progress: finishChallengeDto.id_challenge_user_progress,
        fk_id_student: userReq.sub
      },
      relations: ['challenge']
    });

    if (!challengeProgress) {

      throw new NotFoundException('Inscrição não encontrada!');

    }

    const challengeType = challengeProgress.challenge?.type;
    const challengeQuantity = challengeProgress.challenge?.quantity || 0;

    const startDate = challengeProgress.start_date;
    const startXp = challengeProgress.start_xp;

    const finishDate = new Date().toISOString();
    const finishXp = finishChallengeDto.end_xp;


    try {


      if (challengeType === 'X') {

        const isValid = this.auxValidateXpChallenge(challengeQuantity, startXp, finishXp);

        if (!isValid) throw new BadRequestException('Quantidade de XP necessária ainda não obtida: ' + challengeQuantity + ' XP');

      }
      else {

        const isValid = this.auxValidateDateCountChallenge(challengeQuantity, startDate, finishDate);

        if (!isValid) throw new BadRequestException('A data limite para finalizar este desafio já foi ultrapassada: ' + challengeQuantity + 'dia(s)');

        const courseFinished = await this.auxValidateUserFinishedCourse(challengeProgress.fk_id_student, challengeProgress.fk_id_course);

        if (!courseFinished) throw new BadRequestException('Em desafios do tipo DATA você precisa terminar o curso para reinvidicar a recompensa!');

      }

      await this.challengeUserProgressRepository.update(challengeProgress.id_challenge_user_progress, {
        end_xp: finishChallengeDto.end_xp,
        status: 'F'
      });

      const rarity = await this.auxGetRarityFromInsignia(challengeProgress.id_challenge_user_progress);

      const xpRewardQuantity = this.auxGetXpRewardByInsigniaRarity(rarity);

      //mostrar
      const updatedUserXpQuantity = await this.userXpService.addXpByChallengeConcluded(userReq.sub, xpRewardQuantity);

      return {
        message: 'Desafio finalizado com sucesso!',
        finished_user_finished_id: challengeProgress.id_challenge_user_progress,
        userXp: updatedUserXpQuantity
      }
    }

    catch (error) {

      throw error;

    }

  }

  async auxValidateUserFinishedCourse(userId: string, courseId: string) {

    const query = await this.challengeUserProgressRepository.query(
      `
      SELECT
        c.id_course,
        COUNT(DISTINCT me.id_module_episode) AS total_episodes,
        COUNT(DISTINCT CASE WHEN ep.completed = TRUE THEN me.id_module_episode END) AS completed_episodes
      FROM course c
      JOIN course_module cm
        ON cm.fk_id_course = c.id_course
      JOIN module_episode me
        ON me.fk_id_course_module = cm.id_course_module
      LEFT JOIN episode_progress ep
        ON ep.fk_id_module_episode = me.id_module_episode
      AND ep.fk_id_student = '${userId}'
      AND ep.completed = TRUE
      WHERE c.id_course = '${courseId}'
      GROUP BY c.id_course, c.title, c.description, c.difficulty_level;

      `
    );

    return query[0].total_episodes === query[0].completed_episodes ? true : false;
  }

  auxValidateXpChallenge(challengeXp: number, startXp: number, finishXp: number,) {

    const obtainedXp = finishXp - startXp;

    console.log('xp inicial: ' + startXp);

    console.log('xp final: ' + finishXp);

    console.log("xp obtido: " + obtainedXp);

    console.log(`passa? ${+ obtainedXp >= challengeXp ? true : false}`);

    return obtainedXp >= challengeXp ? true : false;

  }

  auxValidateDateCountChallenge(challengeDateCount: number, startDate: string | Date, finishDate: string | Date) {

    const start = new Date(startDate);
    const finish = new Date(finishDate);
    const diffTime = Math.abs(finish.getTime() - start.getTime());
    const daysPassed = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return daysPassed <= challengeDateCount ? true : false;

  }

  async auxGetRarityFromInsignia(challengeUserProgressId: number) {

    const rarity = await this.challengeUserProgressRepository.query(`
      select 
      i.rarity 
      from challenge cha
      inner join challenge_user_progress cup 
      on cha.id_challenge = cup.fk_id_challenge
      inner join insignia i 
      on cha.fk_id_insignia = i.id_insignia
      where cup.id_challenge_user_progress = ${challengeUserProgressId}
      `);

    return rarity[0].rarity;

  }

  auxGetXpRewardByInsigniaRarity(rarity: string){

    if(rarity === "COMMON"){

      return 100;

    }
    else if(rarity === "RARE"){

      return 200;

    }
    else if(rarity === "LEGENDARY"){

      return 300;

    }
    else {

      return 0 ;

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

    if (!challenge) throw new NotFoundException('Progresso do desafio não encontrado!');

    await this.challengeUserProgressRepository.remove(challenge);

    return {
      message: 'Desafio abandonado com sucesso!',
    }

  }
}
