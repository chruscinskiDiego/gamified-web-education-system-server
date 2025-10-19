import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { TokenPayloadDto } from 'src/user-modules/auth/dto/token-payload.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Goal } from './entities/goal.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GoalService {

  constructor(

    @InjectRepository(Goal)
    private readonly goalRepository: Repository<Goal>

  ) { }

  async createGoal(createGoalDto: CreateGoalDto, userReq: TokenPayloadDto) {

    const goalDto = {

      description: createGoalDto.description,
      fk_id_student: userReq.sub

    }

    try {

      const createdGoal = await this.goalRepository.create(goalDto);

      const savedGoal = await this.goalRepository.save(createdGoal);

      return {

        message: 'Meta criada com sucesso!',
        created_goal_id: savedGoal.id_goal

      }

    } catch (error) {

      throw error;

    }
  }

  async findGoalsByUser(userReq: TokenPayloadDto) {

    const goals = await this.goalRepository.find({
      where: {
        fk_id_student: userReq.sub
      },
      select: {
        id_goal: true,
        description: true,
        completed: true,
        created_at: true,
      }
    });

    return goals;
  }

  async updateGoal(id: number, updateGoalDto: UpdateGoalDto, userReq: TokenPayloadDto) {

    try {

      const goal = await this.goalRepository.preload({
        id_goal: id,
        ...updateGoalDto
      });

      if (!goal) {
        throw new NotFoundException('Meta não existe!');
      }

      if (goal.fk_id_student !== userReq.sub) {
        throw new ForbiddenException('Você não tem permissão para editar metas deste usuário!');
      }

      const savedGoal = await this.goalRepository.save(goal);

      return {
        message: 'Meta atualizada com sucesso!',
        updated_goal_id: savedGoal.id_goal
      }

    } catch (error) {

      throw error;

    }

  }

  async removeGoal(id: number, userReq: TokenPayloadDto) {

    const goal = await this.goalRepository.findOne({
      where: {
        id_goal: id
      }
    });

    if( !goal ) throw new NotFoundException('Meta não encontrada!');

    if( goal.fk_id_student !== userReq.sub ) throw new ForbiddenException('Você não tem permissão para editar metas deste usuário!');

    await this.goalRepository.delete({
      id_goal: id
    });

    return {
      message: 'Meta removida com sucesso!'
    }
    
  }
}
