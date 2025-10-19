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

    if ((course.fk_id_teacher !== userReq.sub) && userReq.role !== 'admin') throw new ForbiddenException("Você não tem permissão para alterar esse curso!");

  }

  async getRegisteredAndHighlightedCoursesByUserId(userId: string) {

    const courses = await this.courseRepository.query(
      `
          WITH registered AS (
      SELECT
        c.id_course,
        c.title,
        c.difficulty_level,
        c.link_thumbnail,
        ROUND(AVG(a.note)::numeric, 2) AS avaliation_average
      FROM course c
      JOIN course_registration cr
        ON c.id_course = cr.fk_id_course
      LEFT JOIN avaliation a
        ON c.id_course = a.fk_id_course
      WHERE cr.fk_id_student = '${userId}'
      GROUP BY c.id_course, c.title, c.difficulty_level, c.link_thumbnail
    ),
    registered_json AS (
      SELECT COALESCE(
        jsonb_agg(
          jsonb_build_object(
            'id_course', id_course,
            'title', title,
            'difficulty_level', difficulty_level,
            'link_thumbnail', link_thumbnail,
            'avaliation_average', avaliation_average
          )
          ORDER BY id_course
        ),
        '[]'::jsonb
      ) AS arr
      FROM registered
    ),
    all_courses AS (
      SELECT
        c.id_course,
        c.title,
        c.difficulty_level,
        c.link_thumbnail,
        ROUND(AVG(a.note)::numeric, 2) AS avaliation_average
      FROM course c
      LEFT JOIN avaliation a
        ON c.id_course = a.fk_id_course
      GROUP BY c.id_course, c.title, c.difficulty_level, c.link_thumbnail
    ),
    top12 AS (
      SELECT *
      FROM all_courses
      ORDER BY avaliation_average DESC NULLS LAST, id_course
      LIMIT 12
    ),
    top12_json AS (
      SELECT COALESCE(
        jsonb_agg(
          jsonb_build_object(
            'id_course', id_course,
            'title', title,
            'difficulty_level', difficulty_level,
            'link_thumbnail', link_thumbnail,
            'avaliation_average', avaliation_average
          )
          ORDER BY avaliation_average DESC NULLS LAST, id_course
        ),
        '[]'::jsonb
      ) AS arr
      FROM top12
    )
    SELECT jsonb_build_object(
      'registered_courses', registered_json.arr,
      'highlighted_courses', top12_json.arr
    ) AS result
    FROM registered_json, top12_json;
      `
    );

    return courses[0].result;

  }

  async getResumeOfCourseById(courseId: string, studentId: string){

    const course = await this.courseRepository.query(
      `
      SELECT
        c.id_course,
        c.title,
        c.description,
        c.link_thumbnail,
        c.difficulty_level,
        c.created_at,
        teach.name || ' ' || teach.surname as teacher_full_name,
        teach.profile_picture_link as teacher_profile_picture,

        /* estado de matrícula do aluno fixo */
        cr.state AS registration_state,

        /* contagem de módulos */
        (
          SELECT COUNT(*) FROM course_module cm
          WHERE cm.fk_id_course = c.id_course
        ) AS modules_count,

        /* média geral (3 dimensões) + contagem total */
        jsonb_build_object(
          'avg',  ROUND(overall.avg_overall::numeric, 2),
          'count', overall.cnt_overall
        ) AS overall_rating,

        /* se o aluno já avaliou (em qualquer dimensão ou comentário) */
        (
          EXISTS (SELECT 1 FROM material_quality_avaliation mq
                  WHERE mq.fk_id_course = c.id_course AND mq.fk_id_student = '${studentId}')
          OR EXISTS (SELECT 1 FROM didatics_avaliation da
                    WHERE da.fk_id_course = c.id_course AND da.fk_id_student = '${studentId}')
          OR EXISTS (SELECT 1 FROM teaching_methodology_avaliation tm
                    WHERE tm.fk_id_course = c.id_course AND tm.fk_id_student = '${studentId}')
          OR EXISTS (SELECT 1 FROM commentary_avaliation ca
                    WHERE ca.fk_id_course = c.id_course AND ca.fk_id_student = '${studentId}')
        ) AS user_rated,

        /* por usuário: média do usuário + última nota por tipo + comentário mais recente do aluno no curso */
        per_user.evaluations_by_user

      FROM course c
      LEFT JOIN course_registration cr
        ON cr.fk_id_course = c.id_course
      AND cr.fk_id_student = '${studentId}'
      LEFT JOIN "user" teach
        ON c.fk_id_teacher = teach.id_user

      /* ---- OVERALL (média geral + contagem) ---- */
      LEFT JOIN LATERAL (
        SELECT AVG(u.note) AS avg_overall, COUNT(*) AS cnt_overall
        FROM (
          SELECT note FROM material_quality_avaliation     WHERE fk_id_course = c.id_course
          UNION ALL
          SELECT note FROM didatics_avaliation             WHERE fk_id_course = c.id_course
          UNION ALL
          SELECT note FROM teaching_methodology_avaliation WHERE fk_id_course = c.id_course
        ) u
      ) overall ON TRUE

      /* ---- LISTA POR USUÁRIO (última por tipo via maior id_avaliation) + comentário do aluno ---- */
      LEFT JOIN LATERAL (
        WITH all_notes AS (
          SELECT fk_id_student AS student_id, 'material_quality' AS kind, id_avaliation, note
          FROM material_quality_avaliation WHERE fk_id_course = c.id_course
          UNION ALL
          SELECT fk_id_student, 'didatics', id_avaliation, note
          FROM didatics_avaliation WHERE fk_id_course = c.id_course
          UNION ALL
          SELECT fk_id_student, 'teaching_methodology', id_avaliation, note
          FROM teaching_methodology_avaliation WHERE fk_id_course = c.id_course
        ),
        latest_per_type AS (
          SELECT DISTINCT ON (student_id, kind)
            student_id, kind, id_avaliation, note
          FROM all_notes
          ORDER BY student_id, kind, id_avaliation DESC
        ),
        per_user_base AS (
          SELECT
            lpt.student_id,
            ROUND(AVG(lpt.note)::numeric, 2) AS avg_user,
            MAX(lpt.id_avaliation)          AS last_avaliation_id,
            jsonb_object_agg(
              lpt.kind,
              jsonb_build_object(
                'id_avaliation', lpt.id_avaliation,
                'note',          lpt.note
              )
            ) AS notes_obj
          FROM latest_per_type lpt
          GROUP BY lpt.student_id
        )
        SELECT jsonb_agg(
                jsonb_build_object(
                  'student_id', u.id_user,
                  'student_full_name', COALESCE(u.name,'') || ' ' || COALESCE(u.surname,''),
                  'student_profile_picture', u.profile_picture_link,
                  'avg',  pub.avg_user,
                  'notes', pub.notes_obj,
                  'last_avaliation_id', pub.last_avaliation_id,
                  'commentary',
                    CASE WHEN uc.id_avaliation IS NOT NULL
                          THEN jsonb_build_object(
                                'id_avaliation', uc.id_avaliation,
                                'comment',       uc.commentary
                              )
                          ELSE NULL
                    END
                )
                ORDER BY pub.last_avaliation_id DESC
              ) AS evaluations_by_user
        FROM per_user_base pub
        JOIN "user" u ON u.id_user = pub.student_id

        /* pega o ÚLTIMO comentário desse aluno para este curso */
        LEFT JOIN LATERAL (
          SELECT ca.id_avaliation, ca.commentary
          FROM commentary_avaliation ca
          WHERE ca.fk_id_course = c.id_course
            AND ca.fk_id_student = u.id_user
          ORDER BY ca.id_avaliation DESC   -- se tiver created_at, prefira ORDER BY created_at DESC
          LIMIT 1
        ) uc ON TRUE
      ) per_user ON TRUE

      WHERE c.id_course = '${courseId}';

      `
    );

    return course[0];
  };


}
