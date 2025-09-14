import { Injectable } from '@nestjs/common';
import { CreateModuleEpisodeDto } from './dto/create-module-episode.dto';
import { UpdateModuleEpisodeDto } from './dto/update-module-episode.dto';

@Injectable()
export class ModuleEpisodeService {
  create(createModuleEpisodeDto: CreateModuleEpisodeDto) {
    return 'This action adds a new moduleEpisode';
  }

  findAll() {
    return `This action returns all moduleEpisode`;
  }

  findOne(id: number) {
    return `This action returns a #${id} moduleEpisode`;
  }

  update(id: number, updateModuleEpisodeDto: UpdateModuleEpisodeDto) {
    return `This action updates a #${id} moduleEpisode`;
  }

  remove(id: number) {
    return `This action removes a #${id} moduleEpisode`;
  }
}
