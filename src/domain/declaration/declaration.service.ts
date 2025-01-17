import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateDeclarationInput } from './dto/create-declaration.input';
import { UpdateDeclarationInput } from './dto/update-declaration.input';
import { InjectModel } from '@nestjs/sequelize';
import { Declaration } from './entities/declaration.entity';
import { UserService } from '../../application/user/user.service';
import { User } from '../../application/user/entities/user.entity';

@Injectable()
export class DeclarationService {
  constructor(
    @InjectModel(Declaration)
    private readonly declarationModel: typeof Declaration,
    private readonly userService: UserService,
  ) {}

  private readonly logger = new Logger(DeclarationService.name);

  async create(
    createDeclarationDto: CreateDeclarationInput,
  ): Promise<Declaration> {
    try {
      const { userId } = createDeclarationDto;
      const user = await this.userService.findOne(userId);

      if (!user)
        throw new NotFoundException('User not found with provided id.');

      const newDeclaration: Declaration =
        await this.declarationModel.create(createDeclarationDto);
      await newDeclaration.reload({ include: [{ model: User }] });

      return newDeclaration;
    } catch (error) {
      this.logger.error(
        `${this.create.name} -> ${error.message}`,
        error.stack,
        { createDeclarationDto },
      );
      throw error;
    }
  }

  async findAll({ sub: userId }): Promise<Declaration[]> {
    try {
      const declarations: Declaration[] = await this.declarationModel.findAll({
        where: { userId },
        include: [{ model: User }],
      });

      return declarations;
    } catch (error) {
      this.logger.error(
        `${this.findAll.name} -> ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findOne(id: number): Promise<Declaration> {
    try {
      const declaration: Declaration = await this.declarationModel.findByPk(
        id,
        { include: [{ model: User }] },
      );
      return declaration;
    } catch (error) {
      this.logger.error(
        `${this.findOne.name} -> ${error.message}`,
        error.stack,
        { id },
      );
      throw error;
    }
  }

  async update(
    updateDeclarationDto: UpdateDeclarationInput,
  ): Promise<Declaration> {
    try {
      let user: User;
      const { id, userId } = updateDeclarationDto;
      const declaration = await this.declarationModel.findByPk(id);

      if (!declaration) throw new NotFoundException('No declaration found.');

      if (userId) user = await this.userService.findOne(userId);
      if (userId && !user)
        throw new NotFoundException('User not found with provided addressId.');

      await declaration.update(updateDeclarationDto);
      await declaration.reload({ include: [{ model: User }] });

      return declaration;
    } catch (error) {
      this.logger.error(
        `${this.update.name} -> ${error.message}`,
        error.stack,
        { updateDeclarationDto },
      );
      throw error;
    }
  }

  async remove(id: number): Promise<boolean> {
    try {
      const declaration = await this.findOne(id);
      if (!declaration)
        throw new NotFoundException('Declaration not found with provided id.');

      await declaration.destroy();

      return true;
    } catch (error) {
      this.logger.error(
        `${this.update.name} -> ${error.message}`,
        error.stack,
        { id },
      );
      throw error;
    }
  }
}
