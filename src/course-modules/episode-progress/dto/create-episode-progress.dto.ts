import { IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsNumberString, IsString, MaxLength, Min, MinLength } from "class-validator";

export class SaveEpisodeProgressDto {

    @IsNotEmpty({
        message: 'O progresso não pode estar vazio'
    })
    @IsBoolean({
        message: 'O progresso deve ser booleano'
    })
    completed: boolean;

    @IsNotEmpty({
        message: 'A Data de progresso não pode estar vazia'
    })
    @IsDateString()
    completed_at;

    @IsNumber({
        maxDecimalPlaces: 0
    })
    @Min(1, {
        message: 'O ID do módulo de EP deve ser um número inteiro positivo!'
    })
    id_module_episode: number;

    @IsString({
        message: 'O ID do usuário deve ser uma string'
    })
    @MinLength(3, {
        message: 'O ID de usuario deve ter pelo menos 3 caracteres'
    })
    @MaxLength(255, {
        message:'O ID do usuario deve ter no maximo 255 caracteres'
    })
    id_student;




}
