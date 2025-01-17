import { InputType, Field } from '@nestjs/graphql';
import { IsValidUsername } from '../validation/username.validation';
import { IsValidPassword } from '../validation/password.validation';
import { IsEmail } from 'class-validator';

@InputType()
export class SignUpInput {
  @IsValidUsername
  @Field(() => String)
  username: string;

  @IsValidPassword
  @Field(() => String)
  password: string;

  @IsEmail()
  @Field(() => String)
  email: string;
}
