import {
  IsArray,
  ArrayMaxSize,
  ValidateNested,
  IsOptional,
  IsString,
  IsInt,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';

export class DeleteAvaliationItemDto {
  @IsOptional()
  @IsString()
  @IsIn(['material_quality', 'didatics', 'teaching_methodology', 'commentary'])
  avaliation_type?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  delete_avaliation_id?: number;
}

export class DeleteAvaliationDto {
  @IsArray()
  @ArrayMaxSize(4)
  @ValidateNested({ each: true })
  @Type(() => DeleteAvaliationItemDto)
  avaliations: DeleteAvaliationItemDto[];
}
