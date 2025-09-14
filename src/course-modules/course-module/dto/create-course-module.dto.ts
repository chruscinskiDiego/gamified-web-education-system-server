import { IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from "class-validator";

export class CreateCourseModuleDto {


    @IsNotEmpty({
        message: 'O título do módulo não pode estar vazio!'
    })
    @IsString({
        message: 'O título do módulo deve ser uma string!'
    })
    @MinLength(2, {
        message: 'O tamanho mínimo do título do módulo é 2 caracteres!'
    })
    @MaxLength(255, {
        message: 'O tamanho máximo do título do módulo é 255 caracteres!'
    })
    title: string;

    //--

    @IsNotEmpty({
        message: 'A descrição do módulo não pode estar vazio!'
    })
    @IsString({
        message: 'A descrição do módulo deve ser uma string!'
    })
    @MinLength(10, {
        message: 'O tamanho mínimo do descrição do módulo é 10 caracteres!'
    })
    description?: string;

    //--

    @IsNotEmpty({
        message: 'A ordem do módulo não pode estar vazio!'
    })
    @IsNumber({
        maxDecimalPlaces: 0
    })
    order: number;

    //--

    @IsNotEmpty({
        message: 'O ID do curso não pode estar vazio!'
    })
    @IsString({
        message: 'O ID do curso deve ser uma string!'
    })
    @MaxLength(255, {
        message: 'O tamanho máximo do ID do curso é 255 caracteres!'
    })
    id_course: string;


}
