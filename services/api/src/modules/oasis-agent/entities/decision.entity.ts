import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('decisions')
export class DecisionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  taskId: string;

  @Column({ length: 100 })
  agentName: string;

  @Column({ length: 100 })
  action: string;

  @Column({ type: 'float' })
  confidence: number;

  @Column({ type: 'text', array: true })
  reasoning: string[];

  @Column({ type: 'jsonb', nullable: true })
  alternatives: any[];

  @Column({ type: 'jsonb', nullable: true })
  outcome: any;

  @CreateDateColumn()
  timestamp: Date;
}
