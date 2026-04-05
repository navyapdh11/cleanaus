import { IsString, IsNumber, IsOptional, IsObject, IsBoolean, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PricingRuleTypeEnum } from '../entities/pricing-rule.entity';

export class PricingContextDto {
  @ApiProperty({ example: 'svc-regular-house' })
  @IsString()
  serviceId: string;

  @ApiProperty({ example: 'NSW' })
  @IsString()
  regionCode: string;

  @ApiPropertyOptional({ example: '2026-04-10' })
  @IsOptional()
  @IsString()
  date?: string;

  @ApiPropertyOptional({ example: '09:00' })
  @IsOptional()
  @IsString()
  time?: string;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @IsNumber()
  bedrooms?: number;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @IsNumber()
  bathrooms?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;

  @ApiPropertyOptional({ example: 'gold' })
  @IsOptional()
  @IsString()
  customerTier?: string;

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @IsNumber()
  customerBookingsCount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  addOns?: Record<string, any>;
}

export class PriceBreakdownDto {
  @ApiProperty({ example: 120 })
  basePrice: number;

  @ApiProperty({ example: 12 })
  gstAmount: number;

  @ApiProperty({ example: 1.1 })
  demandMultiplier: number;

  @ApiProperty({ example: 0.95 })
  loyaltyDiscount: number;

  @ApiProperty({ example: 15 })
  regionSurcharge: number;

  @ApiProperty({ example: 0 })
  urgentFee: number;

  @ApiProperty({ example: 10 })
  addOnsTotal: number;

  @ApiProperty({ example: 147 })
  totalBeforeGst: number;

  @ApiProperty({ example: 14.7 })
  gstOnTotal: number;

  @ApiProperty({ example: 161.7 })
  finalTotal: number;

  @ApiProperty({ example: 'AUD' })
  currency: string;

  @ApiProperty({ example: true })
  gstIncluded: boolean;
}

export class CreatePricingRuleDto {
  @ApiProperty({
    enum: PricingRuleTypeEnum,
  })
  @IsEnum(PricingRuleTypeEnum)
  type: PricingRuleTypeEnum;

  @ApiProperty({ example: 'Weekend surcharge' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Additional charge for weekend bookings' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 1.2 })
  @IsNumber()
  multiplier: number;

  @ApiPropertyOptional({ example: 25 })
  @IsOptional()
  @IsNumber()
  fixedAmount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  conditions?: Record<string, any>;

  @ApiPropertyOptional({ example: ['NSW', 'VIC'] })
  @IsOptional()
  @IsString({ each: true })
  appliesToRegions?: string[];

  @ApiPropertyOptional({ example: ['svc-regular-house'] })
  @IsOptional()
  @IsString({ each: true })
  appliesToServices?: string[];

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  priority?: number;
}
