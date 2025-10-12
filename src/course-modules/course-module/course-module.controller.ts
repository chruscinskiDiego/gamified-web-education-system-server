import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { CourseModuleService } from './course-module.service';
import { CreateCourseModuleDto } from './dto/create-course-module.dto';
import { UpdateCourseModuleDto } from './dto/update-course-module.dto';
import { JwtUserReqParam } from 'src/user-modules/auth/params/token-payload.params';
import { TokenPayloadDto } from 'src/user-modules/auth/dto/token-payload.dto';
import { AuthTokenGuard } from 'src/user-modules/auth/guards/auth-token.guard';
import { RolesGuard } from 'src/user-modules/roles/guard/roles.guard';
import { Roles } from 'src/user-modules/roles/decorator/roles.decorator';
import { Role } from 'src/user-modules/roles/enum/roles.enum';

@Controller('course-module')
export class CourseModuleController {
  constructor(private readonly courseModuleService: CourseModuleService) { }

  // livre
  @Get('/view-all-by-course/:id')
  async findAllModulesByCourseId(
    @Param('id') id: string
  ) {
    return this.courseModuleService.findAllModulesByCourseId(id);
  }

  @UseGuards(AuthTokenGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.TEACHER)
  @Post('/create')
  async createModuleInCourse(
    @Body() createCourseModuleDto: CreateCourseModuleDto,
    @JwtUserReqParam() userReq: TokenPayloadDto,
  ) {
    return this.courseModuleService.createModuleInCourse(createCourseModuleDto, userReq);
  }

  @UseGuards(AuthTokenGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.TEACHER)
  @Get('/management-view/:id')
  async getManagementModuleById(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.courseModuleService.getManagementCourseModuleById(id);
  }

  @UseGuards(AuthTokenGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.TEACHER)
  @Patch('/update/:id')
  async updateModuleById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCourseModuleDto: UpdateCourseModuleDto,
    @JwtUserReqParam() userReq: TokenPayloadDto,
  ) {
    return this.courseModuleService.updateModuleById(id, updateCourseModuleDto, userReq);
  }

  @UseGuards(AuthTokenGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.TEACHER)
  @Delete('/delete/:id')
  async deleteModuleById(
    @Param('id', ParseIntPipe) id: number,
    @JwtUserReqParam() userReq: TokenPayloadDto,
  ) {
    return this.courseModuleService.deleteModuleById(id, userReq);
  }
}
