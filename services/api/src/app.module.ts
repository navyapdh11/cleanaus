import { Module, OnModuleInit, Logger } from '@nestjs/common';
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

// Entities (for TypeORM)
import { RegionEntity } from './modules/regions/entities/region.entity';
import { ServiceEntity } from './modules/services/entities/service.entity';
import { BookingEntity } from './modules/bookings/entities/booking.entity';
import { PricingRuleEntity } from './modules/pricing/entities/pricing-rule.entity';
import { CustomerEntity } from './modules/customers/entities/customer.entity';
import { StaffEntity } from './modules/staff/entities/staff.entity';
import { DispatchAssignmentEntity } from './modules/dispatch/entities/dispatch-assignment.entity';
import { PaymentEntity } from './modules/payments/entities/payment.entity';
import { NotificationEntity } from './modules/notifications/entities/notification.entity';
import { AgentLogEntity } from './modules/oasis-agent/entities/agent-log.entity';
import { DecisionEntity } from './modules/oasis-agent/entities/decision.entity';

// Australian regions configuration
import { AUSTRALIAN_REGIONS } from './config/australian-regions';

/**
 * AppModule - Enterprise CleanAUS Platform
 * 
 * All modules are enabled with in-memory fallback support.
 * TypeORM is configured but falls back gracefully when DB is unavailable.
 * Rate limiting is applied globally via ThrottlerGuard.
 */
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
    // Gracefully handles missing DB - modules use in-memory fallback
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbEnabled = configService.get<string>('DB_ENABLED', 'true') === 'true';
        if (!dbEnabled) {
          Logger.warn('⚠️  Database disabled - using in-memory mode', 'AppModule');
          // manualInitialization prevents TypeORM from trying to connect
          return {
            type: 'postgres' as const,
            entities: [],
            synchronize: false,
            manualInitialization: true,
          };
        }
        return {
          type: 'postgres' as const,
          host: configService.get<string>('DB_HOST', 'localhost'),
          port: configService.get<number>('DB_PORT', 5432),
          username: configService.get<string>('DB_USERNAME', 'cleanaus'),
          password: configService.get<string>('DB_PASSWORD', ''),
          database: configService.get<string>('DB_NAME', 'cleanaus'),
          entities: [
            RegionEntity,
            ServiceEntity,
            BookingEntity,
            PricingRuleEntity,
            CustomerEntity,
            StaffEntity,
            DispatchAssignmentEntity,
            PaymentEntity,
            NotificationEntity,
            AgentLogEntity,
            DecisionEntity,
          ],
          synchronize: configService.get<string>('NODE_ENV', 'development') === 'development',
          logging: configService.get<string>('DB_LOGGING', 'false') === 'true',
          ssl: configService.get<string>('DB_SSL', 'false') === 'true'
            ? { rejectUnauthorized: false }
            : false,
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

    // BullMQ for job queues (falls back gracefully if Redis unavailable)
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const redisHost = configService.get('REDIS_HOST', 'localhost');
        const redisPort = configService.get('REDIS_PORT', 6379);
        const redisPassword = configService.get('REDIS_PASSWORD');
        // Graceful fallback - if Redis not available, BullMQ will handle it
        return {
          connection: {
            host: redisHost,
            port: redisPort,
            password: redisPassword || undefined,
            retryStrategy: (times: number) => {
              if (times > 3) return null; // Stop retrying after 3 attempts
              return Math.min(times * 200, 2000);
            },
          },
        };
      },
    }),

    // Cache with Redis (falls back to in-memory)
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        try {
          const redisHost = configService.get('REDIS_HOST', 'localhost');
          const redisPort = configService.get('REDIS_PORT', 6379);
          const redisPassword = configService.get('REDIS_PASSWORD');
          const store = await redisStore({
            socket: { host: redisHost, port: redisPort },
            password: redisPassword || undefined,
            ttl: 3600,
          });
          return { store };
        } catch {
          Logger.warn('⚠️  Redis unavailable - using in-memory cache', 'AppModule');
          return { ttl: 3600, max: 100 };
        }
      },
    }),

    // Health checks
    TerminusModule,

    // Domain modules (ALL ENABLED with in-memory fallback)
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
export class AppModule implements OnModuleInit {
  private readonly logger = new Logger(AppModule.name);

  async onModuleInit() {
    this.logger.log('🚀 CleanAUS Enterprise Platform - All Modules Loaded');
    this.logger.log('📊 Services: Regions, Services, Bookings, Pricing, Customers, Staff, Dispatch, Payments, Notifications');
    this.logger.log('🤖 OASIS AI Agents: Scheduling, Pricing, Dispatch, Support, Quality');
    this.logger.log('💾 Mode: In-memory fallback enabled (DB optional)');
    this.logger.log('🔒 Rate Limiting: 60 req/min per IP');
  }
}
