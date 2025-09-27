import { Module } from '@nestjs/common';
import { InsigniaService } from './insignia.service';
import { InsigniaController } from './insignia.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Insignia } from './entities/insignia.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Insignia])],
  controllers: [InsigniaController],
  providers: [InsigniaService],
})
export class InsigniaModule {}
