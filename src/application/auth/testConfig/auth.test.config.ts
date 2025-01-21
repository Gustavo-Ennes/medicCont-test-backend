import { JwtModule } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { User } from '../../user/entities/user.entity';
import { AuthResolver } from '../auth.resolver';
import { AuthService } from '../auth.service';
import { getMockedEntityProvider } from '../../../utils/unitTests/defaultEntityMock';
import { userModuleObject } from '../../../application/user/user.module';
import { emailModuleObject } from '../../../application/email/email.module';
import { ConfigService } from '@nestjs/config';

const authTestModuleConfig = {
  imports: [
    JwtModule.register({
      secret: 'test',
    }),
  ],
  providers: [
    AuthResolver,
    AuthService,
    ...userModuleObject.providers,
    ...emailModuleObject.providers,
    ConfigService,
    getMockedEntityProvider(User),
  ],
};

export const createAuthTestModule = async () =>
  await Test.createTestingModule(authTestModuleConfig).compile();
