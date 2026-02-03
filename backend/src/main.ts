import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './common/exception-filters/http-exception.filter';
import { LoggerInterceptor } from './common/interceptors/logger.interceptor';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // global filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // global interceptors
  app.useGlobalInterceptors(new LoggerInterceptor());

  const isDevelopment = configService.get<string>('NODE_ENV') !== 'production';
  app.enableCors({
    origin: isDevelopment
      ? true
      : configService.get<string>('CORS_ORIGIN') || 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const PORT = configService.get<string>('PORT');
  await app.listen(PORT ?? 5200, '0.0.0.0');
  console.log(`Is working on port ${PORT}`);
}
bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
