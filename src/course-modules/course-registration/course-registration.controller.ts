import { Controller, Post, Body, Patch, UseGuards } from '@nestjs/common';
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

  @Patch('/finish')
  async finishCourseRegistration(
    @Body() createCourseRegistrationDto: CreateCourseRegistrationDto,
    @JwtUserReqParam() userReq: TokenPayloadDto
  ) {
    return this.courseRegistrationService.finishCourseRegistration(createCourseRegistrationDto.id_course, userReq);
  }

  @Patch('/remove/')
  async removeCourseRegistration(
    @Body() createCourseRegistrationDto: CreateCourseRegistrationDto,
    @JwtUserReqParam() userReq: TokenPayloadDto
  ) {
    return this.courseRegistrationService.removeCourseRegistration(createCourseRegistrationDto.id_course, userReq);
  }

  // TO-DO courses with registration by user
}
