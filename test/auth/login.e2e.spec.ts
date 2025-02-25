import { INestApplication } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import * as request from 'supertest';
import { hashPassword } from '../../src/application/auth/auth.utils';
import { User } from '../../src/application/user/entities/user.entity';
import { loginMutation } from './mutation';
import { defaultLoginInput, loginWithout } from './utils';
import { initApp, requestAndCheckError } from '../utils';
import { JwtService } from '@nestjs/jwt';

describe('Auth Module - Login (e2e)', () => {
  let app: INestApplication;
  let sequelize: Sequelize;
  let jwtService: JwtService;

  beforeAll(async () => {
    const { application, db } = await initApp();
    app = application;
    sequelize = db;
  });

  beforeEach(async () => {
    await sequelize.getQueryInterface().dropAllTables();
    await sequelize.sync({ force: true });
    jwtService = app.get<JwtService>(JwtService);
  });

  afterAll(async () => {
    await sequelize.close();
    await app.close();
  });

  it('should login', async () => {
    const userInput = {
      username: defaultLoginInput.username,
      password: await hashPassword(defaultLoginInput.password),
      email: 'teste@teste.com',
    };
    const user: User = await User.create(userInput);

    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: loginMutation,
        variables: { input: defaultLoginInput },
      })
      .expect(200);

    const accessToken = res.body.data.login.access_token;
    const decodedToken = await jwtService.decode(accessToken);

    expect(res.body.data).toHaveProperty('login');
    expect(res.body.data.login).toHaveProperty('access_token');
    expect(accessToken).not.toBeUndefined();
    expect(accessToken).not.toBeNull();

    expect(decodedToken).toHaveProperty('sub', user.id);
    expect(decodedToken).toHaveProperty('username', userInput.username);
    expect(decodedToken).toHaveProperty('email', userInput.email);
    expect(decodedToken).toHaveProperty('iat');
  });

  it('should not login if username is empty', async () =>
    await requestAndCheckError('login')({
      app,
      query: loginMutation,
      variables: { input: loginWithout.username },
      property: 'username',
      constraints: {
        isNotEmpty: 'username should not be empty',
      },
    }));

  it('should not login if password is empty', async () =>
    await requestAndCheckError('login')({
      app,
      query: loginMutation,
      variables: { input: loginWithout.password },
      property: 'password',
      constraints: {
        isNotEmpty: 'password should not be empty',
      },
    }));

  it('should not login if password do not match', async () =>
    await requestAndCheckError('login')({
      app,
      query: loginMutation,
      variables: { input: { ...defaultLoginInput, password: '222' } },
      property: 'password',
      code: 'INTERNAL_SERVER_ERROR',
    }));
});
