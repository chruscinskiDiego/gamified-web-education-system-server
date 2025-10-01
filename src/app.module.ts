import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user-modules/user/user.module';
import { UserXpModule } from './user-modules/user-xp/user-xp.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AmazonS3Module } from './external-tools/amazon-s3/amazon-s3.module';
import { CategoryModule } from './course-modules/category/category.module';
import { CourseModule } from './course-modules/course/course.module';
import { AvaliationModule } from './course-modules/avaliation/avaliation.module';
import { CourseModuleModule } from './course-modules/course-module/course-module.module';
import { ModuleEpisodeModule } from './course-modules/module-episode/module-episode.module';
import { EpisodeProgressModule } from './course-modules/episode-progress/episode-progress.module';
import { CourseRegistrationModule } from './course-modules/course-registration/course-registration.module';
import { InsigniaModule } from './gamification-modules/insignia/insignia.module';
import { ChallengeModule } from './gamification-modules/challenge/challenge.module';
import { ChallengeUserProgressModule } from './gamification-modules/challenge-user-progress/challenge-user-progress.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      database: process.env.DB_DATABASE,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,  // apenas em dev
      logging: true, // apenas em dev
    }),
    UserModule,
    UserXpModule,
    AmazonS3Module,
    CategoryModule,
    CourseModule,
    AvaliationModule,
    CourseModuleModule,
    ModuleEpisodeModule,
    EpisodeProgressModule,
    CourseRegistrationModule,
    InsigniaModule,
    ChallengeModule,
    ChallengeUserProgressModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
