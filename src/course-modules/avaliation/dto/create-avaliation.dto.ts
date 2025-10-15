import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, MinLength } from "class-validator";

export class CreateAvaliationDto {


    @IsNotEmpty({
        message: 'O ID do curso é obrigatório!'
    })
    @IsString(
        {
            message: 'O ID do curso deve ser uma string!'
        }
    )
    id_course: string;

    @IsNotEmpty({
        message: 'A nota da avaliação de Qualidade do Material não pode estar vazia!'
    })
    @Min(0, {
        message: 'A nota mínima da avaliação é 0!'
    })
    @Max(5, {
        message: 'A nota máxima da avaliação é 5!'
    })
    @IsNumber({
        maxDecimalPlaces: 0
    })
    materialQualityNote: number;

    @IsNotEmpty({
        message: 'A nota da avaliação didática não pode estar vazia!'
    })
    @Min(0, {
        message: 'A nota mínima da avaliação é 0!'
    })
    @Max(5, {
        message: 'A nota máxima da avaliação é 5!'
    })
    @IsNumber({
        maxDecimalPlaces: 0
    })
    didaticsNote: number;

    @IsNotEmpty({
        message: 'A nota da avaliação não pode estar vazia!'
    })
    @Min(0, {
        message: 'A nota mínima da avaliação é 0!'
    })
    @Max(5, {
        message: 'A nota máxima da avaliação é 5!'
    })
    @IsNumber({
        maxDecimalPlaces: 0
    })
    teachingMethodologyNote: number;
    
    @IsOptional()
    @IsString({
        message: 'O comentário deve ser uma string!'
    })
    commentary: string;
}
