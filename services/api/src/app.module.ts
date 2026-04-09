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

    // Database - PostgreSQL with TypeORM
    // Falls back to in-memory mode if DB is not available
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbHost = configService.get('DB_HOST', 'localhost');
        const dbAvailable = dbHost !== 'localhost' || configService.get('DB_ENABLED', 'true') === 'true';

        if (!dbAvailable) {
          // Return a minimal config that won't crash but won't connect
          // Modules use @Optional() + dual-mode pattern for in-memory fallback
          return {
            type: 'postgres' as const,
            host: 'localhost',
            port: 5432,
            username: 'cleanaus',
            password: 'cleanaus_dev_password',
            database: 'cleanaus_dev',
            entities: [],
            synchronize: false,
            logging: false,
          };
        }

        return {
          type: 'postgres' as const,
          host: configService.get('DB_HOST', 'localhost'),
          port: configService.get('DB_PORT', 5432),
          username: configService.get('DB_USERNAME', 'cleanaus'),
          password: configService.get('DB_PASSWORD', 'cleanaus_dev_password'),
          database: configService.get('DB_NAME', 'cleanaus_dev'),
          autoLoadEntities: true,
          synchronize: configService.get('NODE_ENV') === 'development',
          logging: configService.get('DB_LOGGING', false),
          ssl: configService.get('DB_SSL', false),
          migrationsRun: configService.get('NODE_ENV') === 'production',
        };
      },
    }),

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

    // BullMQ for job queues (optional - falls back to in-memory if Redis unavailable)
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
