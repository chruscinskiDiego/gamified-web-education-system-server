import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ModuleEpisodeService } from './module-episode.service';
import { CreateModuleEpisodeDto } from './dto/create-module-episode.dto';
import { UpdateModuleEpisodeDto } from './dto/update-module-episode.dto';
import { JwtUserReqParam } from 'src/user-modules/auth/params/token-payload.params';
import { TokenPayloadDto } from 'src/user-modules/auth/dto/token-payload.dto';
import { AuthTokenGuard } from 'src/user-modules/auth/guards/auth-token.guard';
import { RolesGuard } from 'src/user-modules/roles/guard/roles.guard';
import { Roles } from 'src/user-modules/roles/decorator/roles.decorator';
import { Role } from 'src/user-modules/roles/enum/roles.enum';

@UseGuards(AuthTokenGuard, RolesGuard)
@Controller('module-episode')
export class ModuleEpisodeController {
  constructor(private readonly moduleEpisodeService: ModuleEpisodeService) { }

  @Roles(Role.ADMIN, Role.TEACHER)
  @Post('/create')
  async createEpisodeInModule(
    @Body() createModuleEpisodeDto: CreateModuleEpisodeDto,
    @JwtUserReqParam() userReq: TokenPayloadDto,
  ) {
    return this.moduleEpisodeService.createEpisodeInModule(createModuleEpisodeDto, userReq);
  }

  @Roles(Role.ADMIN, Role.STUDENT, Role.TEACHER)
  @Get('/view-all-by-module/:id')
  async findAllEpisodesByModuleId(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.moduleEpisodeService.findAllEpisodesByModuleId(id);
  }

  @Patch('/update/:id')
  async updateEpisodeById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateModuleEpisodeDto: UpdateModuleEpisodeDto,
    @JwtUserReqParam() userReq: TokenPayloadDto
  ) {
    return this.moduleEpisodeService.updateEpisodeById(id, updateModuleEpisodeDto, userReq);
  }

  @Roles(Role.ADMIN, Role.TEACHER)
  @Delete('/delete/:id')
  async deleteEpisodeById(
    @Param('id', ParseIntPipe) id: number,
    @JwtUserReqParam() userReq
) {
    return this.moduleEpisodeService.deleteEpisodeById(id, userReq);
  }
}
