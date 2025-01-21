import { Module } from '@nestjs/common';
import { EmailService } from './email.service';

export const emailModuleObject = {
  providers: [EmailService],
  exports: [EmailService],
};

@Module(emailModuleObject)
export class EmailModule {}
