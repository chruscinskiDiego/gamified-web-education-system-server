import { IsDateString, IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {

    @IsOptional()
    @IsString({
        message: 'O nome do usuário deve ser uma string',
    })
    @MinLength(2, {
        message: 'O nome do usuário deve ter no mínimo 2 caracteres',
    })
    @MaxLength(100, {
        message: 'O nome do usuário deve ter no máximo 100 caracteres',
    })
    name: string;

    @IsOptional()
    @IsString({
        message: 'O sobrenome do usuário deve ser uma string',
    })
    @MinLength(2, {
        message: 'O sobrenome do usuário deve ter no mínimo 2 caracteres',
    })
    @MaxLength(255, {
        message: 'O sobrenome do usuário deve ter no máximo 255 caracteres',
    })
    surname: string;

    @IsOptional()
    @IsEmail()
    @MaxLength(255, {
        message: 'O email do usuário deve ter no máximo 255 caracteres',
    })
    email: string;

    @IsOptional()
    @IsDateString()
    birth_date: string;

}
