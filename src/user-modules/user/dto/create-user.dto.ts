import { IsDateString, IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {

    @IsNotEmpty()
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

    @IsNotEmpty()
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

    @IsNotEmpty()
    @IsEmail()
     @MaxLength(255, {
        message: 'O email do usuário deve ter no máximo 255 caracteres',
    })
    email: string;

    @IsNotEmpty()
    @IsString({
        message: 'A senha do usuário deve ser uma string',
    })
    @MinLength(8, {
        message: 'A senha do usuário deve ter no mínimo 8 caracteres',
    })
    @MaxLength(255, {
        message: 'A senha do usuário deve ter no máximo 255 caracteres',
    })
    password: string;

    @IsNotEmpty()
    @IsString({
        message: 'O tipo do usuário deve ser uma string (1 caractere)',
    })
    @MinLength(1, {
        message: 'O tipo do usuário deve ter 1 caractere',
    })
    @MaxLength(1, {
        message: 'O tipo do usuário deve ter 1 caractere',
    })
    type: string;

    @IsNotEmpty({
        message: 'A data de nascimento do usuário é obrigatória',
    })
    @IsDateString()
    birth_date: Date;

}
