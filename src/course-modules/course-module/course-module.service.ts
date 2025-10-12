import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseModuleDto } from './dto/create-course-module.dto';
import { UpdateCourseModuleDto } from './dto/update-course-module.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseModule } from './entities/course-module.entity';
import { Repository } from 'typeorm';
import { Course } from '../course/entities/course.entity';
import { TokenPayloadDto } from 'src/user-modules/auth/dto/token-payload.dto';

@Injectable()
export class CourseModuleService {

  constructor(
    @InjectRepository(CourseModule)
    private readonly courseModuleRepository: Repository<CourseModule>,

    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) { }

  async createModuleInCourse(createCourseModuleDto: CreateCourseModuleDto, userReq: TokenPayloadDto) {

    const { id_course, ...module } = createCourseModuleDto;

    const courseValidation = await this.validateCourseAndOwner(id_course, userReq);

    if (!courseValidation.isValid) {

      throw new ForbiddenException(courseValidation.message);

    }

    const orderExists = await this.validateOrderExistsInCourse(module.order, id_course);

    if (orderExists) {
      throw new ConflictException('Já existe um módulo com essa ordem nesse curso!');
    }

    const moduleDTO = {
      fk_id_course: id_course,
      ...module
    }

    try {

      const module = await this.courseModuleRepository.create(moduleDTO);

      const createdModule = await this.courseModuleRepository.save(module);

      return {
        message: 'Módulo criado com sucesso!',
        created_module_id: createdModule.id_course_module
      }
    }
    catch (error) {
      if (error.code === '23503') {
        throw new NotFoundException('Curso não encontrado!');
      }

      if (error.code === '22P02') {
        throw new NotFoundException('ID do curso inválido!');
      }

      throw error;
    }
  }

  async getManagementCourseModuleById(moduleId: number) {

    try {

      const courseModuleWithEpisodes = await this.courseModuleRepository.query(
        `
          SELECT
          cm.id_course_module,
          cm.title,
          cm.description,
          cm.created_at,
          COALESCE(
            jsonb_agg(
              jsonb_build_object(
                'id_module_episode', me.id_module_episode ,
                'title', me.title,
                'description', me.description,
                'order', me."order",
                'link_episode', me.link_episode,
                'created_at', me.created_at
              )
              ORDER BY me.id_module_episode 
            ) FILTER (WHERE me.id_module_episode IS NOT NULL),
            '[]'::jsonb
          ) AS module_episodes
        FROM course_module cm
        LEFT JOIN module_episode me ON cm.id_course_module = me.fk_id_course_module 
        WHERE cm.id_course_module = ${moduleId}
        GROUP BY
          cm.id_course_module,
          cm.title,
          cm.description,
          cm.created_at
        `
      );

      return courseModuleWithEpisodes ? courseModuleWithEpisodes[0] : [];

    } catch (error) {

      throw error;

    }
  }


  async findAllModulesByCourseId(courseId: string) {

    const modules = await this.courseModuleRepository.find({
      where: {
        fk_id_course: courseId
      },
      select: {
        id_course_module: true,
        title: true,
        description: true,
        order: true,
        created_at: true,
      },
      order: {
        order: 'ASC',
      }
    });

    return modules;

  }



  async updateModuleById(id: number, updateCourseModuleDto: UpdateCourseModuleDto, userReq: TokenPayloadDto) {

    const module = await this.courseModuleRepository.preload({
      id_course_module: id,
      ...updateCourseModuleDto
    })

    if (!module) {
      throw new NotFoundException('Módulo não encontrado!');
    }

    const courseValidation = await this.validateCourseAndOwner(module.fk_id_course, userReq);

    if (!courseValidation.isValid) {

      throw new ForbiddenException(courseValidation.message);

    }

    const orderExists = await this.validateOrderExistsInCourse(module.order, module.fk_id_course);

    if (orderExists) {
      throw new ConflictException('Já existe um módulo com essa ordem nesse curso!');
    }

    await this.courseModuleRepository.save(module as CourseModule);

    return {
      message: 'Módulo atualizado com sucesso!',
      updated_module_id: module.id_course_module
    }
  }

  async deleteModuleById(id: number, userReq: TokenPayloadDto) {

    const moduleExists = await this.courseModuleRepository.findOne({
      where: {
        id_course_module: id
      },
      select: {
        id_course_module: true,
        fk_id_course: true
      }
    });

    if (!moduleExists) {
      throw new NotFoundException('Módulo não encontrado!');
    }

    const courseValidation = await this.validateCourseAndOwner(moduleExists?.fk_id_course as string, userReq);

    if (!courseValidation.isValid) {

      throw new ForbiddenException(courseValidation.message);

    }

    await this.courseModuleRepository.delete({ id_course_module: id });

    return {
      message: 'Módulo deletado com sucesso!'
    }
  
  }

  //utils

  async validateCourseAndOwner(idCourse: string, userReq: TokenPayloadDto) {

    const course = await this.courseRepository.findOne({
      where: {
        id_course: idCourse,
      },
      select: {
        fk_id_teacher: true
      }
    });

    if (!course) {

      return {
        isValid: false,
        message: 'Curso não encontrado!'
      }

    }

    if (course.fk_id_teacher !== userReq.sub && userReq.role !== 'admin') {

      return {
        isValid: false,
        message: 'Você não tem permissão para adicionar módulos nesse curso!'
      }
    }

    return {
      isValid: true,
      message: 'Validação bem sucedida!'
    }

  }

  async validateOrderExistsInCourse(order: number, idCourse: string) {

    const module = await this.courseModuleRepository.findOne({
      where: {
        order: order,
        fk_id_course: idCourse
      },
      select: {
        id_course_module: true
      }
    });

    if (module) {
      return true;
    }

    return false;

  }

}
