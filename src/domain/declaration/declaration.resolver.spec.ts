import { TestingModule } from '@nestjs/testing';
import { DeclarationResolver } from './declaration.resolver';
import { Declaration } from './entities/declaration.entity';
import { getModelToken } from '@nestjs/sequelize';
import { CreateDeclarationInput } from './dto/create-declaration.input';
import { createDeclarationTestingModule } from './testConfig/declaration.test.config';
import { validate } from 'class-validator';
import { UpdateDeclarationInput } from './dto/update-declaration.input';
import { User } from '../../application/user/entities/user.entity';

describe('DeclarationResolver', () => {
  let resolver: DeclarationResolver;
  let declarationModel: typeof Declaration;
  let userModel: typeof User;

  const input: CreateDeclarationInput = {
    year: 2024,
    name: 'gustavo',
    birthday: new Date('1990-12-3'),
    userId: 1,
    observation: 'some observation',
    declaredAmount: 20000.33,
  };

  beforeEach(async () => {
    const module: TestingModule = await createDeclarationTestingModule();

    resolver = module.get<DeclarationResolver>(DeclarationResolver);
    declarationModel = module.get<typeof Declaration>(
      getModelToken(Declaration),
    );
    userModel = module.get<typeof User>(getModelToken(User));
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should return an array of declarations', async () => {
    const declarations = [
      { name: 'declaration1', userId: 1 },
      { name: 'declaration2', userId: 1 },
    ] as Declaration[];
    (declarationModel.findAll as jest.Mock).mockResolvedValue(declarations);

    expect(await resolver.findAll({ sub: 1 })).toEqual(declarations);
  });

  it('should return a declaration if found', async () => {
    const declaration = { name: 'declaration2', id: 1 } as Declaration;
    (declarationModel.findByPk as jest.Mock).mockResolvedValueOnce(declaration);

    const res = await resolver.findOne(1);

    expect(res).toEqual(declaration);
  });

  it('should return null if no declaration found', async () => {
    const declaration = null;
    (declarationModel.findByPk as jest.Mock).mockResolvedValue(declaration);

    expect(await resolver.findOne(1)).toEqual(declaration);
  });

  it('should create a declaration', async () => {
    const createdDeclaration = { id: 1, ...input, reload: jest.fn() };

    (userModel.findByPk as jest.Mock).mockResolvedValueOnce({ id: 1 });
    (declarationModel.create as jest.Mock).mockResolvedValue(
      createdDeclaration,
    );

    expect(await resolver.createDeclaration(input)).toEqual(createdDeclaration);
    expect(createdDeclaration.reload).toHaveBeenCalled();
  });

  it('should not create a declaration if user does not exists', async () => {
    try {
      (userModel.findByPk as jest.Mock).mockResolvedValueOnce(null);

      await resolver.createDeclaration(input);
    } catch (error) {
      expect(error).toHaveProperty('response', {
        message: 'User not found with provided id.',
        error: 'Not Found',
        statusCode: 404,
      });
    }
  });

  it("shouldn't create a declaration without name in input", async () => {
    const inputWithoutCpfOrCnpj = { ...input, name: undefined };
    const dtoInstance = Object.assign(
      new CreateDeclarationInput(),
      inputWithoutCpfOrCnpj,
    );

    const dtoValidation = await validate(dtoInstance);
    expect(dtoValidation).toBeInstanceOf(Array);
    expect(dtoValidation).toHaveLength(1);
    expect(dtoValidation[0].property).toBe('name');
    expect(dtoValidation[0]).toHaveProperty('constraints', {
      isNotEmpty: 'name should not be empty',
      isString: 'name must be a string',
    });
  });

  it("shouldn't create a declaration without a year", async () => {
    const dtoObj = { ...input, year: undefined };
    const dtoInstance = Object.assign(new CreateDeclarationInput(), dtoObj);

    const dtoValidation = await validate(dtoInstance);

    expect(dtoValidation).toBeInstanceOf(Array);
    expect(dtoValidation).toHaveLength(1);
    expect(dtoValidation[0].property).toBe('year');
    expect(dtoValidation[0]).toHaveProperty('constraints', {
      isNotEmpty: 'year should not be empty',
      isNumber: 'year must be a number conforming to the specified constraints',
    });
  });

  it("shouldn't create a declaration without birthday", async () => {
    const dtoObj = { ...input, birthday: undefined };
    const dtoInstance = Object.assign(new CreateDeclarationInput(), dtoObj);

    const dtoValidation = await validate(dtoInstance);

    expect(dtoValidation).toBeInstanceOf(Array);
    expect(dtoValidation).toHaveLength(1);
    expect(dtoValidation[0].property).toBe('birthday');
    expect(dtoValidation[0]).toHaveProperty('constraints', {
      isNotEmpty: 'birthday should not be empty',
      isDate: 'birthday must be a Date instance',
    });
  });

  it("shouldn't create a declaration without declaredAmount", async () => {
    const dtoObj = { ...input, declaredAmount: undefined };
    const dtoInstance = Object.assign(new CreateDeclarationInput(), dtoObj);

    const dtoValidation = await validate(dtoInstance);

    expect(dtoValidation).toBeInstanceOf(Array);
    expect(dtoValidation).toHaveLength(1);
    expect(dtoValidation[0].property).toBe('declaredAmount');
    expect(dtoValidation[0]).toHaveProperty('constraints', {
      isNotEmpty: 'declaredAmount should not be empty',
      isNumber:
        'declaredAmount must be a number conforming to the specified constraints',
    });
  });

  it('should update a declaration', async () => {
    const declarationToUpdate = {
      id: 1,
      ...input,
      update: jest.fn(),
      reload: jest.fn(),
    } as UpdateDeclarationInput;

    (declarationModel.findByPk as jest.Mock).mockResolvedValue(
      declarationToUpdate,
    );
    (userModel.findByPk as jest.Mock).mockResolvedValueOnce({ id: 3 });
    (declarationModel.update as jest.Mock).mockResolvedValue(true);

    expect(
      await resolver.updateDeclaration({
        id: declarationToUpdate.id,
        name: 'New Name',
      }),
    ).toEqual({ name: 'new name', ...declarationToUpdate });
    expect((declarationToUpdate as any).update).toHaveBeenCalled();
    expect((declarationToUpdate as any).reload).toHaveBeenCalled();
  });

  it("shouldn't update a declaration userId if user not found", async () => {
    const declarationToUpdate = {
      id: 1,
      ...input,
      update: jest.fn(),
      reload: jest.fn(),
    } as UpdateDeclarationInput;

    try {
      (declarationModel.findByPk as jest.Mock).mockResolvedValue(
        declarationToUpdate,
      );
      (userModel.findByPk as jest.Mock).mockResolvedValueOnce(undefined);

      expect(
        await resolver.updateDeclaration({
          id: declarationToUpdate.id,
          name: 'New Name',
        }),
      ).toEqual({ name: 'new name', ...declarationToUpdate });
    } catch (error) {
      expect(error).toHaveProperty('response', {
        message: 'No user found with provided addressId.',
        error: 'Not Found',
        statusCode: 404,
      });
    }
  });

  it("shouldn't update a declaration if name is empty", async () => {
    const dtoObj = { id: 1, name: '', update: jest.fn() };
    const dtoInstance = Object.assign(new UpdateDeclarationInput(), dtoObj);

    const dtoValidation = await validate(dtoInstance);

    expect(dtoValidation).toBeInstanceOf(Array);
    expect(dtoValidation).toHaveLength(1);
    expect(dtoValidation[0].property).toBe('name');
    expect(dtoValidation[0].constraints).toHaveProperty(
      'isNotEmpty',
      'name should not be empty',
    );
  });

  it("shouldn't update a declaration if birthday is empty", async () => {
    const dtoObj = { id: 1, birthday: '', update: jest.fn() };
    const dtoInstance = Object.assign(new UpdateDeclarationInput(), dtoObj);

    const dtoValidation = await validate(dtoInstance);

    expect(dtoValidation).toBeInstanceOf(Array);
    expect(dtoValidation).toHaveLength(1);
    expect(dtoValidation[0].property).toBe('birthday');
    expect(dtoValidation[0].constraints).toHaveProperty(
      'isNotEmpty',
      'birthday should not be empty',
    );
  });

  it("shouldn't update a declaration if year is empty", async () => {
    const dtoObj = { id: 1, year: '', update: jest.fn() };
    const dtoInstance = Object.assign(new UpdateDeclarationInput(), dtoObj);

    const dtoValidation = await validate(dtoInstance);

    expect(dtoValidation).toBeInstanceOf(Array);
    expect(dtoValidation).toHaveLength(1);
    expect(dtoValidation[0].property).toBe('year');
    expect(dtoValidation[0].constraints).toHaveProperty(
      'isNotEmpty',
      'year should not be empty',
    );
  });

  it("shouldn't update a declaration if declaredAmount is empty", async () => {
    const dtoObj = { id: 1, declaredAmount: '', update: jest.fn() };
    const dtoInstance = Object.assign(new UpdateDeclarationInput(), dtoObj);

    const dtoValidation = await validate(dtoInstance);

    expect(dtoValidation).toBeInstanceOf(Array);
    expect(dtoValidation).toHaveLength(1);
    expect(dtoValidation[0].property).toBe('declaredAmount');
    expect(dtoValidation[0].constraints).toHaveProperty(
      'isNotEmpty',
      'declaredAmount should not be empty',
    );
  });

  it('should remove a declaration', async () => {
    const declarationToDelete = {
      id: 1,
      ...input,
      destroy: jest.fn(),
    } as UpdateDeclarationInput;

    (declarationModel.findByPk as jest.Mock).mockResolvedValue(
      declarationToDelete,
    );

    expect(await resolver.removeDeclaration(declarationToDelete.id)).toEqual(
      true,
    );
    expect((declarationToDelete as any).destroy).toHaveBeenCalled();
  });

  it('should do nothing if cannot find a declaration to remove', async () => {
    (declarationModel.findByPk as jest.Mock).mockResolvedValue(null);
    try {
      await resolver.removeDeclaration(1111);
    } catch (error) {
      expect(error.message).toEqual('Declaration not found with provided id.');
      expect(error.status).toEqual(404);
    }
  });
});
