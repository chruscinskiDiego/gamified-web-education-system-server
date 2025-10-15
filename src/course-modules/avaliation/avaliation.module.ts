import { Module } from '@nestjs/common';
import { AvaliationService } from './avaliation.service';
import { AvaliationController } from './avaliation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaterialQualityAvaliation } from './entities/material-quality-avaliation.entity';
import { CommentaryAvaliation } from './entities/commentary-avaliation.entity';
import { DidaticsAvaliation } from './entities/didatics-avaliation.entity';
import { TeachingMethodologyAvaliation } from './entities/teaching-methodology-avaliation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    MaterialQualityAvaliation,
    CommentaryAvaliation,
    DidaticsAvaliation,
    TeachingMethodologyAvaliation
  ])],
  controllers: [AvaliationController],
  providers: [AvaliationService],
})
export class AvaliationModule { }
