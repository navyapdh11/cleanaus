import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('payments')
export class PaymentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  bookingId: string;

  @Column({ type: 'uuid' })
  customerId: string;

  @Column({ length: 255 })
  stripePaymentIntentId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ length: 3, default: 'AUD' })
  currency: string;

  @Column({ length: 50, default: 'pending' })
  status: 'pending' | 'completed' | 'failed' | 'refunded';

  @Column({ nullable: true })
  failureReason: string;

  @Column({ nullable: true })
  receiptUrl: string;

  @Column({ nullable: true })
  completedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
