import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Challenge } from './entities/challenge.entity';
import { Repository } from 'typeorm';
import { Insignia } from '../insignia/entities/insignia.entity';
import { TokenPayloadDto } from 'src/user-modules/auth/dto/token-payload.dto';

@Injectable()
export class ChallengeService {

  constructor(
    @InjectRepository(Challenge)
    private readonly challengeRepository: Repository<Challenge>,

    @InjectRepository(Insignia)
    private readonly insigniaRepository: Repository<Insignia>,

  ) { }

  async createChallenge(createChallengeDto: CreateChallengeDto) {

    const { id_insignia, ...challenge } = createChallengeDto;

    const challengeDto = {
      ...challenge,
      fk_id_insignia: id_insignia,
    };

    try {

      const insignia = await this.findInsigniaExists(id_insignia);

      if (!insignia) {
        throw new NotFoundException('Insígnia não encontrada!');
      }

      const createdChallenge = this.challengeRepository.create(challengeDto);

      const savedChallenge = await this.challengeRepository.save(createdChallenge);

      return {
        message: 'Desafio criado com sucesso!',
        created_challenge_id: savedChallenge.id_challenge,
      }

    } catch (error) {

      if (error.code === '23505') throw new ConflictException('Já existe um desafio com o título informado!');

      throw error;

    }
  }

  async findAllChallenges() {

    const challenges = await this.challengeRepository.find(
      {
        relations: {
          insignia: true,
        },
        select: {
          id_challenge: true,
          title: true,
          description: true,
          type: true,
          quantity: true,
          active: true,
        }

      }
    )

    return challenges;

  }

  async findChallengeById(id: number) {

    const challenge = await this.challengeRepository.findOne({
      where: {
        id_challenge: id
      },
      relations: {
        insignia: true,
      },
      select: {
        id_challenge: true,
        title: true,
        description: true,
        type: true,
        quantity: true,
        active: true,
        insignia: {
          id_insignia: true,
          name: true,
          description: true,
        }
      }
    });

    if (!challenge) {
      throw new NotFoundException('Desafio não encontrado!');
    }

    return challenge;
  }

  async updateChallengeById(id: number, updateChallengeDto: UpdateChallengeDto) {

    try {

      const { id_insignia, ...challenge } = updateChallengeDto;

      if (id_insignia === undefined) {
        throw new NotFoundException('Insígnia não informada!');
      }

      const insignia = await this.findInsigniaExists(id_insignia);

      if (!insignia) {
        throw new NotFoundException('Insígnia não encontrada!');
      }

      const challengeDto = {
        ...challenge,
        fk_id_insignia: id_insignia,
      };

      const updatedChallenge = await this.challengeRepository.preload({
        id_challenge: id,
        ...challengeDto
      });

      if (!updatedChallenge) {
        throw new NotFoundException('Nenhum desafio encontrado para o ID informado!');
      }

      await this.challengeRepository.save(updatedChallenge);

      return {

        message: 'Desafio atualizado com sucesso!',
        updated_challenge_id: updatedChallenge.id_challenge

      }

    } catch (error) {

      throw error;

    }
  }

  async removeChallengeById(id: number) {

    const challenge = await this.challengeRepository.findOne({
      where: {
        id_challenge: id
      },
      select: {
        id_challenge: true
      }
    });

    if (!challenge) {
      throw new NotFoundException('Desafio não encontrado!');
    }

    await this.challengeRepository.remove(challenge);

    return {
      message: 'Desafio removido com sucesso!',
    }

  }

  async findInsigniaExists(idInsignia: number): Promise<Insignia> {

    const insignia = await this.insigniaRepository.findOne({
      where: {
        id_insignia: idInsignia
      },
      select: {
        id_insignia: true
      }
    });

    if (!insignia) {

      throw new NotFoundException('Insígnia não encontrada!');

    }

    return insignia;
  }


  async findAllChallengesForStudentView(userReq: TokenPayloadDto) {

    const challenges = await this.challengeRepository.query(`
      WITH base AS (
      SELECT
        chg.id_challenge,
        chg.title,
        chg.type AS challenge_type,
        chg.active,
        cup.status,
        (cup.id_challenge_user_progress IS NOT NULL) AS user_sub
      FROM challenge chg
      LEFT JOIN LATERAL (
        SELECT cup.*
        FROM challenge_user_progress cup
        WHERE cup.fk_id_challenge = chg.id_challenge
          AND cup.fk_id_student  = '${userReq.sub}'
        ORDER BY cup.id_challenge_user_progress DESC
        LIMIT 1
      ) cup ON TRUE
      WHERE chg.active = TRUE
    )
    SELECT
      COALESCE(
        jsonb_agg(to_jsonb(base) ORDER BY base.id_challenge DESC)
          FILTER (WHERE base.user_sub),
        '[]'::jsonb
      ) AS sub_challenges,
      COALESCE(
        jsonb_agg(to_jsonb(base) order BY base.id_challenge DESC),
        '[]'::jsonb
      ) AS all_challenges
    FROM base;
      `);

    return challenges[0] ?? [];
  }

  async findChallengeByIdForStudentView(id: number, userReq: TokenPayloadDto) {

    const challenge = await this.challengeRepository.query(
      `
      SELECT
        chg.id_challenge,
        chg.title as challenge_title,
        chg.description AS challenge_description,
        chg."type"      AS challenge_type,
        chg.quantity as challenge_quantity,
        chg.active as challenge_active,
        cup.status as challenge_user_status,
        i.name          AS insignia_name,
        i.description   AS insignia_description,
        i.rarity as insignia_rarity,
        COALESCE((cup.id_challenge_user_progress IS NOT NULL), false) AS user_sub
      FROM challenge AS chg
      JOIN insignia AS i
        ON i.id_insignia = chg.fk_id_insignia
      LEFT JOIN LATERAL (
        SELECT cup.*
        FROM challenge_user_progress AS cup
        WHERE cup.fk_id_challenge = chg.id_challenge
          AND cup.fk_id_student  = '${userReq.sub}'
        ORDER BY cup.id_challenge_user_progress DESC
        LIMIT 1
      ) AS cup ON true
      WHERE chg.active = true
        AND chg.id_challenge = ${id};
      `
    );

    const coursesWithoutChallenge = await this.challengeRepository.query(`
     SELECT
      c.id_course,
      c.title
    FROM course c
    JOIN course_registration cr
      ON cr.fk_id_course = c.id_course
    WHERE cr.fk_id_student = '${userReq.sub}'
      AND NOT EXISTS (
        SELECT 1
        FROM challenge_user_progress cup
        WHERE cup.fk_id_course  = c.id_course
          AND cup.fk_id_student = cr.fk_id_student
      );
      `);

    const firstChallenge = challenge[0];

    const challengeToReturn = {

      challenge: {
        id_challenge: firstChallenge.id_challenge,
        title: firstChallenge.challenge_title,
        description: firstChallenge.challenge_description,
        quantity: firstChallenge.challenge_quantity,
        active: firstChallenge.challenge_active,
        type: firstChallenge.challenge_type,
        user_status: firstChallenge.challenge_user_status,
        user_sub: firstChallenge.user_sub,
        insignia: {
          name: firstChallenge.insignia_name,
          description: firstChallenge.insignia_description,
          rarity: firstChallenge.insignia_rarity,
        }
      },
      challenge_courses: coursesWithoutChallenge

    }

    return challengeToReturn || {};

  }

}
