import { CreateDeclarationInput } from '../../src/domain/declaration/dto/create-declaration.input';

export const declarationInput: CreateDeclarationInput = {
  name: 'Ilha Solteira',
  year: 2024,
  birthday: new Date('1990-12-3'),
  declaredAmount: 685.66,
  userId: 1,
  observation: 'some observation',
};
