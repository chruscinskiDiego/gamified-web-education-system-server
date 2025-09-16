import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min, MinLength } from "class-validator";

export class CreateModuleEpisodeDto {

    
        @IsNotEmpty({
            message: 'O título do episódio não pode estar vazio!'
        })
        @IsString({
            message: 'O título do episódio deve ser uma string!'
        })
        @MinLength(2, {
            message: 'O tamanho mínimo do título do episódio é 2 caracteres!'
        })
        @MaxLength(255, {
            message: 'O tamanho máximo do título do episódio é 255 caracteres!'
        })
        title: string;
    
        //--
    
        @IsNotEmpty({
            message: 'A descrição do episódio não pode estar vazio!'
        })
        @IsString({
            message: 'A descrição do episódio deve ser uma string!'
        })
        @MinLength(10, {
            message: 'O tamanho mínimo do descrição do episódio é 10 caracteres!'
        })
        description?: string;
    
        //--
    
        @IsNotEmpty({
            message: 'A ordem do episódio não pode estar vazio!'
        })
        @IsNumber({
            maxDecimalPlaces: 0
        })
        @Min(1, {
            message: 'A ordem do episódio deve ser um número inteiro positivo!'
        })
        order: number;

        @IsOptional()
        @IsString({
            message: 'O link do episódio deve ser uma string!'
        })
        @MaxLength(255, {
            message: 'O tamanho máximo do link do episódio é 255 caracteres!'
        })
        link_episode?: string;

        //--
    
        @IsNotEmpty({
            message: 'O id do módulo não pode estar vazio!'
        })
        @IsNumber({
            maxDecimalPlaces: 0
        })
        @Min(1, {
            message: 'O ID do módulo deve ser um número inteiro positivo!'
        })
        id_course_module: number
}
