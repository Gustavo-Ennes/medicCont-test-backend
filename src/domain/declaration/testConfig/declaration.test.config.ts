import { Test } from '@nestjs/testing';
import { declarationModuleObject } from '../declaration.module';
import { Declaration } from '../entities/declaration.entity';
import { getMockedEntityProvider } from '../../../utils/unitTests/defaultEntityMock';
import { JwtService } from '@nestjs/jwt';
import { userModuleObject } from '../../../application/user/user.module';
import { authModuleObject } from '../../../application/auth/auth.module';
import { User } from '../../../application/user/entities/user.entity';

const declarationTestModuleObject = {
  providers: [
    JwtService,
    ...declarationModuleObject.providers,
    ...authModuleObject.providers,
    ...userModuleObject.providers,
    getMockedEntityProvider(Declaration),
    getMockedEntityProvider(User),
  ],
};

export const createDeclarationTestingModule = async () =>
  await Test.createTestingModule(declarationTestModuleObject).compile();
