import { INestApplication } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import * as request from 'supertest';
import { updateMutation } from './queries';
import { generateToken, initApp } from '../utils';
import { Declaration } from '../../src/domain/declaration/entities/declaration.entity';
import { declarationInput } from './utils';
import { User } from '../../src/application/user/entities/user.entity';
import { hashPassword } from '../../src/application/auth/auth.utils';
import { UpdateDeclarationInput } from '../../src/domain/declaration/dto/update-declaration.input';

describe('Declaration module - Update (e2e)', () => {
  let app: INestApplication;
  let sequelize: Sequelize;
  let declaration: Declaration;
  let user: User;
  const token = generateToken();

  beforeAll(async () => {
    const { application, db } = await initApp();
    app = application;
    sequelize = db;
  });

  beforeEach(async () => {
    await sequelize.getQueryInterface().dropAllTables();
    await sequelize.sync({ force: true });

    user = await User.create({
      username: 'user',
      password: await hashPassword('user'),
    });
    declaration = await Declaration.create(declarationInput);
  });

  afterAll(async () => {
    await sequelize.close();
    await app.close();
  });

  it('should update an declaration', async () => {
    const updatePayload: UpdateDeclarationInput = {
      id: declaration.id,
      name: 'new declaration name',
    };
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: updateMutation,
        variables: { input: updatePayload },
      })
      .expect(200);

    expect(res.body.data).not.toBeNull();
    expect(res.body.data).toHaveProperty('updateDeclaration');
    expect(res.body.data.updateDeclaration).toHaveProperty('id', 1);
    expect(res.body.data.updateDeclaration).toHaveProperty(
      'year',
      declarationInput.year,
    );
    expect(res.body.data.updateDeclaration).toHaveProperty(
      'name',
      updatePayload.name,
    );
    expect(res.body.data.updateDeclaration).toHaveProperty(
      'birthday',
      declarationInput.birthday.toISOString(),
    );
    expect(res.body.data.updateDeclaration).toHaveProperty(
      'observation',
      declarationInput.observation,
    );
    expect(res.body.data.updateDeclaration).toHaveProperty('user');
  });

  it('should not update a declaration.user if it does not exists', async () => {
    await user.destroy();

    const updatePayload: UpdateDeclarationInput = {
      id: declaration.id,
      userId: 2,
    };
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: updateMutation,
        variables: { input: updatePayload },
      })
      .expect(200);

    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors).toHaveLength(1);
  });

  it('should not update an declaration if it does not exists', async () => {
    await declaration.destroy();

    const updatePayload: UpdateDeclarationInput = {
      id: 1,
      name: 'new name',
    };
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: updateMutation,
        variables: { input: updatePayload },
      })
      .expect(200);

    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors).toHaveLength(1);
    expect(res.body.errors[0]).toHaveProperty(
      'message',
      'No declaration found.',
    );
  });

  it('should not update an declaration with an empty name', async () => {
    const payloadWithEmptyStreet: UpdateDeclarationInput = {
      id: 1,
      name: '',
    };
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: updateMutation,
        variables: { input: payloadWithEmptyStreet },
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

  it('should not update an declaration with an empty birthday', async () => {
    const payloadWithEmptyNumber = {
      id: 1,
      birthday: 'asd',
    };
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: updateMutation,
        variables: { input: payloadWithEmptyNumber },
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

  it('should not update an declaration with an empty year', async () => {
    const payloadWithEmptyNeighborhood = {
      id: 1,
      year: '',
    };
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: updateMutation,
        variables: { input: payloadWithEmptyNeighborhood },
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

  it('should not update an declaration with an empty declaredAmount', async () => {
    const payloadWithEmptyCity = {
      id: 1,
      declaredAmount: '',
    };
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: updateMutation,
        variables: { input: payloadWithEmptyCity },
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
