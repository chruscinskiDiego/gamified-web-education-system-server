import { Injectable } from '@nestjs/common';
import { CreateEpisodeProgressDto } from './dto/create-episode-progress.dto';
import { UpdateEpisodeProgressDto } from './dto/update-episode-progress.dto';

@Injectable()
export class EpisodeProgressService {
  create(createEpisodeProgressDto: CreateEpisodeProgressDto) {
    return 'This action adds a new episodeProgress';
  }

  findAll() {
    return `This action returns all episodeProgress`;
  }

  findOne(id: number) {
    return `This action returns a #${id} episodeProgress`;
  }

  update(id: number, updateEpisodeProgressDto: UpdateEpisodeProgressDto) {
    return `This action updates a #${id} episodeProgress`;
  }

  remove(id: number) {
    return `This action removes a #${id} episodeProgress`;
  }
}
