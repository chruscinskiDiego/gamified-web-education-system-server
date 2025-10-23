import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MAILER, MailerProvider } from './mail.provider';

@Module({
  providers: [MailerProvider, MailService],
  exports: [MailService, MAILER],
})
export class MailModule {}
