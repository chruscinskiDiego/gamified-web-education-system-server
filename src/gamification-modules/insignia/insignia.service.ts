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

  async viewInsigniasByStudentId(id: string){

    const insignias = await this.insigniaRepository.query(
      `
      select
      i.*,
      cup.end_date as claimed_at
      from challenge_user_progress cup
      inner join challenge c 
      on cup.fk_id_challenge = c.id_challenge 
      inner join insignia i
      on c.fk_id_insignia  = i.id_insignia
      where cup.fk_id_student = '${id}'
      and cup.status = 'F'
      order by cup.end_date desc
      `
    );

    return insignias || [];

  }
}
