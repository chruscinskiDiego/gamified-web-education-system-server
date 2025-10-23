import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerProvider } from './mail.provider';

@Module({
  providers: [MailerProvider, MailService],
  exports: [MailService],
})
export class MailModule {}
