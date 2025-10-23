import { PartialType } from '@nestjs/mapped-types';
import { CreateCourseDto } from './create-course.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateCourseDto extends PartialType(CreateCourseDto) {

    @IsOptional()
    @IsBoolean()
    active: boolean;
    
}
