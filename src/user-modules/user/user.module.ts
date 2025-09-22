import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { UserXpModule } from '../user-xp/user-xp.module';
import { AmazonS3Module } from 'src/external-tools/amazon-s3/amazon-s3.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([User]),
    AuthModule,
    UserXpModule,
    AmazonS3Module
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
