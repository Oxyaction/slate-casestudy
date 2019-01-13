import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { Transport } from '@nestjs/microservices';
import * as express from 'express';
import { PaymentRejectedException } from '../src/exceptions/payment-rejected.exceptions';
import { PaymentModule } from '../src/payment.module';
import { TestController } from '../src/controllers/test.controller';
import { PaymentService } from '../src/services/payment.service';
import { PaymentDto } from '../src/dto/payment.dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let server;
  let paymentService;
  let paymentDto;

  beforeEach(async () => {
    // paymentService = new PaymentService();
    paymentDto = new PaymentDto();
    const module = await Test.createTestingModule({
      imports: [PaymentModule],
      providers: [{
        provide: 'PaymentService',
        useValue: paymentService
      }],
      controllers: [TestController]
    }).compile();

    paymentService = module.get<PaymentService>(PaymentService);

    server = express();
    app = module.createNestApplication(server);
    
    app.connectMicroservice({
      transport: Transport.TCP,
    });

    await app.startAllMicroservicesAsync();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/ (POST)', () => {
    jest.spyOn(paymentService, 'pay').mockImplementation(() => true);

    return request(server)
      .post('/?command=pay')
      .send(paymentDto)
      .expect(200, 'true');
  });

  it('/ (POST) exception',() => {
    let exception = new PaymentRejectedException();

    jest.spyOn(paymentService, 'pay').mockImplementation(() => { 
      throw exception;
    });

    return request(server)
      .post('/?command=pay')
      .send(paymentDto)
      .expect(200, JSON.stringify({ error: true, message: exception.message }));
  });
});
