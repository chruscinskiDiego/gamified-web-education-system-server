
import { IsBoolean, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateGoalDto {

    @IsOptional()
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

    @IsOptional()
    @IsBoolean(
        {
            message: 'O tipo de dado de COMPLETED deve ser BOOLEANO'
        }
    )
    completed: boolean;

}
