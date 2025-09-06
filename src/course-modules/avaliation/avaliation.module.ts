import { Module } from '@nestjs/common';
import { AvaliationService } from './avaliation.service';
import { AvaliationController } from './avaliation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Avaliation } from './entities/avaliation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Avaliation])],
  controllers: [AvaliationController],
  providers: [AvaliationService],
})
export class AvaliationModule {}
