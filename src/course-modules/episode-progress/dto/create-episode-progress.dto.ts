import { IsNumber, Min} from "class-validator";

export class SaveEpisodeProgressDto {

    @IsNumber({
        maxDecimalPlaces: 0
    })
    @Min(1, {
        message: 'O ID do módulo de EP deve ser um número inteiro positivo!'
    })
    id_module_episode: number;

}
