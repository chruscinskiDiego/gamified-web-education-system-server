import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateGoalDto {

    @IsNotEmpty({
        message: 'É obrigatório enviar a descrição da meta!'
    })
    @IsString({
        message: 'O tipo de dado da descrição deve ser STRING!'
    })
    @MaxLength(500, {
        message: 'O máximo de caracteres da descrição é 500'
    })
    @MinLength(5, {
        message: 'O mínimo de caracteres da descrição é 5'
    })
    description: string;

}
