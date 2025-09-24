import { Module } from '@nestjs/common';
import { CourseRegistrationService } from './course-registration.service';
import { CourseRegistrationController } from './course-registration.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseRegistration } from './entities/course-registration.entity';

@Module({
  imports:[TypeOrmModule.forFeature([CourseRegistration])],
  controllers: [CourseRegistrationController],
  providers: [CourseRegistrationService],
})
export class CourseRegistrationModule {}
