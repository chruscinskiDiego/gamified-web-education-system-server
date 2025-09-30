import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Challenge } from './entities/challenge.entity';
import { Repository } from 'typeorm';
import { Insignia } from '../insignia/entities/insignia.entity';

@Injectable()
export class ChallengeService {

  constructor(
    @InjectRepository(Challenge)
    private readonly challengeRepository: Repository<Challenge>,

    @InjectRepository(Insignia)
    private readonly insigniaRepository: Repository<Insignia>,

  ) {}

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

      if(error.code === '23505') throw new ConflictException('Já existe um desafio com o título informado!');
      
      throw error;

    }
  }

  async findAllChallenges() {
    
    const challenges = await this.challengeRepository.find(
      {
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

    if(!challenge){
      throw new NotFoundException('Desafio não encontrado!');
    }

    return challenge;
  }

  async updateChallengeById(id: number, updateChallengeDto: UpdateChallengeDto) {
    
    try{

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

    }catch(error){

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

    if(!challenge){
      throw new NotFoundException('Desafio não encontrado!');
    }

    await this.challengeRepository.remove(challenge);

    return {
      message: 'Desafio removido com sucesso!',
    }

  }

  async findInsigniaExists(idInsignia : number): Promise<Insignia> {

    const insignia = await this.insigniaRepository.findOne({
        where: {
          id_insignia: idInsignia
        },
        select: {
          id_insignia: true
        }
      });

      if(!insignia) {

        throw new NotFoundException('Insígnia não encontrada!');
        
      }

      return insignia;
  }

  
}
