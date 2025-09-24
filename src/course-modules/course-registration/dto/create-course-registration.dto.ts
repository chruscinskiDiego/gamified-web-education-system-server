import { IsString, MaxLength, MinLength } from "class-validator";

export class CreateCourseRegistrationDto {

    @IsString()
    @MinLength(3, {
        message: 'A quantidade mínima de caracteres do ID do Curso é 3'
    })
    @MaxLength(255, {
        message: 'A quantidade máxima de caracteres do ID do curso é 255'
    })
    id_course: string;
    
}
