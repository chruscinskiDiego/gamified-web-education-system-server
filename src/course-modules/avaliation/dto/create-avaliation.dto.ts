import { IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";

export class CreateAvaliationDto {

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
    note: number;

    @IsString(
        {
            message: 'O ID do curso deve ser uma string!'
        }
    )
    id_course: string;
}
