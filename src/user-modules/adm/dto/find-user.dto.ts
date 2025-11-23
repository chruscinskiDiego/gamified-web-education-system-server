import { IsIn, IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class FindUserDto {

    @IsNotEmpty({
        message: 'A propriedade de busca do usuário é obrigatória!',
    })
    @IsIn(['id', 'email'], {
        message: 'A propriedade de busca do usuário deve ser "id" ou "email"',
    })
    @MinLength(2, {
        message: 'A propriedade de busca do usuário deve ter no mínimo 2 caracteres',
    })
    @MaxLength(5, {
        message: 'A propriedade de busca do usuário deve ter no máximo 255 caracteres',
    })
    property: string;

    @IsNotEmpty({
        message: 'O valor de busca do usuário é obrigatório!',
    })
    @MinLength(2, {
        message: 'O valor de busca do usuário deve ter no mínimo 2 caracteres',
    })
    @MaxLength(255, {
        message: 'O valor de busca do usuário deve ter no máximo 255 caracteres',
    })
    value: string;
    
}