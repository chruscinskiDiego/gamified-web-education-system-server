import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { AmazonS3Module } from 'src/external-tools/amazon-s3/amazon-s3.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course]),
    AmazonS3Module
  ],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}
