import { IsNumber } from 'class-validator';
import { CreateDeclarationInput } from './create-declaration.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateDeclarationInput extends PartialType(
  CreateDeclarationInput,
) {
  @IsNumber()
  @Field(() => Int, { nullable: false })
  id: number;

  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;

  @Field(() => [String], { nullable: true })
  annotations?: JSON;
}
