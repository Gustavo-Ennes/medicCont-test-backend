import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { AuthReturn } from './auth.utils';
import { SignUpInput } from './dto/signup.input';

@Resolver(() => AuthReturn)
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => AuthReturn)
  signUp(@Args('signUpInput') createUserInput: SignUpInput) {
    return this.authService.signUp(createUserInput);
  }

  @Mutation(() => AuthReturn)
  login(@Args('loginInput') loginInput: LoginInput) {
    return this.authService.login(loginInput);
  }

  @Mutation(() => String)
  hashPassword(@Args('password') password: string) {
    return this.authService.hashPassword(password);
  }
}
