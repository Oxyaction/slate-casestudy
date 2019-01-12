import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { PaymentModule } from './payment.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(PaymentModule, {
    transport: Transport.TCP,
    options: {
      port: 3000
    }
  });
  app.listen(() => console.log('Microservice is listening'));
}
bootstrap();
