import { INestApplication } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import * as request from 'supertest';
import { generateToken, initApp } from '../utils';
import { removeMutation } from './queries';
import { declarationInput } from './utils';
import { Declaration } from '../../src/domain/declaration/entities/declaration.entity';
import { User } from '../../src/application/user/entities/user.entity';
import { hashPassword } from '../../src/application/auth/auth.utils';

describe('Declaration module - Delete (e2e)', () => {
  let app: INestApplication;
  let sequelize: Sequelize;
  let declaration: Declaration;
  const token = generateToken();

  beforeAll(async () => {
    const { application, db } = await initApp();
    app = application;
    sequelize = db;
  });

  beforeEach(async () => {
    await sequelize.getQueryInterface().dropAllTables();
    await sequelize.sync({ force: true });

    await User.create({
      username: 'user',
      password: await hashPassword('user'),
    });
    declaration = await Declaration.create(declarationInput);
  });

  afterAll(async () => {
    await sequelize.close();
    await app.close();
  });

  it('should delete a declaration with superadmin role', async () => {
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: removeMutation,
        variables: { input: 1 },
      })
      .expect(200);

    expect(res.body.data).toHaveProperty('removeDeclaration', true);
  });

  it('should throw if no declaration found', async () => {
    await declaration.destroy();

    const res = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: removeMutation,
        variables: { input: 1 },
      })
      .expect(200);

    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors).toHaveLength(1);
    expect(res.body.errors[0]).toHaveProperty(
      'message',
      'Declaration not found with provided id.',
    );
  });
});
