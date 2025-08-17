import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserXpService } from './user-xp.service';
import { CreateUserXpDto } from './dto/create-user-xp.dto';
import { UpdateUserXpDto } from './dto/update-user-xp.dto';

@Controller('user-xp')
export class UserXpController {
  constructor(private readonly userXpService: UserXpService) {}

  @Post()
  create(@Body() createUserXpDto: CreateUserXpDto) {
    return this.userXpService.create(createUserXpDto);
  }

  @Get()
  findAll() {
    return this.userXpService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userXpService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserXpDto: UpdateUserXpDto) {
    return this.userXpService.update(+id, updateUserXpDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userXpService.remove(+id);
  }
}
