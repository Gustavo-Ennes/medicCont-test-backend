import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserInput } from '../user/dto/create-user.input';
import { hashPassword, verifyPassword } from './auth.utils';
import { User } from '../user/entities/user.entity';
import { LoginInput } from './dto/login.input';
import { AuthReturn } from './auth.utils';
import { getRegistrationEmailTemplate } from '../email/template/email.registration.template';
import { EmailService } from '../email/email.service';
import { MailOptions } from 'nodemailer/lib/json-transport';
import { reject } from 'ramda';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  private readonly logger = new Logger(AuthService.name);
  private verificationCodes: { code: string; email: string }[] = [];

  async signUp(createUserInput: CreateUserInput): Promise<AuthReturn> {
    try {
      const { username, password, email } = createUserInput;
      const sameUsernameUser =
        await this.usersService.findOneByUsername(username);

      if (sameUsernameUser)
        throw new ConflictException(`Username ${username} already taken.`);

      const hashedPassword = await hashPassword(password);
      const user: User = await this.usersService.create({
        username,
        email,
        password: hashedPassword,
      });

      const verificationCode = String(
        Math.round(500000 + Math.random() * 500000),
      );
      await this.sendConfirmationEmail(email, username, verificationCode);

      const payload = { sub: user.id, username, email, verificationCode };

      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      this.logger.error(
        `${this.signUp.name} -> ${error.message}`,
        error.stack,
        { createUserInput },
      );
      throw error;
    }
  }

  async login(loginInput: LoginInput): Promise<AuthReturn> {
    try {
      const { username, password } = loginInput;
      const user = await this.usersService.findOneByUsername(username);
      if (!user)
        throw new NotFoundException(`No user found with username ${username}`);

      if (!(await verifyPassword(password, user.password)))
        throw new UnauthorizedException(
          `Password didn't match for user ${username}`,
        );

      const { id, email } = user;
      const payload = {
        sub: id,
        username,
        email,
      };

      const findFn = ({ email: verificationEmail }) =>
        email === verificationEmail;
      const firstLogin = this.verificationCodes.find(findFn);
      if (firstLogin)
        this.verificationCodes = reject(findFn, this.verificationCodes);

      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      this.logger.error(`${this.login.name} -> ${error.message}`, error.stack, {
        loginInput,
      });
      throw error;
    }
  }

  async hashPassword(str: string): Promise<string> {
    return await hashPassword(str);
  }

  async sendConfirmationEmail(
    address: string,
    username: string,
    verificationCode: string,
  ) {
    const params: MailOptions = this.emailService.buildEmailOptions({
      to: { name: username, address },
      category: 'confirmation',
      subject: 'Confirme seu cadastro',
      html: getRegistrationEmailTemplate({ username, verificationCode }),
    });

    this.verificationCodes.push({ code: verificationCode, email: address });

    return this.emailService.sendEmail(params);
  }
}
