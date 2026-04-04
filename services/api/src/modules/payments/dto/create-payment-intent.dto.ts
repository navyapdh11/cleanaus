import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNumber, IsBoolean, IsOptional, Min } from 'class-validator';

export class CreatePaymentIntentRequest {
  @ApiProperty({ description: 'Booking ID' })
  @IsUUID()
  bookingId: string;

  @ApiProperty({ description: 'Amount in AUD' })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ description: 'Payment method', enum: ['card', 'bank_transfer', 'direct_debit'], required: false })
  @IsOptional()
  paymentMethod?: string;

  @ApiProperty({ description: 'Save card for future payments', default: false })
  @IsOptional()
  @IsBoolean()
  saveCard?: boolean;
}
