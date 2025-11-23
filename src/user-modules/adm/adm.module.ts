import { Module } from '@nestjs/common';
import { AdmService } from './adm.service';
import { AdmController } from './adm.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';

@Module({
  imports:[TypeOrmModule.forFeature([User])],
  controllers: [AdmController],
  providers: [AdmService],
})
export class AdmModule {}
