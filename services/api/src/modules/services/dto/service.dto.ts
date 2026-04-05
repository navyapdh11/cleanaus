import { IsString, IsEnum, IsNumber, IsOptional, IsBoolean, IsArray, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ServiceCategoryEnum, ServiceTypeEnum } from '../entities/service.entity';

export class CreateServiceDto {
  @ApiProperty({ enum: ServiceTypeEnum })
  @IsEnum(ServiceTypeEnum)
  type: ServiceTypeEnum;

  @ApiProperty({ enum: ServiceCategoryEnum })
  @IsEnum(ServiceCategoryEnum)
  category: ServiceCategoryEnum;

  @ApiProperty({ example: 'Regular House Cleaning' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Standard weekly or fortnightly house cleaning' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 150 })
  @IsNumber()
  @Min(0)
  basePrice: number;

  @ApiPropertyOptional({ example: 50 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  pricePerHour?: number;

  @ApiProperty({ example: 3.5 })
  @IsNumber()
  @Min(0)
  estimatedDurationHours: number;

  @ApiPropertyOptional({ example: ['Dusting', 'Vacuuming', 'Mopping'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  includedTasks?: string[];

  @ApiPropertyOptional({ example: ['NSW', 'VIC', 'QLD'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  availableRegions?: string[];

  @ApiPropertyOptional({ example: ['addon-uuid-1', 'addon-uuid-2'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  addOnServiceIds?: string[];

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  ecoFriendly?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  requiresSpecialEquipment?: boolean;
}

export class UpdateServiceDto {
  @ApiPropertyOptional({ example: 'Updated service name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 175 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  basePrice?: number;

  @ApiPropertyOptional({ example: 55 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  pricePerHour?: number;

  @ApiPropertyOptional({ example: 4 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  estimatedDurationHours?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  includedTasks?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  availableRegions?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  addOnServiceIds?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  ecoFriendly?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  requiresSpecialEquipment?: boolean;
}
