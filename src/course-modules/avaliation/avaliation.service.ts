import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAvaliationDto } from './dto/create-avaliation.dto';
import { UpdateAvaliationDto } from './dto/update-avaliation.dto';
import { TokenPayloadDto } from 'src/user-modules/auth/dto/token-payload.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Avaliation } from './entities/avaliation.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AvaliationService {

  constructor(
    @InjectRepository(Avaliation)
    private readonly avaliationRepository: Repository<Avaliation>,
  ){}
  
  async createAvaliationByCourseId(createAvaliationDto: CreateAvaliationDto, userReq: TokenPayloadDto) {
    
    const avaliationDto = {
      note: createAvaliationDto.note,
      fk_id_course: createAvaliationDto.id_course,
      fk_id_student: userReq.sub
    };

    try{

      const avaliation = await this.avaliationRepository.create(avaliationDto);

      const createdAvaliation = await this.avaliationRepository.save(avaliation);

      return {
        message: 'Avaliação criada com sucesso!',
        created_avaliation_id: createdAvaliation.id_avaliation
      }

    }catch(error){

      if(error.code === '23505'){
        throw new ConflictException('Você já fez essa avaliação para esse curso!');
      }

      if(error.code === '22P02'){
        throw new NotFoundException('Curso não encontrado!');
      }

      throw error;

    }
  }

  async deleteAvaliationById(id: number, userReq: TokenPayloadDto) {
    
    const avaliation = await this.avaliationRepository.findOneBy({id_avaliation: id});

    if(!avaliation){
      throw new NotFoundException('Avaliação não encontrada!');
    }

    if(avaliation.fk_id_student !== userReq.sub){
      throw new ForbiddenException('Você não tem permissão para deletar essa avaliação!');
    }

    this.avaliationRepository.delete({id_avaliation: id});

    return {
      message: 'Avaliação deletada com sucesso!'
    };

  }
}
