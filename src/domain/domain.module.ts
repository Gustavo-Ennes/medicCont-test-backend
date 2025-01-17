import { Module } from '@nestjs/common';
import { DeclarationModule } from './declaration/declaration.module';

@Module({
  imports: [DeclarationModule],
})
export class DomainModule {}
