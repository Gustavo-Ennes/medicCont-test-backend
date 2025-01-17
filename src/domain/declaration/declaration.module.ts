import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DeclarationService } from './declaration.service';
import { Declaration } from './entities/declaration.entity';
import { DeclarationResolver } from './declaration.resolver';
import { AuthModule } from '../../application/auth/auth.module';
import { UserModule } from '../../application/user/user.module';

export const declarationModuleObject = {
  imports: [SequelizeModule.forFeature([Declaration]), AuthModule, UserModule],
  providers: [DeclarationService, DeclarationResolver],
  exports: [DeclarationService, SequelizeModule],
};

@Module(declarationModuleObject)
export class DeclarationModule {}
