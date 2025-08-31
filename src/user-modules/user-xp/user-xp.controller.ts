import { Controller, Get, Param } from '@nestjs/common';
import { UserXpService } from './user-xp.service';


@Controller('user-xp')
export class UserXpController {
  constructor(private readonly userXpService: UserXpService) {}

  @Get('/:id')
  async getUserXpByUserId(@Param('id') id: string){
    return await this.userXpService.getUserXpByUserId(id);
  }
}
