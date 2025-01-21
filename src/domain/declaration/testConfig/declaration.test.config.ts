import { Test } from '@nestjs/testing';
import { declarationModuleObject } from '../declaration.module';
import { Declaration } from '../entities/declaration.entity';
import { getMockedEntityProvider } from '../../../utils/unitTests/defaultEntityMock';
import { JwtService } from '@nestjs/jwt';
import { userModuleObject } from '../../../application/user/user.module';
import { authModuleObject } from '../../../application/auth/auth.module';
import { User } from '../../../application/user/entities/user.entity';
import { emailModuleObject } from '../../../application/email/email.module';
import { ConfigService } from '@nestjs/config';

const declarationTestModuleObject = {
  providers: [
    JwtService,
    ConfigService,
    ...declarationModuleObject.providers,
    ...authModuleObject.providers,
    ...userModuleObject.providers,
    ...emailModuleObject.providers,
    getMockedEntityProvider(Declaration),
    getMockedEntityProvider(User),
  ],
};

export const createDeclarationTestingModule = async () =>
  await Test.createTestingModule(declarationTestModuleObject).compile();
