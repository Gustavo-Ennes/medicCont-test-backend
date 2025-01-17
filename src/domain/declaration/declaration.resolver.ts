import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { DeclarationService } from './declaration.service';
import { Declaration } from './entities/declaration.entity';
import { CreateDeclarationInput } from './dto/create-declaration.input';
import { UpdateDeclarationInput } from './dto/update-declaration.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../application/auth/auth.guard';
import { getUser } from '../../application/user/decorator/get-user.decorator';

@UseGuards(AuthGuard)
@Resolver(() => Declaration)
export class DeclarationResolver {
  constructor(private readonly declarationService: DeclarationService) {}

  @Mutation(() => Declaration)
  createDeclaration(
    @Args('createDeclarationInput')
    createDeclarationInput: CreateDeclarationInput,
  ) {
    return this.declarationService.create(createDeclarationInput);
  }

  @Query(() => [Declaration], { name: 'declarations' })
  findAll(@getUser() user?: { sub: number }) {
    return this.declarationService.findAll(user);
  }

  @Query(() => Declaration, { name: 'declaration', nullable: true })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.declarationService.findOne(id);
  }

  @Mutation(() => Declaration)
  updateDeclaration(
    @Args('updateDeclarationInput')
    updateDeclarationInput: UpdateDeclarationInput,
  ) {
    return this.declarationService.update(updateDeclarationInput);
  }

  @Mutation(() => Boolean)
  async removeDeclaration(@Args('id', { type: () => Int }) id: number) {
    await this.declarationService.remove(id);
    return true;
  }
}
