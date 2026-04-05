import { Test, TestingModule } from '@nestjs/testing';
import { OpenTelemetryService } from '../../../common/services/opentelemetry.service';
import { SupportAgent } from '../agents';

describe('SupportAgent', () => {
  let agent: SupportAgent;
  let mockOtel: Partial<OpenTelemetryService>;

  beforeEach(async () => {
    mockOtel = {
      trace: jest.fn(async (_name: string, fn: (span: any) => any) => {
        return fn({ setAttribute: jest.fn() });
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SupportAgent,
        { provide: OpenTelemetryService, useValue: mockOtel },
      ],
    }).compile();

    agent = module.get<SupportAgent>(SupportAgent);
  });

  it('should be defined', () => {
    expect(agent).toBeDefined();
  });

  describe('classifyInquiry', () => {
    it('should classify booking inquiries', async () => {
      const result = await agent.analyze({
        payload: {
          inquiry: 'I want to book a cleaning service',
          customerHistory: null,
        },
      });

      expect(result.classification).toBe('BOOKING_INQUIRY');
    });

    it('should classify pricing inquiries', async () => {
      const result = await agent.analyze({
        payload: {
          inquiry: 'How much does cleaning cost?',
          customerHistory: null,
        },
      });

      expect(result.classification).toBe('PRICING_INQUIRY');
    });

    it('should classify cancellations', async () => {
      const result = await agent.analyze({
        payload: {
          inquiry: 'I need to cancel my appointment',
          customerHistory: null,
        },
      });

      expect(result.classification).toBe('CANCELLATION');
    });

    it('should classify complaints', async () => {
      const result = await agent.analyze({
        payload: {
          inquiry: 'I have a complaint about the service',
          customerHistory: null,
        },
      });

      expect(result.classification).toBe('COMPLAINT');
    });

    it('should classify unknown as GENERAL', async () => {
      const result = await agent.analyze({
        payload: {
          inquiry: 'Hello there',
          customerHistory: null,
        },
      });

      expect(result.classification).toBe('GENERAL');
    });
  });

  describe('generateResponse', () => {
    it('should generate response for each classification', async () => {
      const result = await agent.analyze({
        payload: {
          inquiry: 'What is your pricing?',
          customerHistory: null,
        },
      });

      expect(result.response).toBeTruthy();
      expect(result.response.length).toBeGreaterThan(0);
      expect(result.confidence).toBe(0.85);
    });
  });
});
