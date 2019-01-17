import { INestApplication, INestMicroservice } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { Transport } from '@nestjs/microservices';
import * as express from 'express';
import { PaymentRejectedException } from '../src/exceptions/payment-rejected.exception';
import { PaymentModule } from '../src/payment.module';
import { TestController } from './test.controller';
import { PaymentService } from '../src/services/payment.service';
import { PaymentDto } from '../src/dto/payment.dto';
import { TestingModule } from './testing.module';

const log = require('why-is-node-running');

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let server;
  let paymentService;
  let paymentDto: PaymentDto;
  let microservice: INestMicroservice;

  beforeEach(async () => {
    paymentDto = {
      amount: 2000,
      cardNumber: '1111-1111-1111-1111',
      cvv: 111,
      expiresMonth: 5,
      expiresYear: 2025,
      orderId: 23
    };

    const module = await Test.createTestingModule({
      imports: [PaymentModule, TestingModule],
    }).compile();

    paymentService = module.get<PaymentService>(PaymentService);

    server = express();
    app = module.createNestApplication(server);
    
    microservice = app.connectMicroservice({
      transport: Transport.TCP,
    });

    await app.startAllMicroservicesAsync();
    await app.init();
  });

  afterEach(async () => {
    await microservice.close();
    await app.close();
  });

  it('should return validation error', async () => {
    const invalidPaymentDto = new PaymentDto();
    return request(server)
      .post('/?command=pay')
      .send(invalidPaymentDto)
      .expect(200, '{"error":true,"message":"validation failed","errors":[{"attribute":"amount","errors":["amount should not be empty","amount must be an integer number"]},{"attribute":"orderId","errors":["orderId should not be empty","orderId must be an integer number"]},{"attribute":"cardNumber","errors":["cardNumber should not be empty","cardNumber must be a string"]},{"attribute":"expiresMonth","errors":["expiresMonth should not be empty","expiresMonth must be an integer number"]},{"attribute":"expiresYear","errors":["expiresYear should not be empty","expiresYear must be an integer number"]},{"attribute":"cvv","errors":["cvv should not be empty","cvv must be an integer number"]}]}');
  });

  it('should return `{"result": true} on success`', () => { 
    jest.spyOn(paymentService, 'pay').mockImplementation(() => true);

    return request(server)
      .post('/?command=pay')
      .send(paymentDto)
      .expect(200, { result: true });
  });

  it('should return error on payment failed',() => {
    let exception = new PaymentRejectedException();

    jest.spyOn(paymentService, 'pay').mockImplementation(() => { 
      throw exception;
    });

    return request(server)
      .post('/?command=pay')
      .send(paymentDto)
      .expect(200, { error: true, message: exception.message });
  });
});


// setTimeout(() => {
//   log();
// }, 5000)