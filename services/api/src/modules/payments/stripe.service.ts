import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { OpenTelemetryService } from '../../common/services/opentelemetry.service';

/**
 * Australian GST-compliant Stripe payment service
 * Handles AUD currency, GST calculations, and Australian payment methods
 */
@Injectable()
export class StripeService {
  private readonly logger = new Logger(StripeService.name);
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
    private otel: OpenTelemetryService,
  ) {
    const key = configService.get<string>('STRIPE_SECRET_KEY');
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY environment variable is required');
    }
    
    this.stripe = new Stripe(key, {
      apiVersion: '2023-10-16',
      typescript: true,
    });
  }

  /**
   * Create payment intent for Australian customer
   * All amounts in AUD cents with GST included
   */
  async createPaymentIntent(params: {
    amount: number; // Amount in AUD cents
    bookingId: string;
    customerId: string;
    email: string;
    paymentMethod?: string;
    saveCard?: boolean;
  }): Promise<Stripe.PaymentIntent> {
    return this.otel.trace('stripe.create-payment-intent', async (span) => {
      const { amount, bookingId, customerId, email, saveCard } = params;

      // Calculate GST (10% included in amount)
      const gstAmount = Math.round(amount * 0.1);
      const amountExGst = amount - gstAmount;

      span.setAttributes({
        'payment.amount': amount,
        'payment.gstAmount': gstAmount,
        'payment.currency': 'aud',
        'payment.bookingId': bookingId,
      });

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount,
        currency: 'aud',
        customer: saveCard ? await this.getOrCreateCustomer(customerId, email) : undefined,
        metadata: {
          bookingId,
          customerId,
          gstIncluded: 'true',
          gstAmount: String(gstAmount),
          amountExGst: String(amountExGst),
        },
        automatic_payment_methods: {
          enabled: true,
        },
        // Australian payment methods
        payment_method_types: params.paymentMethod ? [params.paymentMethod] : ['card'],
      });

      this.logger.log(`Payment intent created: ${paymentIntent.id} for $${(amount / 100).toFixed(2)} AUD (GST: $${(gstAmount / 100).toFixed(2)})`);

      return paymentIntent;
    });
  }

  /**
   * Get or create Stripe customer
   */
  private async getOrCreateCustomer(customerId: string, email: string): Promise<string> {
    // Check if customer exists
    const existing = await this.stripe.customers.list({ email, limit: 1 });
    
    if (existing.data.length > 0) {
      return existing.data[0].id;
    }

    // Create new customer
    const customer = await this.stripe.customers.create({
      email,
      metadata: {
        platformCustomerId: customerId,
      },
    });

    return customer.id;
  }

  /**
   * Create Stripe webhook handler
   */
  async handleWebhook(payload: Buffer, signature: string): Promise<Stripe.Event> {
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET environment variable is required');
    }
    
    return this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  }

  /**
   * Refund payment (Australian refund processing)
   */
  async refundPayment(params: {
    paymentIntentId: string;
    amount?: number; // Partial refund amount in cents
    reason?: string;
  }): Promise<Stripe.Refund> {
    return this.otel.trace('stripe.refund-payment', async (span) => {
      const refund = await this.stripe.refunds.create({
        payment_intent: params.paymentIntentId,
        amount: params.amount,
        reason: params.reason ? 'requested_by_customer' : undefined,
      });

      this.logger.log(`Refund processed: ${refund.id}`);
      return refund;
    });
  }

  /**
   * Get payment receipt
   */
  async getReceipt(paymentIntentId: string): Promise<{
    amount: number;
    amountExGst: number;
    gstAmount: number;
    currency: string;
    status: string;
    receiptUrl?: string;
  }> {
    const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
    
    const amount = paymentIntent.amount_received || 0;
    const gstAmount = Math.round(amount * 0.1);
    const amountExGst = amount - gstAmount;

    return {
      amount,
      amountExGst,
      gstAmount,
      currency: 'AUD',
      status: paymentIntent.status,
      receiptUrl: (paymentIntent as any).latest_receipt
        ? `https://pay.stripe.com/receipts/${(paymentIntent as any).latest_receipt}`
        : undefined,
    };
  }
}
