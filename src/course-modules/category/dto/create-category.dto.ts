import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateCategoryDto {

    @IsNotEmpty({
        message: 'O nome da categoria não pode estar vazio!'
    })
    @IsString({
        message: 'O nome da categoria deve ser uma string!'
    })
    @MinLength(2, {
        message: 'O tamanho mínimo do nome de categoria é 2 caracteres!'
    })
    @MaxLength(255, {
        message: 'O tamanho máximo do nome de categoria é 255 caracteres!'
    })
    name:string;
    
}
