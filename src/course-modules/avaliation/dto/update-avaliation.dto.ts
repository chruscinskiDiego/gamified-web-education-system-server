import { PartialType } from '@nestjs/mapped-types';
import { CreateAvaliationDto } from './create-avaliation.dto';

export class UpdateAvaliationDto extends PartialType(CreateAvaliationDto) {}
