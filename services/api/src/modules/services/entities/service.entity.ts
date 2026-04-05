import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ServiceCategoryEnum {
  RESIDENTIAL = 'residential',
  COMMERCIAL = 'commercial',
  SPECIALIZED = 'specialized',
  ADD_ON = 'add_on',
}

export enum ServiceTypeEnum {
  // Residential
  REGULAR_CLEANING = 'regular_cleaning',
  DEEP_CLEANING = 'deep_cleaning',
  END_OF_LEASE_CLEANING = 'end_of_lease_cleaning',
  POST_CONSTRUCTION_CLEANING = 'post_construction_cleaning',
  CARPET_CLEANING = 'carpet_cleaning',
  WINDOW_CLEANING = 'window_cleaning',
  PRESSURE_WASHING = 'pressure_washing',

  // Commercial
  OFFICE_CLEANING = 'office_cleaning',
  SHOPPING_CENTER_CLEANING = 'shopping_center_cleaning',
  MEDICAL_FACILITY_CLEANING = 'medical_facility_cleaning',
  INDUSTRIAL_CLEANING = 'industrial_cleaning',
  BUILDING_MAINTENANCE = 'building_maintenance',
  FLOOR_CARE = 'floor_care',

  // Specialized
  AIRBNB_TURNOVER = 'airbnb_turnover',
  BOND_CLEANING = 'bond_cleaning',
  MOVE_IN_OUT_CLEANING = 'move_in_out_cleaning',
  ECO_FRIENDLY_CLEANING = 'eco_friendly_cleaning',
  AFTER_PARTY_CLEANING = 'after_party_cleaning',

  // Add-ons
  UPHOLSTERY_CLEANING = 'upholstery_cleaning',
  TILE_GROUT_CLEANING = 'tile_grout_cleaning',
  GUTTER_CLEANING = 'gutter_cleaning',
  SOFA_MATTRESS_CLEANING = 'sofa_mattress_cleaning',
  OVEN_CLEANING = 'oven_cleaning',
  BLIND_CLEANING = 'blind_cleaning',
}

@Entity('services')
export class ServiceEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ServiceTypeEnum,
    unique: true,
  })
  type: ServiceTypeEnum;

  @Column({
    type: 'enum',
    enum: ServiceCategoryEnum,
  })
  category: ServiceCategoryEnum;

  @Column({ length: 150 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'base_price' })
  basePrice: number;

  @Column({ name: 'price_per_hour', type: 'decimal', precision: 10, scale: 2, nullable: true })
  pricePerHour: number | null;

  @Column({ name: 'estimated_duration_hours', type: 'decimal', precision: 5, scale: 2 })
  estimatedDurationHours: number;

  @Column({ type: 'jsonb', name: 'included_tasks', default: [] })
  includedTasks: string[];

  @Column({ type: 'jsonb', name: 'available_regions', default: [] })
  availableRegions: string[];

  @Column({ type: 'jsonb', name: 'add_on_service_ids', default: [] })
  addOnServiceIds: string[];

  @Column({ default: true })
  isActive: boolean;

  @Column({ name: 'eco_friendly', default: false })
  ecoFriendly: boolean;

  @Column({ name: 'requires_special_equipment', default: false })
  requiresSpecialEquipment: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
