import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum RegionCodeEnum {
  NSW = 'NSW',
  VIC = 'VIC',
  QLD = 'QLD',
  WA = 'WA',
  SA = 'SA',
  TAS = 'TAS',
  ACT = 'ACT',
  NT = 'NT',
}

@Entity('regions')
export class RegionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: RegionCodeEnum,
    unique: true,
  })
  code: RegionCodeEnum;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 50 })
  timezone: string;

  @Column({ type: 'decimal', precision: 5, scale: 4 })
  gstRate: number;

  @Column({ type: 'jsonb' })
  serviceAreas: any[];

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
