import { Injectable, Optional, Logger, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PricingRuleEntity, PricingRuleTypeEnum } from './entities/pricing-rule.entity';
import { PricingContextDto, PriceBreakdownDto, CreatePricingRuleDto } from './dto/pricing.dto';

@Injectable()
export class PricingService {
  private readonly logger = new Logger(PricingService.name);
  private readonly GST_RATE = 0.10; // Australian GST 10%
  private inMemoryRules: Map<string, PricingRuleEntity> = new Map();

  constructor(
    @Optional() @InjectRepository(PricingRuleEntity)
    private pricingRuleRepository?: Repository<PricingRuleEntity>,
  ) {
    this.seedDefaultPricingRules();
  }

  private async seedDefaultPricingRules() {
    const defaultRules: Omit<PricingRuleEntity, 'createdAt' | 'updatedAt'>[] = [
      {
        id: 'rule-gst',
        type: 'base_rate' as any,
        name: 'Australian GST',
        description: '10% GST included in all prices',
        multiplier: 1.0,
        fixedAmount: null,
        conditions: {},
        appliesToRegions: ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'],
        appliesToServices: [],
        validFrom: null,
        validUntil: null,
        isActive: true,
        priority: 0,
      },
      {
        id: 'rule-weekend',
        type: 'demand_multiplier' as any,
        name: 'Weekend Surcharge',
        description: '15% surcharge for Saturday/Sunday bookings',
        multiplier: 1.15,
        fixedAmount: null,
        conditions: { dayOfWeek: ['saturday', 'sunday'] },
        appliesToRegions: [],
        appliesToServices: [],
        validFrom: null,
        validUntil: null,
        isActive: true,
        priority: 10,
      },
      {
        id: 'rule-peak-hours',
        type: 'demand_multiplier' as any,
        name: 'Peak Hours Surcharge',
        description: '10% surcharge for 8-10am and 4-6pm slots',
        multiplier: 1.10,
        fixedAmount: null,
        conditions: { timeSlots: ['08:00', '09:00', '16:00', '17:00'] },
        appliesToRegions: [],
        appliesToServices: [],
        validFrom: null,
        validUntil: null,
        isActive: true,
        priority: 10,
      },
      {
        id: 'rule-loyalty-bronze',
        type: 'loyalty_discount' as any,
        name: 'Bronze Tier Discount',
        description: '5% discount for bronze tier customers',
        multiplier: 0.95,
        fixedAmount: null,
        conditions: { tier: 'bronze', minBookings: 5 },
        appliesToRegions: [],
        appliesToServices: [],
        validFrom: null,
        validUntil: null,
        isActive: true,
        priority: 20,
      },
      {
        id: 'rule-loyalty-silver',
        type: 'loyalty_discount' as any,
        name: 'Silver Tier Discount',
        description: '10% discount for silver tier customers',
        multiplier: 0.90,
        fixedAmount: null,
        conditions: { tier: 'silver', minBookings: 15 },
        appliesToRegions: [],
        appliesToServices: [],
        validFrom: null,
        validUntil: null,
        isActive: true,
        priority: 20,
      },
      {
        id: 'rule-loyalty-gold',
        type: 'loyalty_discount' as any,
        name: 'Gold Tier Discount',
        description: '15% discount for gold tier customers',
        multiplier: 0.85,
        fixedAmount: null,
        conditions: { tier: 'gold', minBookings: 30 },
        appliesToRegions: [],
        appliesToServices: [],
        validFrom: null,
        validUntil: null,
        isActive: true,
        priority: 20,
      },
      {
        id: 'rule-remote-region',
        type: 'region_surcharge' as any,
        name: 'Remote Region Surcharge',
        description: '$25 surcharge for remote areas',
        multiplier: 1.0,
        fixedAmount: 25,
        conditions: { isRemote: true },
        appliesToRegions: ['NT', 'TAS', 'WA'],
        appliesToServices: [],
        validFrom: null,
        validUntil: null,
        isActive: true,
        priority: 15,
      },
      {
        id: 'rule-urgent',
        type: 'urgent_booking_fee' as any,
        name: 'Urgent Booking Fee',
        description: '$30 flat fee for same-day bookings',
        multiplier: 1.0,
        fixedAmount: 30,
        conditions: { isUrgent: true },
        appliesToRegions: [],
        appliesToServices: [],
        validFrom: null,
        validUntil: null,
        isActive: true,
        priority: 25,
      },
      {
        id: 'rule-recurring',
        type: 'bundle_discount' as any,
        name: 'Recurring Booking Discount',
        description: '8% discount for recurring bookings',
        multiplier: 0.92,
        fixedAmount: null,
        conditions: { isRecurring: true },
        appliesToRegions: [],
        appliesToServices: [],
        validFrom: null,
        validUntil: null,
        isActive: true,
        priority: 20,
      },
    ];

    for (const rule of defaultRules) {
      if (!this.inMemoryRules.has(rule.id)) {
        this.inMemoryRules.set(rule.id, {
          ...rule,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as PricingRuleEntity);
      }
    }
    this.logger.log(`Seeded ${defaultRules.length} default pricing rules`);
  }

  async calculatePrice(context: PricingContextDto): Promise<PriceBreakdownDto> {
    const rules = await this.getActiveRules();

    // Base price from service lookup (demo: default $120)
    let basePrice = 120;

    // In production, fetch from ServicesService
    // For now, use a reasonable default based on context
    if (context.bedrooms && context.bathrooms) {
      basePrice = 80 + context.bedrooms * 25 + context.bathrooms * 20;
    }

    let demandMultiplier = 1.0;
    let loyaltyDiscount = 1.0;
    let regionSurcharge = 0;
    let urgentFee = 0;
    let addOnsTotal = 0;

    // Apply add-ons
    if (context.addOns) {
      for (const [_key, value] of Object.entries(context.addOns)) {
        if (typeof value === 'number') {
          addOnsTotal += value;
        }
      }
    }

    // Evaluate applicable rules
    const sortedRules = rules.sort((a, b) => b.priority - a.priority);

    for (const rule of sortedRules) {
      if (!this.isRuleApplicable(rule, context)) continue;

      switch (rule.type) {
        case 'demand_multiplier':
          demandMultiplier *= rule.multiplier;
          break;
        case 'loyalty_discount':
          loyaltyDiscount *= rule.multiplier;
          break;
        case 'region_surcharge':
          if (rule.fixedAmount) {
            regionSurcharge += rule.fixedAmount;
          }
          break;
        case 'urgent_booking_fee':
          if (rule.fixedAmount) {
            urgentFee += rule.fixedAmount;
          }
          break;
      }
    }

    const totalBeforeGst = basePrice * demandMultiplier * loyaltyDiscount + regionSurcharge + urgentFee + addOnsTotal;
    const gstOnTotal = Math.round(totalBeforeGst * this.GST_RATE * 100) / 100;
    const finalTotal = Math.round((totalBeforeGst + gstOnTotal) * 100) / 100;
    const gstAmount = Math.round(basePrice * this.GST_RATE * 100) / 100;

    return {
      basePrice: Math.round(basePrice * 100) / 100,
      gstAmount,
      demandMultiplier: Math.round(demandMultiplier * 100) / 100,
      loyaltyDiscount: Math.round(loyaltyDiscount * 100) / 100,
      regionSurcharge: Math.round(regionSurcharge * 100) / 100,
      urgentFee: Math.round(urgentFee * 100) / 100,
      addOnsTotal: Math.round(addOnsTotal * 100) / 100,
      totalBeforeGst: Math.round(totalBeforeGst * 100) / 100,
      gstOnTotal,
      finalTotal,
      currency: 'AUD',
      gstIncluded: true,
    };
  }

  private isRuleApplicable(rule: PricingRuleEntity, context: PricingContextDto): boolean {
    const conditions = rule.conditions || {};

    // Check region applicability
    if (rule.appliesToRegions.length > 0 && !rule.appliesToRegions.includes(context.regionCode)) {
      return false;
    }

    // Check day-of-week condition
    if (conditions.dayOfWeek && context.date) {
      const date = new Date(context.date);
      const dayName = date.toLocaleDateString('en-AU', { weekday: 'long' }).toLowerCase();
      if (!conditions.dayOfWeek.includes(dayName)) return false;
    }

    // Check time slot condition
    if (conditions.timeSlots && context.time) {
      if (!conditions.timeSlots.includes(context.time)) return false;
    }

    // Check customer tier condition
    if (conditions.tier && context.customerTier) {
      if (conditions.tier !== context.customerTier) return false;
    }

    // Check minimum bookings condition
    if (conditions.minBookings && context.customerBookingsCount !== undefined) {
      if (context.customerBookingsCount < conditions.minBookings) return false;
    }

    // Check urgent condition
    if (conditions.isUrgent && !context.addOns?.['urgent']) {
      return false;
    }

    // Check recurring condition
    if (conditions.isRecurring !== undefined && context.isRecurring !== conditions.isRecurring) {
      return false;
    }

    return true;
  }

  private async getActiveRules(): Promise<PricingRuleEntity[]> {
    if (this.pricingRuleRepository) {
      return this.pricingRuleRepository.find({ where: { isActive: true } });
    }
    return Array.from(this.inMemoryRules.values()).filter((r) => r.isActive);
  }

  async getAllRules(): Promise<PricingRuleEntity[]> {
    return this.getActiveRules();
  }

  async createRule(dto: CreatePricingRuleDto): Promise<PricingRuleEntity> {
    const entity: PricingRuleEntity = this.pricingRuleRepository
      ? this.pricingRuleRepository.create(dto) as unknown as PricingRuleEntity
      : ({
          id: `rule-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          ...dto,
          conditions: dto.conditions || {},
          appliesToRegions: dto.appliesToRegions || [],
          appliesToServices: dto.appliesToServices || [],
          createdAt: new Date(),
          updatedAt: new Date(),
        } as PricingRuleEntity);

    if (entity && this.pricingRuleRepository) {
      await this.pricingRuleRepository.save(entity);
    } else {
      this.inMemoryRules.set(entity.id, entity);
    }

    this.logger.log(`Pricing rule created: ${entity.id}`);
    return entity;
  }

  async removeRule(id: string): Promise<void> {
    if (this.pricingRuleRepository) {
      await this.pricingRuleRepository.delete(id);
    } else {
      this.inMemoryRules.delete(id);
    }
    this.logger.log(`Pricing rule deleted: ${id}`);
  }
}
