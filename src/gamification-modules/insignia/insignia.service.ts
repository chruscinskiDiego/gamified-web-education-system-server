import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInsigniaDto } from './dto/create-insignia.dto';
import { UpdateInsigniaDto } from './dto/update-insignia.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Insignia } from './entities/insignia.entity';
import { Repository } from 'typeorm';

@Injectable()
export class InsigniaService {

  constructor(
    @InjectRepository(Insignia)
    private readonly insigniaRepository : Repository<Insignia>
  ){}

  async createInsignia(createInsigniaDto: CreateInsigniaDto) {
    
    try{

      const createdInsignia = await this.insigniaRepository.create(createInsigniaDto);

      const savedInsignia = await this.insigniaRepository.save(createdInsignia);

      return {
        message: 'Insígnia criada com sucesso!',
        created_insignia_id: savedInsignia.id_insignia
      }

    }catch(error){

      throw error;

    }

  }

  async findAllInsignias() {
    
    const insignias = await this.insigniaRepository.find();

    return insignias;

  }

  async findInsigniaById(id: number) {
    
    const insignia = await this.insigniaRepository.findOne({
      where: {
        id_insignia: id
      }
    });

    if(!insignia){

      throw new NotFoundException('Nenhuma insígnia encontrada para o ID informado!');

    }

    return insignia;
  }

  async updateInsigniaById(id: number, updateInsigniaDto: UpdateInsigniaDto) {
    
    try{

      const updatedInsignia = await this.insigniaRepository.preload({
        id_insignia: id,
        ...updateInsigniaDto
      });

      if (!updatedInsignia) {
        throw new NotFoundException('Nenhuma insígnia encontrada para o ID informado!');
      }

      await this.insigniaRepository.save(updatedInsignia);

      return {

        message: 'Insígnia atualizada com sucesso!',
        updated_insignia_id: updatedInsignia.id_insignia

      }
    }catch(error){

      throw error;

    }
  }

  async removeInsigniaById(id: number) {
    

    const insignia = await this.insigniaRepository.findOne({
      where: {
        id_insignia: id
      }
    });

    if(!insignia){
      throw new NotFoundException('Insígnia não encontrada!');
    }

    await this.insigniaRepository.delete({
      id_insignia: id
    });

    return {
      message: 'Insígnia removida com sucesso!'
    }
  }
}
