import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { AvaliationService } from './avaliation.service';
import { CreateAvaliationDto } from './dto/create-avaliation.dto';
import { UpdateAvaliationDto } from './dto/update-avaliation.dto';
import { AuthTokenGuard } from 'src/user-modules/auth/guards/auth-token.guard';
import { JwtUserReqParam } from 'src/user-modules/auth/params/token-payload.params';
import { TokenPayloadDto } from 'src/user-modules/auth/dto/token-payload.dto';
import { RolesGuard } from 'src/user-modules/roles/guard/roles.guard';
import { Roles } from 'src/user-modules/roles/decorator/roles.decorator';
import { Role } from 'src/user-modules/roles/enum/roles.enum';
import { DeleteAvaliationDto } from './dto/delete-avaliation.dto';

@UseGuards(AuthTokenGuard, RolesGuard)
@Roles(Role.ADMIN, Role.STUDENT)
@Controller('avaliation')
export class AvaliationController {
  constructor(private readonly avaliationService: AvaliationService) {}

  @Post('/new-in-course')
  async createAvaliationByCourseId(
    @Body() createAvaliationDto: CreateAvaliationDto,
    @JwtUserReqParam() userReq: TokenPayloadDto,
  ) {

    return this.avaliationService.createAvaliationByCourseId(createAvaliationDto, userReq);

  }

  @Patch('/update')
  async updateAvaliation(
    @Body() updateAvaliationDto: UpdateAvaliationDto,
    @JwtUserReqParam() userReq: TokenPayloadDto,
  ){
    return this.avaliationService.updateAvaliations(updateAvaliationDto, userReq);
  }

  @Delete('/delete')
  async deleteAvaliation(
    @Body() deleteAvaliationDto: DeleteAvaliationDto,
    @JwtUserReqParam() userReq: TokenPayloadDto,
  ) {
    return this.avaliationService.deleteAvaliation(deleteAvaliationDto, userReq);
  }
}
