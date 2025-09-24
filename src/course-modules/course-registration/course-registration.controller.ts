import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { CourseRegistrationService } from './course-registration.service';
import { CreateCourseRegistrationDto } from './dto/create-course-registration.dto';
import { JwtUserReqParam } from 'src/user-modules/auth/params/token-payload.params';
import { TokenPayloadDto } from 'src/user-modules/auth/dto/token-payload.dto';
import { AuthTokenGuard } from 'src/user-modules/auth/guards/auth-token.guard';

@UseGuards(AuthTokenGuard)
@Controller('course-registration')
export class CourseRegistrationController {
  constructor(private readonly courseRegistrationService: CourseRegistrationService) { }

  @Post('/create')
  async createCourseRegistration(
    @Body() createCourseRegistrationDto: CreateCourseRegistrationDto,
    @JwtUserReqParam() userReq: TokenPayloadDto
  ) {
    return this.courseRegistrationService.createCourseRegistration(createCourseRegistrationDto, userReq);
  }

  @Patch('/finish/:id')
  async finishCourseRegistration(
    @Param('id', ParseIntPipe) id: number,
    @JwtUserReqParam() userReq: TokenPayloadDto
  ) {
    return this.courseRegistrationService.finishCourseRegistration(id, userReq);
  }

  @Delete('/remove/:id')
  async removeCourseRegistration(
    @Param('id', ParseIntPipe) id: number,
    @JwtUserReqParam() userReq: TokenPayloadDto
  ) {
    return this.courseRegistrationService.removeCourseRegistration(id, userReq);
  }

  // TO-DO courses with registration by user
}
