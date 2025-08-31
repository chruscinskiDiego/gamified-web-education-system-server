import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthTokenGuard } from '../auth/guards/auth-token.guard';

@Controller('user-profile')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('/create')
  async createUserProfile(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createUserProfile(createUserDto);
  }

  @UseGuards(AuthTokenGuard)
  @Get('/view/:id')
  async findUserProfileById(@Param('id') id: string) {
    return await this.userService.findUserProfileById(id);
  }

   @UseGuards(AuthTokenGuard)
  @Patch('/update/:id')
  async updateUserProfile(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.updateUserProfileById(id, updateUserDto);
  }

   @UseGuards(AuthTokenGuard)
  @Patch('/disable/:id')
  async disableUserProfileById (@Param('id') id: string) {
    return await this.userService.disableUserProfileById(id);
  }
  
}
