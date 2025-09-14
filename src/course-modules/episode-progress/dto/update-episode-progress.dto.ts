import { PartialType } from '@nestjs/mapped-types';
import { CreateEpisodeProgressDto } from './create-episode-progress.dto';

export class UpdateEpisodeProgressDto extends PartialType(CreateEpisodeProgressDto) {}
