import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { StripeService } from './stripe.service';
import { CreatePaymentIntentRequest } from './dto/create-payment-intent.dto';
import { Logger } from '@nestjs/common';

describe('PaymentsService', () => {
  let service: PaymentsService;
  let mockStripeService: Partial<StripeService>;

  beforeEach(async () => {
    mockStripeService = {
      createPaymentIntent: jest.fn().mockResolvedValue({
        id: 'pi_test123',
        client_secret: 'cs_test123',
        amount: 15000,
        currency: 'aud',
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        { provide: StripeService, useValue: mockStripeService },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPaymentIntent', () => {
    it('should create a payment intent with correct amount in cents', async () => {
      const dto: CreatePaymentIntentRequest = {
        bookingId: 'booking-123',
        amount: 150, // $150.00
      };

      const result = await service.createPaymentIntent(
        dto,
        'customer-123',
        'test@example.com',
      );

      expect(mockStripeService.createPaymentIntent).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: 15000, // $150.00 in cents
          bookingId: 'booking-123',
          customerId: 'customer-123',
          email: 'test@example.com',
        }),
      );

      expect(result).toEqual({
        clientSecret: 'cs_test123',
        paymentIntentId: 'pi_test123',
        amount: 15000,
        currency: 'aud',
      });
    });

    it('should throw error when StripeService is not available', async () => {
      const module = await Test.createTestingModule({
        providers: [
          PaymentsService,
          { provide: StripeService, useValue: undefined },
        ],
      }).compile();

      const serviceWithoutStripe = module.get<PaymentsService>(PaymentsService);

      await expect(
        serviceWithoutStripe.createPaymentIntent(
          { bookingId: 'test', amount: 100 },
          'cust',
          'test@test.com',
        ),
      ).rejects.toThrow('Stripe service is not available');
    });

    it('should convert dollars to cents correctly', async () => {
      const testCases = [
        { dollars: 100, cents: 10000 },
        { dollars: 1, cents: 100 },
        { dollars: 99.99, cents: 9999 },
        { dollars: 0.01, cents: 1 },
      ];

      for (const tc of testCases) {
        await service.createPaymentIntent(
          { bookingId: 'test', amount: tc.dollars },
          'cust',
          'test@test.com',
        );

        expect(mockStripeService.createPaymentIntent).toHaveBeenCalledWith(
          expect.objectContaining({ amount: tc.cents }),
        );

        jest.clearAllMocks();
      }
    });
  });

  describe('handlePaymentSuccess', () => {
    it('should log warning when payment not found', async () => {
      const warnSpy = jest.spyOn(Logger.prototype, 'warn');
      await service.handlePaymentSuccess('unknown-intent');
      expect(warnSpy).toHaveBeenCalled();
      warnSpy.mockRestore();
    });
  });

  describe('handlePaymentFailure', () => {
    it('should log warning with error details when payment not found', async () => {
      const warnSpy = jest.spyOn(Logger.prototype, 'warn');
      await service.handlePaymentFailure('unknown-intent', 'card declined');
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('unknown-intent'),
      );
      warnSpy.mockRestore();
    });
  });
});
