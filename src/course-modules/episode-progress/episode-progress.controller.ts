import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EpisodeProgressService } from './episode-progress.service';
import { CreateEpisodeProgressDto } from './dto/create-episode-progress.dto';
import { UpdateEpisodeProgressDto } from './dto/update-episode-progress.dto';

@Controller('episode-progress')
export class EpisodeProgressController {
  constructor(private readonly episodeProgressService: EpisodeProgressService) {}

  @Post()
  create(@Body() createEpisodeProgressDto: CreateEpisodeProgressDto) {
    return this.episodeProgressService.create(createEpisodeProgressDto);
  }

  @Get()
  findAll() {
    return this.episodeProgressService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.episodeProgressService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEpisodeProgressDto: UpdateEpisodeProgressDto) {
    return this.episodeProgressService.update(+id, updateEpisodeProgressDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.episodeProgressService.remove(+id);
  }
}
