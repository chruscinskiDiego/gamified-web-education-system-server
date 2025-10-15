import { IsNumber, IsOptional, IsString, Max, Min, MinLength } from "class-validator";

export class UpdateAvaliationDto {

    @IsOptional()
    @Min(1, {
        message: 'A nota mínima da avaliação é 1!'
    })
    @IsNumber({
        maxDecimalPlaces: 0
    })
    materialQualityAvaliationId: number;

    @IsOptional()
    @Min(0, {
        message: 'A nota mínima da avaliação é 0!'
    })
    @Max(5, {
        message: 'A nota máxima da avaliação é 5!'
    })
    @IsNumber({
        maxDecimalPlaces: 0
    })
    materialQualityNote: number;

    // --

    @IsOptional()
    @Min(1, {
        message: 'A nota mínima da avaliação é 1!'
    })
    @IsNumber({
        maxDecimalPlaces: 0
    })
    didaticsAvaliationId: number;

    @IsOptional()
    @Min(0, {
        message: 'A nota mínima da avaliação é 0!'
    })
    @Max(5, {
        message: 'A nota máxima da avaliação é 5!'
    })
    @IsNumber({
        maxDecimalPlaces: 0
    })
    didaticsNote: number;

    // --

    @IsOptional()
    @Min(1, {
        message: 'A nota mínima da avaliação é 1!'
    })
    @IsNumber({
        maxDecimalPlaces: 0
    })
    teachingMethodologyAvaliationId: number;

    @IsOptional()
    @Min(0, {
        message: 'A nota mínima da avaliação é 0!'
    })
    @Max(5, {
        message: 'A nota máxima da avaliação é 5!'
    })
    @IsNumber({
        maxDecimalPlaces: 0
    })
    teachingMethodologyNote: number;
    
    // --
    
    @IsOptional()
    @Min(1, {
        message: 'A nota mínima da avaliação é 1!'
    })
    @IsNumber({
        maxDecimalPlaces: 0
    })
    commentaryId: number;

    @IsOptional()
    @IsString({
        message: 'O comentário deve ser uma string!'
    })
    commentary: string;
}
