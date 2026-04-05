import { IsString, IsEnum, IsNumber, IsOptional, IsBoolean, IsArray, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StaffStatusEnum, StaffRoleEnum } from '../entities/staff.entity';

export class CreateStaffDto {
  @ApiProperty({ example: 'Jane' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Smith' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'jane.smith@cleanaus.com.au' })
  @IsString()
  email: string;

  @ApiPropertyOptional({ example: '+61412345678' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ enum: StaffRoleEnum, default: StaffRoleEnum.CLEANER })
  @IsEnum(StaffRoleEnum)
  role: StaffRoleEnum;

  @ApiPropertyOptional({ example: ['carpet_cleaning', 'window_cleaning'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @ApiPropertyOptional({ example: ['NSW', 'VIC'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  assignedRegions?: string[];

  @ApiPropertyOptional({ example: 6 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  maxDailyBookings?: number;

  @ApiPropertyOptional({ example: 'Experienced residential cleaner with 5+ years' })
  @IsOptional()
  @IsString()
  bio?: string;
}

export class UpdateStaffDto {
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

  @ApiPropertyOptional({ enum: StaffRoleEnum })
  @IsOptional()
  @IsEnum(StaffRoleEnum)
  role?: StaffRoleEnum;

  @ApiPropertyOptional({ enum: StaffStatusEnum })
  @IsOptional()
  @IsEnum(StaffStatusEnum)
  status?: StaffStatusEnum;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  assignedRegions?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(1)
  maxDailyBookings?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  policeCheckVerified?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  insuranceVerified?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  profilePhotoUrl?: string;
}
