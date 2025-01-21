import { Injectable, Logger } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { createTransport } from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { MailtrapTransport } from 'mailtrap';
import {
  MailtrapMailOptions,
  MailtrapTransporter,
} from 'mailtrap/dist/types/transport';
import { BuildEmailOptionsParam } from './email.type';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(AuthService.name);
  private transporter: MailtrapTransporter;

  constructor(private readonly configService: ConfigService) {
    try {
      this.transporter = createTransport(
        MailtrapTransport({
          token: this.configService.get<string>('MAILTRAP_API_TOKEN'),
        }),
      );
    } catch (error) {
      this.logger.error(
        `Cannot configure an email transporter: ${error.message}`,
        error.stack,
      );
    }
  }

  async sendEmail(mailOptions: MailtrapMailOptions) {
    try {
      this.transporter.sendMail(mailOptions);
    } catch (error) {
      this.logger.error(`Cannot send an email: ${error.message}`, error.stack);
    }
  }

  buildEmailOptions({ to, subject, html, category }: BuildEmailOptionsParam) {
    return {
      to,
      from: {
        address: `${category.split(' ').join('-').trim()}@ennes.dev`,
        name: 'Gustavo Ennes',
      },
      subject,
      html,
      category,
    };
  }
}
