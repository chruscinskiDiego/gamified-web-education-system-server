import { Inject, Injectable } from '@nestjs/common';
import { Transporter } from 'nodemailer';
import { MAILER } from './mail.provider';

@Injectable()
export class MailService {

  constructor(@Inject(MAILER) private readonly mailer: Transporter) {}

  async send(opts: {
    to: string;
    subject: string;
    text?: string;
    html?: string;
  }) {
    const from = process.env.MAIL_FROM || process.env.SMTP_USER!;
    const info = await this.mailer.sendMail({
      from,
      to: opts.to,
      subject: opts.subject,
      text: opts.text,
      html: opts.html,
    });
    return { messageId: info.messageId, accepted: info.accepted };
  }
}
