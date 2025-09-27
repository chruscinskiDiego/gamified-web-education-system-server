import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { InsigniaService } from './insignia.service';
import { CreateInsigniaDto } from './dto/create-insignia.dto';
import { UpdateInsigniaDto } from './dto/update-insignia.dto';
import { AuthTokenGuard } from 'src/user-modules/auth/guards/auth-token.guard';
import { RolesGuard } from 'src/user-modules/roles/guard/roles.guard';
import { Roles } from 'src/user-modules/roles/decorator/roles.decorator';
import { Role } from 'src/user-modules/roles/enum/roles.enum';

@UseGuards(AuthTokenGuard)
@Controller('insignia')
export class InsigniaController {
  constructor(private readonly insigniaService: InsigniaService) { }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Post('/create')
  async createInsignia(@Body() createInsigniaDto: CreateInsigniaDto) {
    return this.insigniaService.createInsignia(createInsigniaDto);
  }

  @Get('/view-all')
  async findAllInsignias() {
    return this.insigniaService.findAllInsignias();
  }

  @Get('/view-by-id/:id')
  async findOneInsignia(@Param('id') id: string) {
    return this.insigniaService.findInsigniaById(+id);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Patch('/update/:id')
  async updateInsigniaById(@Param('id') id: string, @Body() updateInsigniaDto: UpdateInsigniaDto) {
    return this.insigniaService.updateInsigniaById(+id, updateInsigniaDto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Delete('/delete/:id')
  async removeInsigniaById(@Param('id') id: string) {
    return this.insigniaService.removeInsigniaById(+id);
  }
}
