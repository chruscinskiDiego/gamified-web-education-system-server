import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UploadedFile, BadRequestException, UseInterceptors } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { JwtUserReqParam } from 'src/user-modules/auth/params/token-payload.params';
import { TokenPayloadDto } from 'src/user-modules/auth/dto/token-payload.dto';
import { AuthTokenGuard } from 'src/user-modules/auth/guards/auth-token.guard';
import { RolesGuard } from 'src/user-modules/roles/guard/roles.guard';
import { Roles } from 'src/user-modules/roles/decorator/roles.decorator';
import { Role } from 'src/user-modules/roles/enum/roles.enum';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) { }

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

  @UseGuards(AuthTokenGuard, RolesGuard)
  @Roles(Role.TEACHER)
  @Get('/view-by-teacher')
  async getCoursesByTeacher(
    @JwtUserReqParam() userReq: TokenPayloadDto
  ) {
    return this.courseService.getCoursesByTeacher(userReq.sub);
  }

  @UseGuards(AuthTokenGuard, RolesGuard)
  @Roles(Role.TEACHER, Role.ADMIN)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 }, // 5mb de limite
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          cb(new BadRequestException('Somente imagens são permitidas'), false);
        } else {
          cb(null, true);
        }
      },
    }),
  )
  @Post('/set-thumbnail/:id')
  async setCourseThumbnail(
    @Param('id') id: string,
    @JwtUserReqParam() userReq: TokenPayloadDto,
    @UploadedFile() file: Express.Multer.File
  ) {

    if (!file) {
      throw new BadRequestException('Arquivo não enviado');
    }

    if (!id) {
      throw new BadRequestException('ID da do usuário não enviado');
    }

    return await this.courseService.setCourseThumbnail(id, file, userReq);

  }

  @UseGuards(AuthTokenGuard, RolesGuard)
  @Roles(Role.TEACHER, Role.ADMIN)
  @Get('/management-view/:id')
  async getManagementCourseById(
    @Param('id') id: string,
    @JwtUserReqParam() userReq: TokenPayloadDto
  ) {

    return this.courseService.getManagementCourseById(id, userReq);

  }
}
