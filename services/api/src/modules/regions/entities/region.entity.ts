import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { RegionCode } from '../../../common/types/region.types';

@Entity('regions')
export class RegionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: RegionCode,
    unique: true,
  })
  code: RegionCode;

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
