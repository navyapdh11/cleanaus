import { IsString, IsOptional, IsNumber, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AssignStaffDto {
  @ApiProperty({ example: 'booking-uuid' })
  @IsString()
  bookingId: string;

  @ApiProperty({ example: 'staff-001' })
  @IsString()
  staffId: string;

  @ApiPropertyOptional({ example: 'staff-004' })
  @IsOptional()
  @IsString()
  teamLeadId?: string;

  @ApiPropertyOptional({ example: ['staff-002', 'staff-003'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  additionalStaffIds?: string[];

  @ApiPropertyOptional({ example: 60 })
  @IsOptional()
  @IsNumber()
  estimatedTravelTimeMin?: number;

  @ApiPropertyOptional({ example: 180 })
  @IsOptional()
  @IsNumber()
  estimatedDurationMin?: number;
}

export class DispatchRecommendationDto {
  staffId: string;
  score: number;
  reasons: string[];
  available: boolean;
  distance: number;
  qualityScore: number;
  skillsMatch: boolean;
  currentLoad: number;
  maxLoad: number;
}
