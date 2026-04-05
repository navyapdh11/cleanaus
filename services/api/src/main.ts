import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import * as bodyParser from 'body-parser';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { OpenTelemetryService } from './common/services/opentelemetry.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    rawBody: true, // Required for Stripe webhook signature verification
  });

  const configService = app.get(ConfigService);
  const port = configService.get('PORT', 3001);
  const nodeEnv = configService.get('NODE_ENV', 'development');

  // Initialize OpenTelemetry
  const otelService = app.get(OpenTelemetryService);
  otelService.initialize();

  // Security headers
  app.use((req: any, res: any, next: any) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    if (nodeEnv === 'production') {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }
    next();
  });

  // CORS with allowlist based on environment
  const allowedOrigins = nodeEnv === 'production'
    ? ['https://cleanaus.com.au', 'https://www.cleanaus.com.au']
    : ['http://localhost:3000', 'http://localhost:3001'];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    maxAge: 3600,
  });

  // Body size limits - protection against DoS
  app.use(bodyParser.json({ limit: '1mb' }));
  app.use(bodyParser.urlencoded({ limit: '1mb', extended: true }));
  // Raw body for Stripe webhooks
  app.use('/payments/webhook', bodyParser.raw({ type: 'application/json' }));

  // Rate limiting - 60 requests per minute per IP
  // Configured via ThrottlerModule.forRoot in AppModule
  // Note: ThrottlerGuard is applied at the module level for granular control

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

  await app.listen(port);

  console.log(`
  ╔══════════════════════════════════════════════════════════╗
  ║                                                          ║
  ║   🧹 CleanAUS Enterprise API                             ║
  ║   ──────────────────────────────────────────────────     ║
  ║   Environment: ${nodeEnv.padEnd(42)}║
  ║   Port: ${String(port).padEnd(49)}║
  ║   Docs: http://localhost:${port}/api/docs${' '.repeat(Math.max(0, 30 - String(port).length))}║
  ║                                                          ║
  ╚══════════════════════════════════════════════════════════╝
  `);
}

bootstrap();
