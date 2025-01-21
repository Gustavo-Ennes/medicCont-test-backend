import { INestApplication } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import * as request from 'supertest';
import { generateToken, initApp } from '../utils';
import { Declaration } from '../../src/domain/declaration/entities/declaration.entity';
import { findAllQuery, findOneQuery } from './queries';
import { declarationInput } from './utils';
import { User } from '../../src/application/user/entities/user.entity';
import { hashPassword } from '../../src/application/auth/auth.utils';

describe('Declaration module - Find (e2e)', () => {
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

  it('should find all declarations by user(token) and year(query param)', async () => {
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: findAllQuery,
        variables: { year: declarationInput.year },
      })
      .expect(200);

    expect(res.body.data).not.toBeNull();
    expect(res.body.data).toHaveProperty('declarations');
    expect(res.body.data.declarations).toHaveLength(1);
    expect(res.body.data.declarations[0]).toHaveProperty('id', 1);
    expect(res.body.data.declarations[0]).toHaveProperty(
      'year',
      declarationInput.year,
    );
    expect(res.body.data.declarations[0]).toHaveProperty(
      'name',
      declarationInput.name,
    );
    expect(res.body.data.declarations[0]).toHaveProperty(
      'birthday',
      declarationInput.birthday.toISOString(),
    );
    expect(res.body.data.declarations[0]).toHaveProperty(
      'observation',
      declarationInput.observation,
    );
    expect(res.body.data.declarations[0]).toHaveProperty('user');
  });

  it('should find one declaration', async () => {
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: findOneQuery,
        variables: { id: 1 },
      })
      .expect(200);

    expect(res.body.data).not.toBeNull();
    expect(res.body.data).toHaveProperty('declaration');
    expect(res.body.data.declaration).toHaveProperty('id', 1);
    expect(res.body.data.declaration).toHaveProperty(
      'year',
      declarationInput.year,
    );
    expect(res.body.data.declaration).toHaveProperty(
      'name',
      declarationInput.name,
    );
    expect(res.body.data.declaration).toHaveProperty(
      'birthday',
      declarationInput.birthday.toISOString(),
    );
    expect(res.body.data.declaration).toHaveProperty(
      'observation',
      declarationInput.observation,
    );
    expect(res.body.data.declaration).toHaveProperty('user');
  });

  it('should return undefined if declaration not found', async () => {
    await declaration.destroy();

    const res = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: findOneQuery,
        variables: { id: 1 },
      })
      .expect(200);

    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('declaration', null);
  });
});
