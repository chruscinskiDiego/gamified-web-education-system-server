import { IsIn, IsNotEmpty, IsNumber, IsString, MaxLength, Min, MinLength } from "class-validator";

export class CreateChallengeDto {

    @IsNotEmpty({
        message: 'O título do desafio não pode estar vazio!'
    })
    @IsString({
        message: 'O título do desafio deve ser uma string!'
    })
    @MinLength(2, {
        message: 'O tamanho mínimo do título do desafio é 2 caracteres!'
    })
    @MaxLength(255, {
        message: 'O tamanho máximo do título do desafio é 255 caracteres!'
    })
    title: string;

    @IsNotEmpty({
        message: 'O título do desafio não pode estar vazio!'
    })
    @IsString({
        message: 'O título do desafio deve ser uma string!'
    })
    @MinLength(10, {
        message: 'O tamanho mínimo da descrição do desafio é 10 caracteres!'
    })
    description: string;

     @IsNotEmpty({
        message: 'O título do desafio não pode estar vazio!'
    })
    @IsString({
        message: 'O título do desafio deve ser uma string!'
    })
    @MinLength(1, {
        message: 'O tipo deve ter 1 caractere!'
    })
    @MaxLength(1, {
        message: 'O tipo deve ter 1 caractere!'
    })
    @IsIn(['D', 'X'], {
        message: 'O tipo do desafio deve ser "D" (Diário) ou "X" (Por Pontos)',
    })
    type: string;

    @IsNumber({
        maxDecimalPlaces: 0
    }, {
        message: 'A quantidade deve ser um número inteiro!'
    })
    @IsNotEmpty({
        message: 'A quantidade não pode estar vazia!'
    })
    @Min(1, {
        message: 'A quantidade mínima é 1!'
    })
    quantity: number;

    @IsNumber({
        maxDecimalPlaces: 0
    }, {
        message: 'O id da insígnia ser um número inteiro!'
    })
    @IsNotEmpty({
        message: 'O id da insígnia não pode estar vazio!'
    })
    id_insignia: number;

 }
