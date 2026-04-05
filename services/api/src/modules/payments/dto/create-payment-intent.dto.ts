import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNumber, IsBoolean, IsOptional, IsString, Min } from 'class-validator';

export class CreatePaymentIntentRequest {
  @ApiProperty({ description: 'Booking ID' })
  @IsUUID()
  bookingId: string;

  @ApiProperty({ description: 'Amount in AUD' })
  @IsNumber()
  @Min(1) // Minimum $0.01
  amount: number;

  @ApiProperty({ description: 'Payment method', enum: ['card', 'bank_transfer', 'direct_debit'], required: false })
  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @ApiProperty({ description: 'Save card for future payments', default: false })
  @IsOptional()
  @IsBoolean()
  saveCard?: boolean;
}
