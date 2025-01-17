import { InputType, Field, Int, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString, IsDate } from 'class-validator';

@InputType()
export class CreateDeclarationInput {
  @IsNotEmpty()
  @IsNumber()
  @Field(() => Int)
  year: number;

  @IsNotEmpty()
  @IsNumber()
  @Field(() => Int)
  userId: number;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  name: string;

  @IsNotEmpty()
  @IsDate()
  @Field(() => Date)
  birthday: Date;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  observation: string;

  @IsNotEmpty()
  @IsNumber()
  @Field(() => Float)
  declaredAmount: number;
}
