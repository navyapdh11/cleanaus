import {
  Controller,
  Post,
  Body,
  Headers,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { StripeService } from './stripe.service';
import { CreatePaymentIntentRequest } from './dto/create-payment-intent.dto';
import { JwtAuthGuard } from '../../modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../modules/auth/decorators/current-user.decorator';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly stripeService: StripeService,
  ) {}

  @Post('create-intent')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
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
  @ApiOperation({ summary: 'Handle Stripe webhooks (no auth required)' })
  @ApiResponse({ status: 200, description: 'Webhook processed' })
  @ApiResponse({ status: 400, description: 'Invalid webhook signature' })
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Request() req: any,
  ) {
    // Stripe requires raw body for signature verification
    const rawBody = req.rawBody || req.body;
    
    try {
      const event = await this.stripeService.handleWebhook(
        typeof rawBody === 'string' ? Buffer.from(rawBody) : rawBody,
        signature,
      );

      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.paymentsService.handlePaymentSuccess(event.data.object.id);
          break;
        case 'payment_intent.payment_failed':
          await this.paymentsService.handlePaymentFailure(
            event.data.object.id,
            (event.data.object as any).last_payment_error?.message || 'Unknown error',
          );
          break;
      }

      return { received: true };
    } catch (err: any) {
      throw new Error(`Webhook error: ${err.message}`);
    }
  }
}
