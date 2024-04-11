import { http } from '@nitric/sdk';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap(port: number) {
  const app = await NestFactory.create(AppModule);
  return await app.listen(port);
}

http(bootstrap);
