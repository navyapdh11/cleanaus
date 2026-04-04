import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('agent_logs')
export class AgentLogEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  agentName: string;

  @Column({ length: 50 })
  action: string;

  @Column({ type: 'text' })
  details: string;

  @Column({ type: 'float', nullable: true })
  confidence: number;

  @Column({ length: 50 })
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @CreateDateColumn()
  timestamp: Date;
}
