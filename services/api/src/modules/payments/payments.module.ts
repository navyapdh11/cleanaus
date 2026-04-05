import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { StripeService } from './stripe.service';
import { OpenTelemetryService } from '../../common/services/opentelemetry.service';

@Module({
  // TypeORM disabled for demo mode
  controllers: [PaymentsController],
  providers: [PaymentsService, StripeService, OpenTelemetryService],
  exports: [PaymentsService, StripeService],
})
export class PaymentsModule {}
