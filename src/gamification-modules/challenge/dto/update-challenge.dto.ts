import { PartialType } from '@nestjs/mapped-types';
import { CreateChallengeDto } from './create-challenge.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateChallengeDto extends PartialType(CreateChallengeDto) {

    @IsOptional()
    @IsBoolean({
        message: 'O tipo de active é booleano'
    })
    active?: boolean;
}
