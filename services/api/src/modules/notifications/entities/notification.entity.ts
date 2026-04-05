import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum NotificationChannelEnum {
  EMAIL = 'email',
  SMS = 'sms',
  PUSH = 'push',
  IN_APP = 'in_app',
}

export enum NotificationTypeEnum {
  BOOKING_CONFIRMATION = 'booking_confirmation',
  BOOKING_REMINDER = 'booking_reminder',
  BOOKING_CANCELLED = 'booking_cancelled',
  BOOKING_COMPLETED = 'booking_completed',
  PAYMENT_RECEIVED = 'payment_received',
  PAYMENT_FAILED = 'payment_failed',
  STAFF_ASSIGNED = 'staff_assigned',
  STAFF_EN_ROUTE = 'staff_en_route',
  REVIEW_REQUEST = 'review_request',
  LOYALTY_REWARD = 'loyalty_reward',
  PROMOTIONAL = 'promotional',
  SYSTEM_ALERT = 'system_alert',
}

export enum NotificationStatusEnum {
  PENDING = 'pending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  FAILED = 'failed',
  BOUNCED = 'bounced',
}

@Entity('notifications')
export class NotificationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'customer_id' })
  customerId: string;

  @Column({
    type: 'enum',
    enum: NotificationChannelEnum,
  })
  channel: NotificationChannelEnum;

  @Column({
    type: 'enum',
    enum: NotificationTypeEnum,
  })
  type: NotificationTypeEnum;

  @Column({
    type: 'enum',
    enum: NotificationStatusEnum,
    default: NotificationStatusEnum.PENDING,
  })
  status: NotificationStatusEnum;

  @Column({ length: 200 })
  subject: string;

  @Column({ type: 'text' })
  body: string;

  @Column({ type: 'jsonb', name: 'template_data', nullable: true })
  templateData: Record<string, any> | null;

  @Column({ name: 'sent_at', type: 'timestamp', nullable: true })
  sentAt: Date | null;

  @Column({ name: 'delivered_at', type: 'timestamp', nullable: true })
  deliveredAt: Date | null;

  @Column({ name: 'error_message', type: 'text', nullable: true })
  errorMessage: string | null;

  @Column({ name: 'retry_count', default: 0 })
  retryCount: number;

  @Column({ name: 'max_retries', default: 3 })
  maxRetries: number;

  @Column({ name: 'external_id', nullable: true })
  externalId: string | null; // e.g. SendGrid message ID, Twilio SID

  @Column({ name: 'booking_id', nullable: true })
  bookingId: string | null;

  @Column({ name: 'payment_id', nullable: true })
  paymentId: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
