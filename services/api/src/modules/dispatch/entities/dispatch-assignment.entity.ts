import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum DispatchStatusEnum {
  PENDING = 'pending',
  ASSIGNED = 'assigned',
  EN_ROUTE = 'en_route',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('dispatch_assignments')
export class DispatchAssignmentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'booking_id' })
  bookingId: string;

  @Column({ name: 'staff_id' })
  staffId: string;

  @Column({ name: 'team_lead_id', nullable: true })
  teamLeadId: string | null;

  @Column({ name: 'additional_staff_ids', type: 'jsonb', default: [] })
  additionalStaffIds: string[];

  @Column({
    type: 'enum',
    enum: DispatchStatusEnum,
    default: DispatchStatusEnum.PENDING,
  })
  status: DispatchStatusEnum;

  @Column({ type: 'timestamp', name: 'assigned_at', nullable: true })
  assignedAt: Date | null;

  @Column({ type: 'timestamp', name: 'en_route_at', nullable: true })
  enRouteAt: Date | null;

  @Column({ type: 'timestamp', name: 'started_at', nullable: true })
  startedAt: Date | null;

  @Column({ type: 'timestamp', name: 'completed_at', nullable: true })
  completedAt: Date | null;

  @Column({ type: 'decimal', precision: 5, scale: 2, name: 'confidence_score', default: 0 })
  confidenceScore: number;

  @Column({ type: 'jsonb', name: 'assignment_reason', default: {} })
  assignmentReason: Record<string, any>;

  @Column({ type: 'decimal', precision: 8, scale: 2, name: 'estimated_travel_time_min', nullable: true })
  estimatedTravelTimeMin: number | null;

  @Column({ type: 'decimal', precision: 8, scale: 2, name: 'estimated_duration_min', nullable: true })
  estimatedDurationMin: number | null;

  @Column({ type: 'jsonb', name: 'route_info', nullable: true })
  routeInfo: Record<string, any> | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
