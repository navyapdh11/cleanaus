import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum PricingRuleTypeEnum {
  BASE_RATE = 'base_rate',
  DEMAND_MULTIPLIER = 'demand_multiplier',
  SEASONAL_ADJUSTMENT = 'seasonal_adjustment',
  LOYALTY_DISCOUNT = 'loyalty_discount',
  REGION_SURCHARGE = 'region_surcharge',
  URGENT_BOOKING_FEE = 'urgent_booking_fee',
  BUNDLE_DISCOUNT = 'bundle_discount',
  CUSTOM_TIER_PRICING = 'custom_tier_pricing',
}

@Entity('pricing_rules')
export class PricingRuleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: PricingRuleTypeEnum,
  })
  type: PricingRuleTypeEnum;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 4, name: 'multiplier' })
  multiplier: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'fixed_amount', nullable: true })
  fixedAmount: number | null;

  @Column({ type: 'jsonb', name: 'conditions', default: {} })
  conditions: Record<string, any>;

  @Column({ name: 'applies_to_regions', type: 'jsonb', default: [] })
  appliesToRegions: string[];

  @Column({ name: 'applies_to_services', type: 'jsonb', default: [] })
  appliesToServices: string[];

  @Column({ name: 'valid_from', type: 'timestamp', nullable: true })
  validFrom: Date | null;

  @Column({ name: 'valid_until', type: 'timestamp', nullable: true })
  validUntil: Date | null;

  @Column({ default: true })
  isActive: boolean;

  @Column({ name: 'priority', default: 0 })
  priority: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
