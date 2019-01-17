import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { PaymentModule } from './payment.module';
const config = require('config');

async function bootstrap() {
  const app = await NestFactory.createMicroservice(PaymentModule, {
    transport: Transport.TCP,
    options: {
      port: parseInt(config.get('port'), 10)
    },
  });

  app.listen(() => console.log('Microservice is listening'));
}
bootstrap();
