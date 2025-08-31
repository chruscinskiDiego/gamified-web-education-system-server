import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { UserXpModule } from '../user-xp/user-xp.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([User]),
    AuthModule,
    UserXpModule
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
