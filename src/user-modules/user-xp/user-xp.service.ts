import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserXpDto } from './dto/create-user-xp.dto';
import { UpdateUserXpDto } from './dto/update-user-xp.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserXp } from './entities/user-xp.entity';
import { Repository } from 'typeorm';

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

}
