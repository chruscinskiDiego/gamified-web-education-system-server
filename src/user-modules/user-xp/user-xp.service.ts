import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserXp } from './entities/user-xp.entity';
import { Repository } from 'typeorm';

//mostrar
@Injectable()
export class UserXpService {

  constructor(

    @InjectRepository(UserXp)
    private readonly userXpRepository: Repository<UserXp>,

  ) { }

  async getUserXpByUserId(id: string) {

    const userXp = await this.userXpRepository.findOne({ where: { fk_id_student: id } });

    if (!userXp) {

      throw new NotFoundException(`XP não encontrado para o ID de usuário:${id}`);

    }

    return {
      id_profile_user: id,
      id_xp: userXp.id_xp,
      points: userXp.points,
    }
  }

  async createStarterUserXpByUserId(id: string) {

    try {
      const userXp = this.userXpRepository.create({
        fk_id_student: id,
        points: 0,
      });

      await this.userXpRepository.save(userXp);

      return true;
    }
    catch (error) {

      if (error.code === '23505') {
        throw new ConflictException(`XP já criado para o ID de usuário: ${id}`);
      }

      return false;
    }
  }

  async addXpByConcludedEpisode(episodeId: number, studentId: string) {


    try {

      const userXp = await this.userXpRepository.findOne({
        where: {
          fk_id_student: studentId
        }
      });

      if (!userXp) throw new NotFoundException('XP não encontrado para o usuário!');

      const { id_xp, points, ...xpData } = userXp;

      const currentXp: number = points;

      //baseada no nível de dificuldade do curso
      const xpQuantityByEp: number = await this.validateXpQuantityByEpisodeId(episodeId);

      const newTotalXp: number = currentXp + xpQuantityByEp;

      const updatedXp = await this.userXpRepository.preload({
        id_xp: id_xp,
        points: newTotalXp,
        ...xpData
      });

      if (!updatedXp) {
        throw new NotFoundException('XP não encontrado para atualização!');
      }

      const savedUpdatedXp = await this.userXpRepository.save(updatedXp);

      return {
        xp: savedUpdatedXp
      }

    } catch (error) {

      throw error;

    }

  }

  //função para validar a quantidade de XP a ser adicionada conforme o nível de dificuldade do curso
  async validateXpQuantityByEpisodeId(id: number) {

    const difficultyQuery = await this.userXpRepository.query(`
      select 
        c.difficulty_level 
        from course c
        inner join course_module cm 
        on c.id_course = cm.fk_id_course 
        inner join module_episode me 
        on cm.id_course_module = me.fk_id_course_module 
        where me.id_module_episode = ${id}
      `);

    const difficultyLevel = difficultyQuery[0].difficulty_level;

    if (difficultyLevel === 'H') {

      return 35;

    }
    else if (difficultyLevel === 'M') {

      return 25;

    }
    else if (difficultyLevel === 'E') {

      return 15;

    }
    else {
      return 0;
    }
  }

  //função para adicionar XP quando o aluno conclui um desafio
  async addXpByChallengeConcluded(studentId: string, xpToAdd: number) {

    const userXp = await this.userXpRepository.findOne({
      where: {
        fk_id_student: studentId
      }
    });

    if (!userXp) throw new BadRequestException('XP do usuário não encontrado!');

    const updatedUserXp = userXp.points + xpToAdd;

    await this.userXpRepository.update(userXp.id_xp, {
      points: updatedUserXp
    });

    return updatedUserXp;
    
  }

}
