import { IsString, IsEnum, IsOptional, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NotificationChannelEnum, NotificationTypeEnum } from '../entities/notification.entity';

export class SendNotificationDto {
  @ApiProperty({ example: 'cust-uuid' })
  @IsString()
  customerId: string;

  @ApiProperty({ enum: NotificationChannelEnum })
  @IsEnum(NotificationChannelEnum)
  channel: NotificationChannelEnum;

  @ApiProperty({ enum: NotificationTypeEnum })
  @IsEnum(NotificationTypeEnum)
  type: NotificationTypeEnum;

  @ApiProperty({ example: 'Your booking is confirmed!' })
  @IsString()
  subject: string;

  @ApiProperty({ example: 'Hi John, your cleaning is booked for April 10 at 9:00 AM.' })
  @IsString()
  body: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  templateData?: Record<string, any>;

  @ApiPropertyOptional({ example: 'booking-uuid' })
  @IsOptional()
  @IsString()
  bookingId?: string;

  @ApiPropertyOptional({ example: 'payment-uuid' })
  @IsOptional()
  @IsString()
  paymentId?: string;
}

export class NotificationStatsDto {
  total: number;
  pending: number;
  sent: number;
  delivered: number;
  failed: number;
  bounced: number;
  byChannel: Record<string, number>;
  byType: Record<string, number>;
}
