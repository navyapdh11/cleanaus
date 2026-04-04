import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StripeService } from './stripe.service';
import { PaymentEntity } from './entities/payment.entity';
import { CreatePaymentIntentRequest } from './dto/create-payment-intent.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(PaymentEntity)
    private paymentRepository: Repository<PaymentEntity>,
    private stripeService: StripeService,
  ) {}

  async createPaymentIntent(dto: CreatePaymentIntentRequest, customerId: string, email: string) {
    const intent = await this.stripeService.createPaymentIntent({
      amount: Math.round(dto.amount * 100), // Convert to cents
      bookingId: dto.bookingId,
      customerId,
      email,
      saveCard: dto.saveCard,
    });

    // Save payment record
    const payment = this.paymentRepository.create({
      bookingId: dto.bookingId,
      customerId,
      stripePaymentIntentId: intent.id,
      amount: dto.amount,
      currency: 'AUD',
      status: 'pending',
    });

    await this.paymentRepository.save(payment);

    return {
      clientSecret: intent.client_secret,
      paymentIntentId: intent.id,
      amount: intent.amount,
      currency: intent.currency,
    };
  }

  async handlePaymentSuccess(paymentIntentId: string) {
    const payment = await this.paymentRepository.findOne({
      where: { stripePaymentIntentId: paymentIntentId },
    });

    if (payment) {
      payment.status = 'completed';
      payment.completedAt = new Date();
      await this.paymentRepository.save(payment);
    }
  }

  async handlePaymentFailure(paymentIntentId: string, error: string) {
    const payment = await this.paymentRepository.findOne({
      where: { stripePaymentIntentId: paymentIntentId },
    });

    if (payment) {
      payment.status = 'failed';
      payment.failureReason = error;
      await this.paymentRepository.save(payment);
    }
  }
}
