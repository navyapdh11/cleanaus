import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as helmet from 'helmet';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { OpenTelemetryService } from './common/services/opentelemetry.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  const configService = app.get(ConfigService);
  const port = configService.get('PORT', 3001);
  const nodeEnv = configService.get('NODE_ENV', 'development');

  // Initialize OpenTelemetry
  const otelService = app.get(OpenTelemetryService);
  otelService.initialize();

  // Security
  app.use(helmet());
  app.enableCors({
    origin: configService.get('CORS_ORIGIN', 'http://localhost:3000'),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global filters
  app.useGlobalFilters(new AllExceptionsFilter());

  // Global interceptors
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalInterceptors(new TransformInterceptor());

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('CleanAUS Enterprise API')
    .setDescription('Enterprise-grade cleaning services platform for Australia')
    .setVersion('1.0.0')
    .addBearerAuth()
    .addTag('Regions', 'Australian regions and service areas')
    .addTag('Services', 'Cleaning service types and configurations')
    .addTag('Bookings', 'Service booking management')
    .addTag('Pricing', 'Dynamic pricing engine')
    .addTag('Customers', 'Customer management')
    .addTag('Staff', 'Staff and cleaner management')
    .addTag('Dispatch', 'AI-powered dispatch system')
    .addTag('Payments', 'Payment processing with Stripe')
    .addTag('Notifications', 'Notification system')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // Microservice transport for agentic communication
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: {
      host: configService.get('REDIS_HOST', 'localhost'),
      port: configService.get('REDIS_PORT', 6379),
      password: configService.get('REDIS_PASSWORD'),
    },
  });

  await app.startAllMicroservices();
  await app.listen(port);

  console.log(`
  ╔══════════════════════════════════════════════════════════╗
  ║                                                          ║
  ║   🧹 CleanAUS Enterprise API                             ║
  ║   ──────────────────────────────────────────────────     ║
  ║   Environment: ${nodeEnv.padEnd(42)}║
  ║   Port: ${String(port).padEnd(49)}║
  ║   Docs: http://localhost:${port}/api/docs${' '.repeat(30 - String(port).length)}║
  ║                                                          ║
  ╚══════════════════════════════════════════════════════════╝
  `);
}

bootstrap();
