import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthGuard } from './auth.guard';

export const authModuleObject = {
  imports: [
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || '123',
        signOptions: { expiresIn: '10h' },
      }),
    }),
  ],
  providers: [AuthResolver, AuthService, AuthGuard],
  exports: [AuthService, AuthGuard, JwtModule],
};

@Module(authModuleObject)
export class AuthModule {}
