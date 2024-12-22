import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const corsOptions: CorsOptions = {
    origin: true,
    methods: ['GET'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Response-type'],
    credentials: true,
  };
  app.enableCors(corsOptions);

  await app.listen(process.env.PORT);
}
bootstrap();
