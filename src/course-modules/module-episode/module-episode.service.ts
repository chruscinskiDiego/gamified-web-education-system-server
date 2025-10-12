import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateModuleEpisodeDto } from './dto/create-module-episode.dto';
import { UpdateModuleEpisodeDto } from './dto/update-module-episode.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { ModuleEpisode } from './entities/module-episode.entity';
import { DataSource, Repository } from 'typeorm';
import { Course } from '../course/entities/course.entity';
import { CourseModule } from '../course-module/entities/course-module.entity';
import { TokenPayloadDto } from 'src/user-modules/auth/dto/token-payload.dto';
import { AmazonS3Service } from 'src/external-tools/amazon-s3/amazon-s3.service';

@Injectable()
export class ModuleEpisodeService {

  constructor(
    @InjectRepository(ModuleEpisode)
    private readonly moduleEpisodeRepository: Repository<ModuleEpisode>,

    @InjectDataSource()
    private readonly dataSource: DataSource,

    private readonly amazonS3Service: AmazonS3Service
  ) { }

  async createEpisodeInModule(createModuleEpisodeDto: CreateModuleEpisodeDto, userReq: TokenPayloadDto) {

    await this.validateOrderAndTeacher(createModuleEpisodeDto, userReq);

    const { id_course_module, ...episode } = createModuleEpisodeDto;

    const episodeDto = {
      ...episode,
      fk_id_course_module: id_course_module,
    }

    try {

      const episode = await this.moduleEpisodeRepository.create(episodeDto);

      const createdEpisode = await this.moduleEpisodeRepository.save(episode);

      return {
        message: 'Episódio criado com sucesso!',
        created_episode_id: createdEpisode.id_module_episode
      }
    }
    catch (error) {
      if (error.code === '23503') {
        throw new NotFoundException('Módulo do curso não encontrado!');
      }

      if (error.code === '22P02') {
        throw new NotFoundException('ID do Módulo do curso inválido!');
      }

      throw error;
    }
  }

  async findAllEpisodesByModuleId(id: number) {

    const episodes = await this.moduleEpisodeRepository.find({
      where: {
        fk_id_course_module: id,
      },
      select: {
        id_module_episode: true,
        title: true,
        description: true,
        link_episode: true,
        order: true,
        created_at: true
      }
    });

    return episodes;

  }

  async updateEpisodeById(id: number, updateModuleEpisodeDto: UpdateModuleEpisodeDto, userReq: TokenPayloadDto) {

    const episode = await this.moduleEpisodeRepository.preload({
      id_module_episode: id,
      ...updateModuleEpisodeDto
    });

    if (!episode) {
      throw new NotFoundException(`Episódio com id ${id} não encontrado!`);
    }

    const { fk_id_course_module, ...episodeProperties } = episode;

    const updateEpisodeDTO = {
      id_course_module: fk_id_course_module,
      ...episodeProperties
    }


    await this.validateOrderAndTeacher(updateEpisodeDTO, userReq, 'update');

    await this.moduleEpisodeRepository.save(episode);

    return {
      message: 'Episódio atualizado com sucesso!',
      updated_episode_id: episode.id_module_episode
    }

  }

  async deleteEpisodeById(id: number, userReq: TokenPayloadDto) {

    const episode = await this.moduleEpisodeRepository.findOne({
      where: {
        id_module_episode: id
      }
    });

    if (!episode) {
      throw new NotFoundException('Episódio não encontrado!')
    }

    const teacher = await this.getTeacherFromCourseByModule(episode.fk_id_course_module);

    if (!teacher.teacherId) {
      throw new NotFoundException('Módulo do curso não encontrado 1 !');
    }

    if (teacher.teacherId !== userReq.sub && userReq.role !== 'admin') {
      throw new ForbiddenException('Você não tem permissão para adicionar episódios nesse módulo!');
    }

    await this.moduleEpisodeRepository.delete({
      id_module_episode: id
    });

    return {
      message: 'Episódio deletado com sucesso!'
    }

  }

  /*async getTeacherFromCourseByModule(idModule: number) {

    const teacher = await this.dataSource
      .getRepository(Course)
      .createQueryBuilder('c')
      .innerJoin(CourseModule, 'cm', 'cm.fk_id_course = c.id_course')
      .innerJoin(ModuleEpisode, 'me', 'me.fk_id_course_module = cm.id_course_module')
      .select('DISTINCT c.fk_id_teacher', 'fk_id_teacher')
      .where('me.fk_id_course_module = :idModule', { idModule })
      .getRawOne();

      console.log('teacher dentro da function: ' + JSON.stringify(teacher))

    return {
      teacherId: teacher?.fk_id_teacher ?? null
    }
  }*/

  async getTeacherFromCourseByModule(idModule: number) {
    const teacher = await this.dataSource
      .getRepository(CourseModule)
      .createQueryBuilder('cm')
      .innerJoin(Course, 'c', 'c.id_course = cm.fk_id_course')
      .select('c.fk_id_teacher', 'fk_id_teacher')
      .where('cm.id_course_module = :idModule', { idModule })
      .getRawOne();

    // se nada for encontrado, teacher será undefined
    return { teacherId: teacher?.fk_id_teacher ?? null };
  }

  async validateOrderExistsInEpisode(order: number, idModule: number) {

    const episode = await this.moduleEpisodeRepository.findOne({
      where: {
        order: order,
        fk_id_course_module: idModule
      },
      select: {
        id_module_episode: true
      }
    });

    if (episode) {
      return true;
    }

    return false;

  }

  async validateOrderAndTeacher(episode: CreateModuleEpisodeDto, userReq: TokenPayloadDto, type = 'create') {

    const teacher = await this.getTeacherFromCourseByModule(episode.id_course_module);

    if (!teacher.teacherId) {
      throw new NotFoundException('Módulo do curso não encontrado!');
    }

    if (teacher.teacherId !== userReq.sub && userReq.role !== 'admin') {
      throw new ForbiddenException('Você não tem permissão para adicionar episódios nesse módulo!');
    }

    if (type === 'create') {
      const orderExists = await this.validateOrderExistsInEpisode(episode.order, episode.id_course_module);

      if (orderExists) {
        throw new ConflictException('Já existe um episódio com essa ordem nesse módulo!');
      }
    }

  }

  async setEpisodeMedia(id: number, userReq: TokenPayloadDto, file: Express.Multer.File) {

    try {

      const episode = await this.moduleEpisodeRepository.findOne({
        where: {
          id_module_episode: id
        }
      });

      if (!episode) throw new NotFoundException("Episódio não encontrado!");

      const module = episode.fk_id_course_module;

      const mediaUrl = await this.amazonS3Service.uploadEpisodeMedia(file, module, id);

      await this.moduleEpisodeRepository.update(id, {
        link_episode: mediaUrl
      });

      return {
        message: 'Mídia inserida com sucesso!',
        media_url: mediaUrl
      }

    } catch (error) {

      throw error;

    }
  }
}
