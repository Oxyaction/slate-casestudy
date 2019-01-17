import { NestFactory } from '@nestjs/core';
import { OrderModule } from './order.module';
const config = require('config');

async function bootstrap() {
  const app = await NestFactory.create(OrderModule);
  await app.listen(config.get('port'));
}
bootstrap();
