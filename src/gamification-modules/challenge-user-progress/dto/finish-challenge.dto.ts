import { IsNotEmpty, IsNumber, Min } from "class-validator";

export class FinishChallengeDto {

    @IsNotEmpty({
        message: 'O XP final não pode estar vazio!'
    })
    @IsNumber({
        maxDecimalPlaces: 0
    }, {
        message: 'O progresso deve ser um número inteiro!'
    })
    @Min(0, {
        message: 'O XP final mínimo é 1!'
    })
    end_xp: number;

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
    id_challenge_user_progress: number;

}
