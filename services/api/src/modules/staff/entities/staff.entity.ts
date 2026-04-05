import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum StaffStatusEnum {
  ACTIVE = 'active',
  ON_LEAVE = 'on_leave',
  INACTIVE = 'inactive',
  TRAINING = 'training',
}

export enum StaffRoleEnum {
  CLEANER = 'cleaner',
  TEAM_LEAD = 'team_lead',
  SUPERVISOR = 'supervisor',
  MANAGER = 'manager',
}

@Entity('staff')
export class StaffEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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
    enum: StaffRoleEnum,
    default: StaffRoleEnum.CLEANER,
  })
  role: StaffRoleEnum;

  @Column({
    type: 'enum',
    enum: StaffStatusEnum,
    default: StaffStatusEnum.ACTIVE,
  })
  status: StaffStatusEnum;

  @Column({ type: 'jsonb', default: [] })
  skills: string[];

  @Column({ name: 'assigned_regions', type: 'jsonb', default: [] })
  assignedRegions: string[];

  @Column({ name: 'max_daily_bookings', default: 6 })
  maxDailyBookings: number;

  @Column({ name: 'current_daily_bookings', default: 0 })
  currentDailyBookings: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, name: 'quality_score', default: 5.0 })
  qualityScore: number;

  @Column({ name: 'total_bookings_completed', default: 0 })
  totalBookingsCompleted: number;

  @Column({ name: 'police_check_verified', default: false })
  policeCheckVerified: boolean;

  @Column({ name: 'police_check_expiry', type: 'timestamp', nullable: true })
  policeCheckExpiry: Date | null;

  @Column({ name: 'insurance_verified', default: false })
  insuranceVerified: boolean;

  @Column({ type: 'jsonb', name: 'availability', default: {} })
  availability: Record<string, any>;

  @Column({ type: 'text', nullable: true })
  bio: string | null;

  @Column({ name: 'profile_photo_url', nullable: true })
  profilePhotoUrl: string | null;

  @Column({ name: 'emergency_contact', type: 'jsonb', nullable: true })
  emergencyContact: Record<string, any> | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
