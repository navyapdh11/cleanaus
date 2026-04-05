import { Injectable, Optional, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StripeService } from './stripe.service';
import { PaymentEntity } from './entities/payment.entity';
import { CreatePaymentIntentRequest } from './dto/create-payment-intent.dto';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @Optional() @InjectRepository(PaymentEntity)
    private paymentRepository?: Repository<PaymentEntity>,
    private stripeService?: StripeService,
  ) {}

  async createPaymentIntent(dto: CreatePaymentIntentRequest, customerId: string, email: string) {
    if (!this.stripeService) {
      throw new Error('Stripe service is not available - check STRIPE_SECRET_KEY');
    }

    const intent = await this.stripeService.createPaymentIntent({
      amount: Math.round(dto.amount * 100), // Convert to cents
      bookingId: dto.bookingId,
      customerId,
      email,
      saveCard: dto.saveCard,
    });

    const payment = this.paymentRepository
      ? this.paymentRepository.create({
          bookingId: dto.bookingId,
          customerId,
          stripePaymentIntentId: intent.id,
          amount: dto.amount,
          currency: 'AUD',
          status: 'pending',
        })
      : null;

    if (payment && this.paymentRepository) {
      await this.paymentRepository.save(payment);
    }

    return {
      clientSecret: intent.client_secret,
      paymentIntentId: intent.id,
      amount: intent.amount,
      currency: intent.currency,
    };
  }

  async handlePaymentSuccess(paymentIntentId: string) {
    const payment = this.paymentRepository
      ? await this.paymentRepository.findOne({ where: { stripePaymentIntentId: paymentIntentId } })
      : null;

    if (payment) {
      payment.status = 'completed';
      payment.completedAt = new Date();
      await this.paymentRepository!.save(payment);
    } else {
      this.logger.warn(`Payment not found for intent: ${paymentIntentId}`);
    }
  }

  async handlePaymentFailure(paymentIntentId: string, error: string) {
    const payment = this.paymentRepository
      ? await this.paymentRepository.findOne({ where: { stripePaymentIntentId: paymentIntentId } })
      : null;

    if (payment) {
      payment.status = 'failed';
      payment.failureReason = error;
      await this.paymentRepository!.save(payment);
    } else {
      this.logger.warn(`Failed payment not found for intent: ${paymentIntentId}, error: ${error}`);
    }
  }
}
