import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS ~
  app.enableCors({
    origin: '*',
    methods: 'GET, POST, DELETE, PUT, PATCH, HEAD',
    allowedHeaders: 'Content-Type, Accept',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  await app.listen(process.env.PORT);
  console.log(process.env.PORT);
}
bootstrap();
