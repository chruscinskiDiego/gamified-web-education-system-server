import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateInsigniaDto {

    @IsNotEmpty({
        message: 'O nome da Insígnia não pode ser vazio!'
    })
    @IsString({
        message: 'O nome da Insígnia deve ser uma string!'
    })
    @MinLength(3 , {
        message: 'O tamanho mínimo para o nome da Insígnia é 3!'
    })
    @MaxLength(255, {
        message: 'O tamanho máximo para o nome da Insígnia é 255!'
    })
    name: string;

    @IsNotEmpty({
        message: 'A descrição da Insígnia não pode ser vazio!'
    })
    @IsString({
        message: 'A descrição da Insígnia deve ser uma string!'
    })
    @MinLength(3 , {
        message: 'O tamanho mínimo para a descrição da Insígnia é 3!'
    })
    @MaxLength(255, {
        message: 'O tamanho máximo para a descrição da Insígnia é 255!'
    })
    description: string;


}
