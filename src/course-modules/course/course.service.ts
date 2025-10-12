import { ConflictException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { Repository } from 'typeorm';
import { TokenPayloadDto } from 'src/user-modules/auth/dto/token-payload.dto';
import { AmazonS3Service } from 'src/external-tools/amazon-s3/amazon-s3.service';

@Injectable()
export class CourseService {

  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,

    private readonly amazonS3Service: AmazonS3Service
  ) { }

  async createCourse(createCourseDto: CreateCourseDto, idTeacher: string) {

    const { id_category, ...course } = createCourseDto;

    const courseDTO = {
      fk_id_category: id_category,
      fk_id_teacher: idTeacher,
      ...course
    }

    try {

      const course = await this.courseRepository.create(courseDTO);

      const createdCourse = await this.courseRepository.save(course);

      return {
        message: 'Curso criado com sucesso!',
        created_course_id: createdCourse.id_course
      }
    }
    catch (error) {

      if (error.code === '23503') {
        throw new NotFoundException('Categoria ou professor não encontrado!');
      }

      throw error;
    }
  }

  async updateCourseById(id: string, updateCourseDto: UpdateCourseDto, userReq: TokenPayloadDto) {

    const course = await this.courseRepository.preload({
      id_course: id,
      ...updateCourseDto
    });

    if ((course?.fk_id_teacher !== userReq.sub) && (userReq.role !== 'admin')) {
      throw new ForbiddenException('Você não tem permissão para editar esse curso!');
    }

    await this.courseRepository.save(course as Course);

    return {
      message: 'Curso atualizado com sucesso!',
      updated_course_id: course?.id_course
    }

  }

  async disableCourseById(id: string, userReq: TokenPayloadDto) {

    const course = await this.courseRepository.preload({
      id_course: id,
      active: false
    });

    if ((course?.fk_id_teacher !== userReq.sub) && (userReq.role !== 'admin')) {
      throw new ForbiddenException('Você não tem permissão para desabilitar esse curso!');
    }

    if (!course) {
      throw new NotFoundException(`Curso com ID ${id} não encontrado.`);
    }

    if (!course.active) {
      throw new ConflictException('Esse curso já está desativado!');
    }

    await this.courseRepository.save(course);

    return {
      message: 'Curso desativado com sucesso!',
      disabled_course_id: course.id_course
    }

  }

  async getCoursesByTeacher(id: string) {

    const courses = await this.courseRepository.query(
      `
      SELECT
        c.id_course,
        c.title,
        c.description,
        c.link_thumbnail,
        c.difficulty_level,
        c.created_at,
        COUNT(cm.id_course_module) AS module_count
      FROM 
        course c
      LEFT JOIN 
        course_module cm 
        ON c.id_course = cm.fk_id_course
      WHERE c.fk_id_teacher = '${id}'
      GROUP BY 
        c.id_course, 
        c.title, 
        c.description, 
        c.link_thumbnail, 
        c.difficulty_level
      ORDER BY c.created_at DESC
      `
    );

    return courses || [];

  }

  async setCourseThumbnail(courseId: string, file: Express.Multer.File, userReq: TokenPayloadDto) {

    try {

      await this.auxValidateCourseAndTeacher(courseId, userReq);

      const imageUrl: string = await this.amazonS3Service.uploadCoursePicture(file, courseId);

      await this.courseRepository.update(courseId, {
        link_thumbnail: imageUrl
      });

      return {
        message: 'Foto do curso atualizada com sucesso!',
        course_picture_link: imageUrl
      }

    } catch (error) {

      throw error;

    }
  }

  async getManagementCourseById(courseId: string, userReq: TokenPayloadDto) {

    try {

      this.auxValidateCourseAndTeacher(courseId, userReq);

      const courseWithModules = await this.courseRepository.query(
        `
      SELECT
        c.id_course,
        c.title,
        c.description,
        c.link_thumbnail,
        c.difficulty_level,
        c.created_at,
        c.active,
        ct.id_category,
        COALESCE(
          jsonb_agg(
            jsonb_build_object(
              'id_module', cm.id_course_module,
              'title', cm.title,
              'description', cm.description,
              'order', cm."order",
              'created_at', cm.created_at
            )
            ORDER BY cm.id_course_module
          ) FILTER (WHERE cm.id_course_module IS NOT NULL),
          '[]'::jsonb
        ) AS course_modules
      FROM course c
      LEFT JOIN course_module cm ON cm.fk_id_course = c.id_course
      LEFT JOIN category ct ON c.fk_id_category = ct.id_category 
      WHERE c.id_course = '${courseId}'
      GROUP BY
        c.id_course,
        c.title,
        c.description,
        c.link_thumbnail,
        c.difficulty_level,
        c.created_at,
        c.active,
        ct.id_category;
      `
      );

      return courseWithModules;

    } catch (error) {

      throw error;

    }

  };

  async auxValidateCourseAndTeacher(courseId: string, userReq: TokenPayloadDto) {

    const course = await this.courseRepository.findOne({
      where: {
        id_course: courseId
      },
      select: {
        id_course: true,
        fk_id_teacher: true
      }
    });

    if (!course) throw new NotFoundException('Curso não encontrado!');

    if ((course.fk_id_teacher !==  userReq.sub) && userReq.role !== 'admin') throw new ForbiddenException("Você não tem permissão para alterar esse curso!");

  }
}
