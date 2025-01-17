import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import {
  AutoIncrement,
  Column,
  Model,
  PrimaryKey,
  Table,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
  AllowNull,
} from 'sequelize-typescript';
import { User } from '../../../application/user/entities/user.entity';
import { DataTypes } from 'sequelize';

@ObjectType()
@Table
export class Declaration extends Model<Declaration> {
  @PrimaryKey
  @AutoIncrement
  @Column
  @Field(() => Int)
  id: number;

  @Column
  @Field(() => Int)
  year: number;

  @Column
  @Field(() => String)
  name: string;

  @Column
  @Field(() => Date)
  birthday: Date;

  @AllowNull
  @Column
  @Field(() => String, { nullable: true })
  observation: string;

  @Column({ type: DataTypes.FLOAT })
  @Field(() => Float)
  declaredAmount: number;

  @CreatedAt
  @Field(() => Date)
  createdAt: Date;

  @UpdatedAt
  @Field(() => Date)
  updatedAt: Date;

  @ForeignKey(() => User)
  @Column
  @Field(() => Int)
  userId: number;

  @BelongsTo(() => User)
  @Field(() => User)
  user: User;
}
