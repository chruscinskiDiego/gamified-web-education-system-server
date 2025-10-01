import { IsNotEmpty, IsNumber, IsString, MaxLength, Min } from "class-validator";

export class JoinChallengeDto {

    @IsNotEmpty({
        message: 'O XP inicial não pode estar vazio!'
    })
    @IsNumber({
        maxDecimalPlaces: 0
    }, {
        message: 'O progresso deve ser um número inteiro!'
    })
    @Min(0, {
        message: 'O XP inicial mínimo é 1!'
    })
    start_xp: number;

    @IsNotEmpty({
        message: 'O ID do desafio não pode estar vazio!'
    })
    @IsNumber({
        maxDecimalPlaces: 0
    }, {
        message: 'O ID do desafio deve ser um número inteiro!'
    })
    @Min(1, {
        message: 'O ID do desafio mínimo é 1!'
    })
    id_challenge: number;

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
