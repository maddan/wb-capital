// src/main.ts
import 'dotenv/config';  // <-- add this line
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.enableCors();
  await app.listen(process.env.PORT || 3000);
  console.log(`API at http://localhost:${process.env.PORT || 3000}/api/v1`);
}
bootstrap();
