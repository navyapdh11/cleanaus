import { IsString, IsEnum, IsNumber, IsOptional, IsBoolean, IsObject, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CustomerTierEnum, CustomerStatusEnum } from '../entities/customer.entity';

export class CreateCustomerDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsString()
  email: string;

  @ApiPropertyOptional({ example: '+61412345678' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'user-auth-uuid' })
  @IsOptional()
  @IsString()
  userId?: string;
}

export class UpdateCustomerDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ enum: CustomerStatusEnum })
  @IsOptional()
  @IsEnum(CustomerStatusEnum)
  status?: CustomerStatusEnum;

  @ApiPropertyOptional({ enum: CustomerTierEnum })
  @IsOptional()
  @IsEnum(CustomerTierEnum)
  tier?: CustomerTierEnum;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  defaultAddress?: Record<string, any>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  preferences?: Record<string, any>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  communicationPreferences?: Record<string, any>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class AddLoyaltyPointsDto {
  @ApiProperty({ example: 100 })
  @IsNumber()
  @Min(1)
  points: number;

  @ApiProperty({ example: 'Booking completed' })
  @IsString()
  reason: string;
}
