import { INestApplication } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import * as request from 'supertest';
import { createMutation } from './queries';
import { generateToken, initApp } from '../utils';
import { assoc, dissoc } from 'ramda';
import { declarationInput } from './utils';
import { hashPassword } from '../../src/application/auth/auth.utils';
import { User } from '../../src/application/user/entities/user.entity';

describe('Declaration module - Create (e2e)', () => {
  let app: INestApplication;
  let sequelize: Sequelize;
  let token: string;
  let user: User;

  beforeAll(async () => {
    const { application, db, adminToken } = await initApp();
    app = application;
    sequelize = db;
    token = adminToken;
  });

  beforeEach(async () => {
    await sequelize.getQueryInterface().dropAllTables();
    await sequelize.sync({ force: true });

    user = await User.create({
      username: 'user',
      password: await hashPassword('user'),
    });
    declarationInput.userId = user.id;
  });

  afterAll(async () => {
    await sequelize.close();
    await app.close();
  });

  it('should create an declaration', async () => {
    const token = generateToken();
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: createMutation,
        variables: { input: declarationInput },
      })
      .expect(200);

    expect(res.body.data).not.toBeNull();
    expect(res.body.data).toHaveProperty('createDeclaration');
    expect(res.body.data.createDeclaration).toHaveProperty('id', 1);
    expect(res.body.data.createDeclaration).toHaveProperty(
      'year',
      declarationInput.year,
    );
    expect(res.body.data.createDeclaration).toHaveProperty(
      'name',
      declarationInput.name,
    );
    expect(res.body.data.createDeclaration).toHaveProperty(
      'birthday',
      declarationInput.birthday.toISOString(),
    );
    expect(res.body.data.createDeclaration).toHaveProperty(
      'observation',
      declarationInput.observation,
    );
    expect(res.body.data.createDeclaration).toHaveProperty('user');
  });

  it('should not create an declaration without a year', async () => {
    const inputWithoutNumber = dissoc('year', declarationInput);
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: createMutation,
        variables: { input: inputWithoutNumber },
      })
      .expect(200);

    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors).toHaveLength(1);
    expect(res.body.errors[0]).toHaveProperty('extensions');
    expect(res.body.errors[0].extensions).toHaveProperty(
      'code',
      'BAD_USER_INPUT',
    );
    expect(res.body.errors[0]).toHaveProperty(
      'message',
      'Variable "$input" got invalid value { name: "Ilha Solteira", birthday: "1990-12-03T02:00:00.000Z", declaredAmount: 685.66, userId: 1, observation: "some observation" }; Field "year" of required type "Int!" was not provided.',
    );
  });

  it('should not create an declaration without a name', async () => {
    const inputWithoutNeighborhood = dissoc('name', declarationInput);
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: createMutation,
        variables: { input: inputWithoutNeighborhood },
      })
      .expect(200);

    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors).toHaveLength(1);
    expect(res.body.errors[0]).toHaveProperty('extensions');
    expect(res.body.errors[0].extensions).toHaveProperty(
      'code',
      'BAD_USER_INPUT',
    );
    expect(res.body.errors[0]).toHaveProperty(
      'message',
      'Variable "$input" got invalid value { year: 2024, birthday: "1990-12-03T02:00:00.000Z", declaredAmount: 685.66, userId: 1, observation: "some observation" }; Field "name" of required type "String!" was not provided.',
    );
  });

  it('should not create an declaration without a birthday', async () => {
    const inputWithoutCity = dissoc('birthday', declarationInput);
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: createMutation,
        variables: { input: inputWithoutCity },
      })
      .expect(200);

    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors).toHaveLength(1);
    expect(res.body.errors[0]).toHaveProperty('extensions');
    expect(res.body.errors[0].extensions).toHaveProperty(
      'code',
      'BAD_USER_INPUT',
    );
    expect(res.body.errors[0]).toHaveProperty(
      'message',
      'Variable "$input" got invalid value { name: "Ilha Solteira", year: 2024, declaredAmount: 685.66, userId: 1, observation: "some observation" }; Field "birthday" of required type "DateTime!" was not provided.',
    );
  });

  it('should not create an declaration without a declaredAmount', async () => {
    const inputWithoutPostalCode = dissoc('declaredAmount', declarationInput);
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: createMutation,
        variables: { input: inputWithoutPostalCode },
      })
      .expect(200);

    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors).toHaveLength(1);
    expect(res.body.errors[0]).toHaveProperty('extensions');
    expect(res.body.errors[0].extensions).toHaveProperty(
      'code',
      'BAD_USER_INPUT',
    );
    expect(res.body.errors[0]).toHaveProperty(
      'message',
      'Variable "$input" got invalid value { name: "Ilha Solteira", year: 2024, birthday: "1990-12-03T02:00:00.000Z", userId: 1, observation: "some observation" }; Field "declaredAmount" of required type "Float!" was not provided.',
    );
  });

  it('should not create an declaration with an empty name', async () => {
    const inputWithEmptyStreet = assoc('name', '', declarationInput);
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: createMutation,
        variables: { input: inputWithEmptyStreet },
      })
      .expect(200);

    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors).toHaveLength(1);
    expect(res.body.errors[0]).toHaveProperty('extensions');
    expect(res.body.errors[0].extensions).toHaveProperty('code', 'BAD_REQUEST');
    expect(res.body.errors[0].extensions).toHaveProperty('originalError');
    expect(res.body.errors[0].extensions.originalError).toHaveProperty(
      'message',
      [
        {
          property: 'name',
          constraints: {
            isNotEmpty: 'name should not be empty',
          },
        },
      ],
    );
    expect(res.body.errors[0].extensions.originalError).toHaveProperty(
      'statusCode',
      400,
    );
  });

  it('should not create an declaration with an empty year', async () => {
    const inputWithEmptyNumber = assoc('year', '', declarationInput);
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: createMutation,
        variables: { input: inputWithEmptyNumber },
      })
      .expect(200);

    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors).toHaveLength(1);
    expect(res.body.errors[0]).toHaveProperty('extensions');
    expect(res.body.errors[0].extensions).toHaveProperty(
      'code',
      'BAD_USER_INPUT',
    );
    expect(res.body.errors[0]).toHaveProperty(
      'message',
      'Variable "$input" got invalid value "" at "input.year"; Int cannot represent non-integer value: ""',
    );
  });

  it('should not create an declaration with an empty birthday', async () => {
    const inputWithEmptyNeighborhood = assoc('birthday', '', declarationInput);
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: createMutation,
        variables: { input: inputWithEmptyNeighborhood },
      })
      .expect(200);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors).toHaveLength(1);
    expect(res.body.errors[0]).toHaveProperty('extensions');
    expect(res.body.errors[0].extensions).toHaveProperty('code', 'BAD_REQUEST');
    expect(res.body.errors[0].extensions).toHaveProperty('originalError');
    expect(res.body.errors[0].extensions.originalError).toHaveProperty(
      'message',
      [
        {
          property: 'birthday',
          constraints: {
            isDate: 'birthday must be a Date instance',
          },
        },
      ],
    );
    expect(res.body.errors[0].extensions.originalError).toHaveProperty(
      'statusCode',
      400,
    );
  });

  it('should not create an declaration with an empty declaredAmount', async () => {
    const inputWithEmptyCity = assoc('declaredAmount', '', declarationInput);
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: createMutation,
        variables: { input: inputWithEmptyCity },
      })
      .expect(200);

    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors).toHaveLength(1);
    expect(res.body.errors[0]).toHaveProperty('extensions');
    expect(res.body.errors[0].extensions).toHaveProperty(
      'code',
      'BAD_USER_INPUT',
    );
    expect(res.body.errors[0]).toHaveProperty(
      'message',
      'Variable "$input" got invalid value "" at "input.declaredAmount"; Float cannot represent non numeric value: ""',
    );
  });
});
