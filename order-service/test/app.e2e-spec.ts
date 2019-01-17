import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { OrderModule } from '../src/order.module';
import { Connection } from 'typeorm';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let connection: Connection;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [OrderModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    connection = app.get<Connection>(Connection);
    await app.init();
  });

  afterAll(async () => {
    console.log(connection);
    
    await connection.close();
    await app.close();
  });

  it('/orders (POST)', () => {
    return request(app.getHttpServer())
      .post('/orders')
      .expect(201);
  });
});
