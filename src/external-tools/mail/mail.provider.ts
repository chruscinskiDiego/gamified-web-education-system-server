import * as nodemailer from 'nodemailer';
import { Provider } from '@nestjs/common';

export const MAILER = 'MAILER';

export const MailerProvider: Provider = {
  provide: MAILER,
  useFactory: async () => {
    const port = Number(process.env.SMTP_PORT || 465);
    const secure = process.env.SMTP_SECURE
      ? process.env.SMTP_SECURE === 'true'
      : port === 465;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port,
      secure, // true (SSL) p/ 465; false p/ 587 (STARTTLS)
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Falha cedo caso config esteja errada
    await transporter.verify();
    return transporter;
  },
};
