import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum BookingStatusEnum {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export enum BookingPriorityEnum {
  LOW = 'low',
  STANDARD = 'standard',
  HIGH = 'high',
  URGENT = 'urgent',
}

@Entity('bookings')
export class BookingEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'customer_id' })
  customerId: string;

  @Column({ name: 'service_id', nullable: true })
  serviceId: string | null;

  @Column({ name: 'staff_id', nullable: true })
  staffId: string | null;

  @Column({ type: 'jsonb', name: 'service_details' })
  serviceDetails: Record<string, any>;

  @Column({
    type: 'enum',
    enum: BookingStatusEnum,
    default: BookingStatusEnum.PENDING,
  })
  status: BookingStatusEnum;

  @Column({
    type: 'enum',
    enum: BookingPriorityEnum,
    default: BookingPriorityEnum.STANDARD,
  })
  priority: BookingPriorityEnum;

  @Column({ type: 'timestamp', name: 'scheduled_date' })
  scheduledDate: Date;

  @Column({ name: 'start_time' })
  startTime: string;

  @Column({ name: 'end_time', nullable: true })
  endTime: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ type: 'jsonb', name: 'property_details' })
  propertyDetails: Record<string, any>;

  @Column({ type: 'jsonb', name: 'customer_preferences', nullable: true })
  customerPreferences: Record<string, any> | null;

  @Column({ type: 'text', nullable: true })
  specialInstructions: string | null;

  @Column({ type: 'jsonb', name: 'region_info' })
  regionInfo: Record<string, any>;

  @Column({ name: 'payment_intent_id', nullable: true })
  paymentIntentId: string | null;

  @Column({ name: 'completed_at', nullable: true })
  completedAt: Date | null;

  @Column({ name: 'cancelled_at', nullable: true })
  cancelledAt: Date | null;

  @Column({ name: 'cancellation_reason', nullable: true })
  cancellationReason: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
