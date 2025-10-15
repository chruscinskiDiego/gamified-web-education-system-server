import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAvaliationDto } from './dto/create-avaliation.dto';
import { UpdateAvaliationDto } from './dto/update-avaliation.dto';
import { TokenPayloadDto } from 'src/user-modules/auth/dto/token-payload.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MaterialQualityAvaliation } from './entities/material-quality-avaliation.entity';
import { Repository } from 'typeorm';
import { DidaticsAvaliation } from './entities/didatics-avaliation.entity';
import { TeachingMethodologyAvaliation } from './entities/teaching-methodology-avaliation.entity';
import { CommentaryAvaliation } from './entities/commentary-avaliation.entity';
import { IDeleteAvaliation, IDeletedAvaliationList, IUpdateAvaliation, IUpdatedAvaliationList } from './entities/avaliation.interface';
import { DeleteAvaliationDto, DeleteAvaliationItemDto } from './dto/delete-avaliation.dto';

@Injectable()
export class AvaliationService {

  constructor(
    @InjectRepository(MaterialQualityAvaliation)
    private readonly materialQualityAvaliationRepository: Repository<MaterialQualityAvaliation>,

    @InjectRepository(DidaticsAvaliation)
    private readonly didaticsAvaliationRepository: Repository<DidaticsAvaliation>,

    @InjectRepository(TeachingMethodologyAvaliation)
    private readonly teachingMethodologyAvaliationRepository: Repository<TeachingMethodologyAvaliation>,

    @InjectRepository(CommentaryAvaliation)
    private readonly commentaryAvaliationRepository: Repository<CommentaryAvaliation>,
  ) { }

  async createAvaliationByCourseId(createAvaliationDto: CreateAvaliationDto, userReq: TokenPayloadDto) {

    const materialQualityAvaliationDto = {
      note: createAvaliationDto.materialQualityNote,
      fk_id_course: createAvaliationDto.id_course,
      fk_id_student: userReq.sub
    };

    const didaticsAvaliationDto = {
      note: createAvaliationDto.didaticsNote,
      fk_id_course: createAvaliationDto.id_course,
      fk_id_student: userReq.sub
    };

    const teachingMethodologyAvaliationDto = {
      note: createAvaliationDto.teachingMethodologyNote,
      fk_id_course: createAvaliationDto.id_course,
      fk_id_student: userReq.sub
    };

    try {

      //material quality
      const createdMaterialQualityAvaliation = await this.materialQualityAvaliationRepository.create(materialQualityAvaliationDto);
      const savedMaterialQualityAvaliation = await this.materialQualityAvaliationRepository.save(createdMaterialQualityAvaliation);

      //didatics
      const createdDidaticsAvaliation = await this.didaticsAvaliationRepository.create(didaticsAvaliationDto);
      const savedDidaticsAvaliation = await this.didaticsAvaliationRepository.save(createdDidaticsAvaliation);

      //didatics
      const createdTeachingMethodologyAvaliation = await this.teachingMethodologyAvaliationRepository.create(teachingMethodologyAvaliationDto);
      const savedTeachingMethodologyAvaliation = await this.teachingMethodologyAvaliationRepository.save(createdTeachingMethodologyAvaliation);

      let returnObject = {
        message: 'Avaliação criada com sucesso!',
        created_avaliation_id: {
          material_quality: savedMaterialQualityAvaliation.id_avaliation,
          didatics: savedDidaticsAvaliation.id_avaliation,
          teaching_methodology: savedTeachingMethodologyAvaliation.id_avaliation,
        }
      }

      if (createAvaliationDto.commentary) {

        const commentaryDto = {
          commentary: createAvaliationDto.commentary,
          fk_id_course: createAvaliationDto.id_course,
          fk_id_student: userReq.sub
        };

        const createdCommentary = await this.commentaryAvaliationRepository.create(commentaryDto);

        const savedCommentary = await this.commentaryAvaliationRepository.save(createdCommentary);

        Object.assign(returnObject.created_avaliation_id, {
          commentary: savedCommentary.id_avaliation
        });

      }

      return returnObject;

    } catch (error) {

      if (error.code === '23505') {
        throw new ConflictException('Você já fez essa avaliação para esse curso!');
      }

      if (error.code === '22P02') {
        throw new NotFoundException('Curso não encontrado!');
      }

      throw error;

    }
  }

  async updateAvaliations(updateAvaliationDto: UpdateAvaliationDto, userReq: TokenPayloadDto) {

    let updatedAvaliations: IUpdatedAvaliationList[] = [];

    try {

      if (updateAvaliationDto.materialQualityAvaliationId) {

        const materialQualityAvaliation = await this.generateAvaliationToUpdate(updateAvaliationDto.materialQualityAvaliationId, updateAvaliationDto.materialQualityNote);

        const updatedMaterialQualityAvaliation = await this.auxUpdateAvaliation(this.materialQualityAvaliationRepository, materialQualityAvaliation, userReq, 'material_quality');

        updatedAvaliations.push(updatedMaterialQualityAvaliation);

      }

      if (updateAvaliationDto.didaticsAvaliationId) {

        const didaticsAvaliation = await this.generateAvaliationToUpdate(updateAvaliationDto.didaticsAvaliationId, updateAvaliationDto.didaticsNote);

        const updatedDidaticsAvaliation = await this.auxUpdateAvaliation(this.didaticsAvaliationRepository, didaticsAvaliation, userReq, 'didatics');

        updatedAvaliations.push(updatedDidaticsAvaliation);

      }

      if (updateAvaliationDto.teachingMethodologyAvaliationId) {

        const teachingMethodologyAvaliation = await this.generateAvaliationToUpdate(updateAvaliationDto.teachingMethodologyAvaliationId, updateAvaliationDto.teachingMethodologyNote);

        const updatedTeachingMethodologyAvaliation = await this.auxUpdateAvaliation(this.teachingMethodologyAvaliationRepository, teachingMethodologyAvaliation, userReq, 'teaching_methodology');

        updatedAvaliations.push(updatedTeachingMethodologyAvaliation);

      }

      if (updateAvaliationDto.commentaryId) {

        const commentary = await this.generateAvaliationToUpdate(updateAvaliationDto.commentaryId, undefined, updateAvaliationDto.commentary);

        const updatedCommentary = await this.auxUpdateAvaliation(this.commentaryAvaliationRepository, commentary, userReq, 'commentary');

        updatedAvaliations.push(updatedCommentary);

      }

      return {
        message: 'Avaliações atualizadas com sucesso!',
        updates: updatedAvaliations
      }

    } catch (error) {
      throw error;
    }

  }

  async generateAvaliationToUpdate(
    idAvaliation: number,
    note?: number,
    commentary?: string
  ): Promise<IUpdateAvaliation> {

    const avaliationDto: IUpdateAvaliation = {
      id_avaliation: idAvaliation,
      ...(note !== undefined && { note: note }),
      ...(commentary !== undefined && { commentary: commentary })
    };

    return avaliationDto;

  }

  async auxUpdateAvaliation(
    repository: Repository<MaterialQualityAvaliation | DidaticsAvaliation | TeachingMethodologyAvaliation | CommentaryAvaliation>,
    avaliationBody: IUpdateAvaliation,
    userReq: TokenPayloadDto,
    type: string
  ) {

    const { id_avaliation, ...avaliation } = avaliationBody;

    const updateAvaliation = await repository.preload({
      id_avaliation: avaliationBody.id_avaliation,
      ...avaliation
    });

    if (!updateAvaliation) {
      throw new NotFoundException('Avaliação não encontrada!');
    }

    if (updateAvaliation.fk_id_student !== userReq.sub) {
      throw new ForbiddenException('Você não tem permissão para editar essa avaliação!');
    }

    await repository.save(updateAvaliation);

    return {
      avaliation_type: type,
      updated_avaliation_id: updateAvaliation.id_avaliation
    }

  };

  async auxDeleteAvaliations(
    avaliations: DeleteAvaliationItemDto[],
    userReq: TokenPayloadDto,
  ) {

    let deletedAvaliations: IDeletedAvaliationList[] = [];

    try {

      for (const av of avaliations) {

        const repository: Repository<MaterialQualityAvaliation | DidaticsAvaliation | TeachingMethodologyAvaliation | CommentaryAvaliation> =
          av.avaliation_type === 'material_quality' ? this.materialQualityAvaliationRepository :
            av.avaliation_type === 'didatics' ? this.didaticsAvaliationRepository :
              av.avaliation_type === 'teaching_methodology' ? this.teachingMethodologyAvaliationRepository :
                av.avaliation_type === 'commentary' ? this.commentaryAvaliationRepository :
                  this.materialQualityAvaliationRepository;

        const avaliation = await repository.findOneBy({ id_avaliation: av.delete_avaliation_id });

        if (!avaliation) {
          throw new NotFoundException(`Avaliação não encontrada! Tipo: ${av.avaliation_type} | ID: ${av.delete_avaliation_id}`);
        }

        if (avaliation.fk_id_student !== userReq.sub) {
          throw new ForbiddenException('Você não tem permissão para deletar essa avaliação!');
        }

        await repository.delete({ id_avaliation: av.delete_avaliation_id });

        deletedAvaliations.push({
          deleted_avaliation_id: avaliation.id_avaliation,
          avaliation_type: av.avaliation_type
        });

      }

      return deletedAvaliations;

    } catch (error) {

      throw error;

    }

  };

  async deleteAvaliation(deleteAvaliationDto: DeleteAvaliationDto, userReq: TokenPayloadDto) {

    const deletedAvaliations = await this.auxDeleteAvaliations(deleteAvaliationDto.avaliations, userReq);

    return {
      message: 'Avaliação deletada com sucesso!',
      deleted: deletedAvaliations
    };

  }
}
