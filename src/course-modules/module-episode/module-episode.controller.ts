import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ModuleEpisodeService } from './module-episode.service';
import { CreateModuleEpisodeDto } from './dto/create-module-episode.dto';
import { UpdateModuleEpisodeDto } from './dto/update-module-episode.dto';

@Controller('module-episode')
export class ModuleEpisodeController {
  constructor(private readonly moduleEpisodeService: ModuleEpisodeService) {}

  @Post()
  create(@Body() createModuleEpisodeDto: CreateModuleEpisodeDto) {
    return this.moduleEpisodeService.create(createModuleEpisodeDto);
  }

  @Get()
  findAll() {
    return this.moduleEpisodeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.moduleEpisodeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateModuleEpisodeDto: UpdateModuleEpisodeDto) {
    return this.moduleEpisodeService.update(+id, updateModuleEpisodeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.moduleEpisodeService.remove(+id);
  }
}
