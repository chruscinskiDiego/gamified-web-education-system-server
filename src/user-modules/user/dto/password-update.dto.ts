import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class PasswordUpdateDto {

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

}