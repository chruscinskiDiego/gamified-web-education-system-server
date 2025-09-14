import { Module } from '@nestjs/common';
import { CourseModuleService } from './course-module.service';
import { CourseModuleController } from './course-module.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseModule } from './entities/course-module.entity';
import { Course } from '../course/entities/course.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CourseModule, Course])
  ],
  controllers: [CourseModuleController],
  providers: [CourseModuleService],
})
export class CourseModuleModule {}
