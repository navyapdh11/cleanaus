import { Controller, Post, Body, Headers, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { StripeService } from './stripe.service';
import { CreatePaymentIntentRequest } from './dto/create-payment-intent.dto';
import { JwtAuthGuard } from '../../modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../modules/auth/decorators/current-user.decorator';

@ApiTags('Payments')
@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly stripeService: StripeService,
  ) {}

  @Post('create-intent')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create Stripe payment intent' })
  @ApiResponse({ status: 200, description: 'Payment intent created' })
  async createPaymentIntent(
    @Body() dto: CreatePaymentIntentRequest,
    @CurrentUser() user: { id: string; email: string },
  ) {
    return this.paymentsService.createPaymentIntent(dto, user.id, user.email);
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  @ApiHeader({ name: 'stripe-signature', required: true })
  @ApiOperation({ summary: 'Handle Stripe webhooks' })
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Body() rawBody: Buffer,
  ) {
    const event = await this.stripeService.handleWebhook(rawBody, signature);

    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.paymentsService.handlePaymentSuccess(event.data.object.id);
        break;
      case 'payment_intent.payment_failed':
        await this.paymentsService.handlePaymentFailure(
          event.data.object.id,
          event.data.object.last_payment_error?.message,
        );
        break;
    }

    return { received: true };
  }
}
