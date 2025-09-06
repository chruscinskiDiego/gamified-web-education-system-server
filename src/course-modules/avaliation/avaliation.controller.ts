import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { AvaliationService } from './avaliation.service';
import { CreateAvaliationDto } from './dto/create-avaliation.dto';
import { UpdateAvaliationDto } from './dto/update-avaliation.dto';
import { AuthTokenGuard } from 'src/user-modules/auth/guards/auth-token.guard';
import { JwtUserReqParam } from 'src/user-modules/auth/params/token-payload.params';
import { TokenPayloadDto } from 'src/user-modules/auth/dto/token-payload.dto';

@UseGuards(AuthTokenGuard)
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


  @Delete('/delete-by-id/:id')
  async deleteAvaliationById(
    @Param('id', ParseIntPipe) id: number,
    @JwtUserReqParam() userReq: TokenPayloadDto,
  ) {
    return this.avaliationService.deleteAvaliationById(id, userReq);
  }
}
