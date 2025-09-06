import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { JwtUserReqParam } from 'src/user-modules/auth/params/token-payload.params';
import { TokenPayloadDto } from 'src/user-modules/auth/dto/token-payload.dto';
import { AuthTokenGuard } from 'src/user-modules/auth/guards/auth-token.guard';
import { RolesGuard } from 'src/user-modules/roles/guard/roles.guard';
import { Roles } from 'src/user-modules/roles/decorator/roles.decorator';
import { Role } from 'src/user-modules/roles/enum/roles.enum';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @UseGuards(AuthTokenGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.TEACHER)
  @Post('/create')
  async createCourse(
    @Body() createCourseDto: CreateCourseDto,
    @JwtUserReqParam() userReq: TokenPayloadDto,
  ) {
    return this.courseService.createCourse(createCourseDto, userReq.sub);
  }

  @UseGuards(AuthTokenGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.TEACHER)
  @Patch('/update/:id')
  async update(
    @Param('id') id: string, 
    @Body() updateCourseDto: UpdateCourseDto,
    @JwtUserReqParam() userReq: TokenPayloadDto,
  ) {
    return this.courseService.updateCourseById(id, updateCourseDto, userReq);
  }


  @UseGuards(AuthTokenGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.TEACHER)
  @Patch('/disable/:id')
  remove(
    @Param('id') id: string,
    @JwtUserReqParam() userReq: TokenPayloadDto,
  ) {
    return this.courseService.disableCourseById(id, userReq);
  }
}
