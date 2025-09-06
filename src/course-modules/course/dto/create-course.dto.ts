import { IsIn, IsNotEmpty, IsNumber, IsString, Max, MaxLength, Min, MinLength } from "class-validator";

export class CreateCourseDto {

    @IsNotEmpty({
        message: 'O título do curso não pode estar vazio!'
    })
    @IsString({
        message: 'O título do curso deve ser uma string!'
    })
    @MinLength(2, {
        message: 'O tamanho mínimo do título do curso é 2 caracteres!'
    })
    @MaxLength(255, {
        message: 'O tamanho máximo do título do curso é 255 caracteres!'
    })
    title: string;

    @IsNotEmpty({
        message: 'A descrição do curso não pode estar vazio!'
    })
    @IsString({
        message: 'A descrição do curso deve ser uma string!'
    })
    @MinLength(10, {
        message: 'O tamanho mínimo do descrição do curso é 2 caracteres!'
    })
    description?: string;

    @IsNotEmpty({
        message: 'O nível de dificuldade do curso não pode estar vazio!'
    })
    @IsString({
        message: 'O nível de dificuldade do curso deve ser uma string!'
    })
    @MaxLength(1, {
        message: 'O tamanho máximo do nível de dificuldade do curso é 1 caractere!'
    })
    @IsIn(['E', 'M', 'H'], {
        message: 'O nível de dificuldade do curso deve ser E (Fácil), M (Médio) ou H (Difícil)!'
    })
    difficulty_level: string;

    /*
    @IsNotEmpty({
        message: 'O ID do professor do curso não pode estar vazio!'
    })
    @IsString({
        message: 'O ID do professor do curso deve ser uma string!'
    })
    @MinLength(2, {
        message: 'O tamanho mínimo do ID do professor do curso é 2 caracteres!'
    })
    @MaxLength(255, {
        message: 'O tamanho máximo do ID do professor do curso é 255 caracteres!'
    })
    id_teacher: string;
    */

    @IsNotEmpty({
        message: 'O ID da categoria do curso não pode estar vazia!'
    })
    @IsNumber()
    @Min(1, {
        message: 'O ID da categoria do curso deve ser maior que 0!'
    })
    id_category: number;
}
