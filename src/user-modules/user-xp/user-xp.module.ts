import { Module } from '@nestjs/common';
import { UserXpService } from './user-xp.service';
import { UserXpController } from './user-xp.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserXp } from './entities/user-xp.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([UserXp])
  ],
  controllers: [UserXpController],
  providers: [UserXpService],
  exports: [UserXpService]
})
export class UserXpModule {}
