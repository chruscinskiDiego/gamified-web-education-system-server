import { IsIn, IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class FindUserDataDto {

    @IsNotEmpty({
        message: 'A propriedade de busca ID do usuário é obrigatória!',
    })
    @MinLength(2, {
        message: 'A propriedade de busca ID do usuário deve ter no mínimo 2 caracteres',
    })
    @MaxLength(255, {
        message: 'A propriedade de busca do usuário ID deve ter no máximo 255 caracteres',
    })
    id: string;

    @IsNotEmpty({
        message: 'O tipo do usuário do usuário é obrigatório!',
    })
    @MinLength(1, {
        message: 'O valor de busca do usuário deve ter 1 caractere',
    })
    @MaxLength(1, {
        message: 'O valor de busca do tipo do usuário deve ter no máximo 1 caractere',
    })
    @IsIn(['S', 'T'], {
        message: 'O tipo de usuário deve ser "S" (student) ou "T" (teacher)',
    })
    type: string;
    
}