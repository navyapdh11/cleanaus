import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum CustomerTierEnum {
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
  PLATINUM = 'platinum',
}

export enum CustomerStatusEnum {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

@Entity('customers')
export class CustomerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', nullable: true, unique: true })
  userId: string | null;

  @Column({ length: 100 })
  firstName: string;

  @Column({ length: 100 })
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string | null;

  @Column({
    type: 'enum',
    enum: CustomerStatusEnum,
    default: CustomerStatusEnum.ACTIVE,
  })
  status: CustomerStatusEnum;

  @Column({
    type: 'enum',
    enum: CustomerTierEnum,
    default: CustomerTierEnum.BRONZE,
  })
  tier: CustomerTierEnum;

  @Column({ name: 'total_bookings', default: 0 })
  totalBookings: number;

  @Column({ name: 'completed_bookings', default: 0 })
  completedBookings: number;

  @Column({ name: 'cancelled_bookings', default: 0 })
  cancelledBookings: number;

  @Column({ name: 'total_spent', type: 'decimal', precision: 12, scale: 2, default: 0 })
  totalSpent: number;

  @Column({ name: 'loyalty_points', default: 0 })
  loyaltyPoints: number;

  @Column({ type: 'jsonb', name: 'default_address', nullable: true })
  defaultAddress: Record<string, any> | null;

  @Column({ type: 'jsonb', name: 'preferences', default: {} })
  preferences: Record<string, any>;

  @Column({ type: 'jsonb', name: 'communication_preferences', default: { email: true, sms: false, push: false } })
  communicationPreferences: Record<string, any>;

  @Column({ name: 'referral_code', type: 'varchar', length: 20, nullable: true, unique: true })
  referralCode: string | null;

  @Column({ name: 'referred_by', nullable: true })
  referredBy: string | null;

  @Column({ name: 'last_booking_at', type: 'timestamp', nullable: true })
  lastBookingAt: Date | null;

  @Column({ name: 'churn_risk_score', type: 'decimal', precision: 3, scale: 2, default: 0 })
  churnRiskScore: number;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
