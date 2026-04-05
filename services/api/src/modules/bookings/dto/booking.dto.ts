import { IsString, IsEnum, IsNumber, IsBoolean, IsOptional, IsDateString, IsObject, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BookingPriorityEnum } from '../entities/booking.entity';

export class PropertyDetailsDto {
  @ApiProperty({ example: 'house' })
  @IsString()
  propertyType: string;

  @ApiProperty({ example: 3 })
  @IsNumber()
  bedrooms: number;

  @ApiProperty({ example: 2 })
  @IsNumber()
  bathrooms: number;

  @ApiPropertyOptional({ example: 150 })
  @IsOptional()
  @IsNumber()
  squareMeters?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  hasPets?: boolean;
}

export class CustomerPreferencesDto {
  @ApiPropertyOptional({ example: ['kitchen', 'bathroom'] })
  @IsOptional()
  @IsString({ each: true })
  focusAreas?: string[];

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  ecoFriendly?: boolean;

  @ApiPropertyOptional({ example: 'No strong chemical smells' })
  @IsOptional()
  @IsString()
  allergies?: string;
}

export class RegionInfoDto {
  @ApiProperty({ example: 'NSW' })
  @IsString()
  regionCode: string;

  @ApiProperty({ example: 'Sydney CBD' })
  @IsString()
  serviceArea: string;

  @ApiProperty({ example: '2000' })
  @IsString()
  postcode: string;
}

export class CreateBookingDto {
  @ApiProperty({ example: 'cust-uuid' })
  @IsString()
  customerId: string;

  @ApiPropertyOptional({ example: 'service-uuid' })
  @IsOptional()
  @IsString()
  serviceId?: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => PropertyDetailsDto)
  propertyDetails: PropertyDetailsDto;

  @ApiProperty({ example: '2026-04-10' })
  @IsDateString()
  scheduledDate: string;

  @ApiProperty({ example: '09:00' })
  @IsString()
  startTime: string;

  @ApiPropertyOptional({ enum: BookingPriorityEnum, default: BookingPriorityEnum.STANDARD })
  @IsOptional()
  @IsEnum(BookingPriorityEnum)
  priority?: BookingPriorityEnum;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => CustomerPreferencesDto)
  preferences?: CustomerPreferencesDto;

  @ApiPropertyOptional({ example: 'Please focus on the kitchen and living room' })
  @IsOptional()
  @IsString()
  specialInstructions?: string;

  @ValidateNested()
  @Type(() => RegionInfoDto)
  regionInfo: RegionInfoDto;
}

export class UpdateBookingDto {
  @ApiPropertyOptional({ example: '2026-04-11' })
  @IsOptional()
  @IsDateString()
  scheduledDate?: string;

  @ApiPropertyOptional({ example: '10:00' })
  @IsOptional()
  @IsString()
  startTime?: string;

  @ApiPropertyOptional({ enum: BookingPriorityEnum })
  @IsOptional()
  @IsEnum(BookingPriorityEnum)
  priority?: BookingPriorityEnum;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  propertyDetails?: Record<string, any>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  customerPreferences?: Record<string, any>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  specialInstructions?: string;
}

export class CancelBookingDto {
  @ApiProperty({ example: 'Customer requested cancellation' })
  @IsString()
  reason: string;
}
