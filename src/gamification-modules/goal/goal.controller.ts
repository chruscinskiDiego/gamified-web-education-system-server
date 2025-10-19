import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { GoalService } from './goal.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { AuthTokenGuard } from 'src/user-modules/auth/guards/auth-token.guard';
import { RolesGuard } from 'src/user-modules/roles/guard/roles.guard';
import { JwtUserReqParam } from 'src/user-modules/auth/params/token-payload.params';
import { TokenPayloadDto } from 'src/user-modules/auth/dto/token-payload.dto';

@UseGuards(AuthTokenGuard, RolesGuard)
@Controller('goal')
export class GoalController {
  constructor(private readonly goalService: GoalService) { }

  @Post('/create')
  async createGoal(
    @Body() createGoalDto: CreateGoalDto,
    @JwtUserReqParam() userReq: TokenPayloadDto
  ) {
    return this.goalService.createGoal(createGoalDto, userReq);
  }

  @Get('/view-by-user')
  async findAllGoals(
    @JwtUserReqParam() userReq: TokenPayloadDto
  ) {
    return this.goalService.findGoalsByUser(userReq);
  }

  @Patch('/update/:id')
  async updateGoal(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGoalDto: UpdateGoalDto,
    @JwtUserReqParam() userReq: TokenPayloadDto
  ) {
    return this.goalService.updateGoal(id, updateGoalDto, userReq);
  }

  @Delete('/delete/:id')
  async removeGoal(
    @Param('id', ParseIntPipe) id: number,
    @JwtUserReqParam() userReq: TokenPayloadDto
  ) {
    return this.goalService.removeGoal(id, userReq);
  }
}
