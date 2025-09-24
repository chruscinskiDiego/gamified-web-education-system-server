import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseRegistrationDto } from './dto/create-course-registration.dto';
import { TokenPayloadDto } from 'src/user-modules/auth/dto/token-payload.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseRegistration } from './entities/course-registration.entity';
import { Repository } from 'typeorm';


@Injectable()
export class CourseRegistrationService {

  constructor(
    @InjectRepository(CourseRegistration)
    private readonly courseRegistrationRepository: Repository<CourseRegistration>
  ){}

  async createCourseRegistration(

    createCourseRegistrationDto: CreateCourseRegistrationDto, userReq: TokenPayloadDto) {
    
    const userId = userReq.sub;
    const courseId = createCourseRegistrationDto.id_course;

    const registrationDTO = {
      state: 'S',
      fk_id_student: userId,
      fk_id_course: courseId
    };

    try{

      const registerExists = await this.existsCourseRegistrationByCourseIdAndUser(courseId, userId);

      if(registerExists) throw new ConflictException('Matrícula já existente!');

      const createdCourse = await this.courseRegistrationRepository.create(registrationDTO);

      const savedCourse = await this.courseRegistrationRepository.save(createdCourse);

      return {
        message: 'Matrícula efetuada com sucesso!',
        created_course_registration_id: savedCourse.id_course_registration
      }
    }
    catch(error){

      console.log(JSON.stringify(error));

      throw error;
    }
  }

  async finishCourseRegistration(id: number, userReq: TokenPayloadDto) {
    
    const courseRegistration = await this.courseRegistrationRepository.preload({
      id_course_registration: id,
      state: 'F'
    });

    if(!courseRegistration){

      throw new NotFoundException(`Matrícula com ID ${id} não encontrada!`);
    
    }

    if((courseRegistration?.fk_id_student !== userReq.sub) && (userReq.role !== 'admin')){

      throw new ForbiddenException('Você não tem permissão para finalizar esta matrícula!');
    
    }

    await this.courseRegistrationRepository.save(courseRegistration);

    return {
      message: 'Matrícula finalizada com sucesso!',
      finished_course_registration_id: courseRegistration.id_course_registration
    }
    
  }

  async removeCourseRegistration(id: number, userReq: TokenPayloadDto) {
    
    const courseRegistrationExists = await this.findCourseRegistrationById(id);

    if(!courseRegistrationExists) throw new NotFoundException('Matrícula não encontrada!');

    if((courseRegistrationExists.fk_id_student !== userReq.sub) && (userReq.role !== 'admin')) {
      throw new ForbiddenException('Você não tem permissão para cancelar esta matrícula!');
    }

    await this.courseRegistrationRepository.delete({
      id_course_registration: id
    });

    return {
      message: 'Matrícula cancelada com sucesso!'
    }
    
  }

  async findCourseRegistrationById(id:number){

    const courseRegistration = await this.courseRegistrationRepository.findOne({
      where: {
        id_course_registration: id
      },
      select: {
        id_course_registration: true,
        fk_id_student: true
      }
    });

    return courseRegistration;

  }

  async existsCourseRegistrationByCourseIdAndUser(courseId: string, userId: string ){

    const courseRegistration = await this.courseRegistrationRepository.findOne({
      where: {
        fk_id_course: courseId,
        fk_id_student: userId
      }
    });

    return courseRegistration ? true : false;

  }
}
