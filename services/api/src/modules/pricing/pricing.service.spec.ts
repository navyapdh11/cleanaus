import { Test, TestingModule } from '@nestjs/testing';
import { PricingService } from './pricing.service';
import { PricingRuleTypeEnum } from './entities/pricing-rule.entity';

describe('PricingService', () => {
  let service: PricingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PricingService],
    }).compile();

    service = module.get<PricingService>(PricingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calculatePrice', () => {
    it('should calculate price with base rate and GST', async () => {
      const context = {
        serviceId: 'svc-regular-house',
        regionCode: 'NSW',
        date: '2026-04-10',
        time: '10:00',
        bedrooms: 3,
        bathrooms: 2,
      };

      const result = await service.calculatePrice(context as any);

      expect(result).toBeDefined();
      expect(result.basePrice).toBeGreaterThan(0);
      expect(result.gstAmount).toBeGreaterThan(0);
      expect(result.finalTotal).toBeGreaterThan(0);
      expect(result.currency).toBe('AUD');
      expect(result.gstIncluded).toBe(true);
    });

    it('should apply weekend surcharge', async () => {
      // April 11, 2026 is a Saturday
      const context = {
        serviceId: 'svc-regular-house',
        regionCode: 'NSW',
        date: '2026-04-11',
        time: '10:00',
        bedrooms: 2,
        bathrooms: 1,
      };

      const result = await service.calculatePrice(context as any);
      expect(result.demandMultiplier).toBeGreaterThan(1.0);
    });

    it('should calculate based on property size', async () => {
      const smallProperty = {
        serviceId: 'svc-regular-house',
        regionCode: 'NSW',
        date: '2026-04-10',
        time: '10:00',
        bedrooms: 1,
        bathrooms: 1,
      };

      const largeProperty = {
        serviceId: 'svc-regular-house',
        regionCode: 'NSW',
        date: '2026-04-10',
        time: '10:00',
        bedrooms: 5,
        bathrooms: 3,
      };

      const smallResult = await service.calculatePrice(smallProperty as any);
      const largeResult = await service.calculatePrice(largeProperty as any);

      expect(largeResult.basePrice).toBeGreaterThan(smallResult.basePrice);
    });

    it('should include GST in final total', async () => {
      const context = {
        serviceId: 'svc-regular-house',
        regionCode: 'NSW',
        date: '2026-04-10',
        time: '10:00',
        bedrooms: 2,
        bathrooms: 1,
      };

      const result = await service.calculatePrice(context as any);
      const expectedTotal = result.totalBeforeGst + result.gstOnTotal;
      
      expect(Math.abs(result.finalTotal - expectedTotal)).toBeLessThan(0.01);
    });

    it('should handle add-ons', async () => {
      const context = {
        serviceId: 'svc-regular-house',
        regionCode: 'NSW',
        date: '2026-04-10',
        time: '10:00',
        bedrooms: 2,
        bathrooms: 1,
        addOns: {
          ovenClean: 45,
          windowClean: 60,
        },
      };

      const result = await service.calculatePrice(context as any);
      expect(result.addOnsTotal).toBe(105);
    });
  });

  describe('getAllRules', () => {
    it('should return pricing rules', async () => {
      const rules = await service.getAllRules();
      expect(Array.isArray(rules)).toBe(true);
      expect(rules.length).toBeGreaterThan(0);
    });
  });

  describe('createRule', () => {
    it('should create a new pricing rule', async () => {
      const rule = await service.createRule({
        type: PricingRuleTypeEnum.DEMAND_MULTIPLIER,
        name: 'Test Rule',
        description: 'Test description',
        multiplier: 1.15,
        conditions: { dayOfWeek: ['saturday'] },
        appliesToRegions: ['NSW'],
        priority: 10,
      });

      expect(rule).toBeDefined();
      expect(rule.id).toBeDefined();
      expect(rule.name).toBe('Test Rule');
    });
  });
});
