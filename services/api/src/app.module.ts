import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bullmq';
import { CacheModule } from '@nestjs/cache-manager';
import { TerminusModule } from '@nestjs/terminus';
import { ThrottlerModule } from '@nestjs/throttler';
import { redisStore } from 'cache-manager-redis-yet';

// Core modules
import { AuthModule } from './modules/auth/auth.module';
import { RegionsModule } from './modules/regions/regions.module';
import { ServicesModule } from './modules/services/services.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { PricingModule } from './modules/pricing/pricing.module';
import { CustomersModule } from './modules/customers/customers.module';
import { StaffModule } from './modules/staff/staff.module';
import { DispatchModule } from './modules/dispatch/dispatch.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

// OASIS Agentic Flow
import { OasisAgentModule } from './modules/oasis-agent/oasis-agent.module';

// Shared
import { OpenTelemetryService } from './common/services/opentelemetry.service';
import { HealthController } from './common/controllers/health.controller';

// Australian regions configuration
import { AUSTRALIAN_REGIONS } from './config/australian-regions';

@Module({
  imports: [
    // Global configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // Rate limiting - 60 requests per minute per IP
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 60,
    }]),

    // Database (disabled for demo mode - no PostgreSQL available)
    // TypeOrmModule.forRootAsync({
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => ({
    //     type: 'postgres',
    //     host: configService.get('DB_HOST', 'localhost'),
    //     port: configService.get('DB_PORT', 5432),
    //     username: configService.get('DB_USERNAME', 'cleanaus'),
    //     password: configService.get('DB_PASSWORD'),
    //     database: configService.get('DB_NAME', 'cleanaus_prod'),
    //     entities: [__dirname + '/**/*.entity{.ts,.js}'],
    //     migrations: [__dirname + '/migrations/*{.ts,.js}'],
    //     synchronize: configService.get('NODE_ENV') === 'development',
    //     logging: configService.get('DB_LOGGING', false),
    //     ssl: configService.get('DB_SSL', false),
    //   }),
    // }),

    // Event emitter for domain events
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '.',
      newListener: false,
      removeListener: false,
      maxListeners: 20,
      verboseMemoryLeak: true,
    }),

    // Scheduled tasks
    ScheduleModule.forRoot(),

    // BullMQ for job queues (disabled - Redis not available)
    // BullModule.forRootAsync({
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => ({
    //     connection: {
    //       host: configService.get('REDIS_HOST', 'localhost'),
    //       port: configService.get('REDIS_PORT', 6379),
    //       password: configService.get('REDIS_PASSWORD'),
    //     },
    //   }),
    // }),

    // Cache (in-memory fallback)
    CacheModule.register({
      isGlobal: true,
      ttl: 3600,
      max: 100,
    }),

    // Health checks
    TerminusModule,

    // Domain modules (DDD bounded contexts)
    AuthModule,
    RegionsModule,
    ServicesModule,
    BookingsModule,
    PricingModule,
    CustomersModule,
    StaffModule,
    DispatchModule,
    PaymentsModule,
    NotificationsModule,

    // OASIS Agentic AI Flow
    OasisAgentModule,
  ],
  controllers: [HealthController],
  providers: [OpenTelemetryService],
})
export class AppModule {}
