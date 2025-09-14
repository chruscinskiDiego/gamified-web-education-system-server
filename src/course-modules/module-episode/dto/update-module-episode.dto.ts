import { PartialType } from '@nestjs/mapped-types';
import { CreateModuleEpisodeDto } from './create-module-episode.dto';

export class UpdateModuleEpisodeDto extends PartialType(CreateModuleEpisodeDto) {}
