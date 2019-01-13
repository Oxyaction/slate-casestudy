import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { PaymentModule } from './payment.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(PaymentModule, {
    transport: Transport.TCP,
    options: {
      port: parseInt(process.env.SERVICE_HOST, 10)
    },
  });

  app.listen(() => console.log('Microservice is listening'));
}
bootstrap();
