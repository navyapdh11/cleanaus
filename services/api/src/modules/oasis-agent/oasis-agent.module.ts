import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { CacheModule } from '@nestjs/cache-manager';
import { ScheduleModule } from '@nestjs/schedule';
// TypeORM disabled for demo mode
import { OpenTelemetryService } from '../../common/services/opentelemetry.service';

// OASIS Agents
import {
  SchedulingAgent,
  PricingAgent,
  DispatchAgent,
  SupportAgent,
  QualityAgent,
} from './agents';

// Services
import { OasisOrchestratorService } from './services/orchestrator.service';
import { AgentRegistryService } from './services/agent-registry.service';
import { MessageBusService } from './services/message-bus.service';

// Entities
import { AgentLogEntity } from './entities/agent-log.entity';
import { DecisionEntity } from './entities/decision.entity';

// Queues
export const OasisQueues = {
  SCHEDULING: 'oasis-scheduling',
  PRICING: 'oasis-pricing',
  DISPATCH: 'oasis-dispatch',
  SUPPORT: 'oasis-support',
  QUALITY: 'oasis-quality',
  ORCHESTRATOR: 'oasis-orchestrator',
} as const;

export type OasisQueueNames = typeof OasisQueues[keyof typeof OasisQueues];

@Module({
  imports: [
    // TypeORM disabled
    ScheduleModule.forRoot(),
    
    // BullMQ queues disabled (Redis not available)
    // BullModule.registerQueue(
    //   { name: OasisQueues.SCHEDULING },
    //   { name: OasisQueues.PRICING },
    //   { name: OasisQueues.DISPATCH },
    //   { name: OasisQueues.SUPPORT },
    //   { name: OasisQueues.QUALITY },
    //   { name: OasisQueues.ORCHESTRATOR },
    // ),

    CacheModule.register(),
  ],
  providers: [
    // AI Agents
    SchedulingAgent,
    PricingAgent,
    DispatchAgent,
    SupportAgent,
    QualityAgent,
    
    // Core services
    OasisOrchestratorService,
    AgentRegistryService,
    MessageBusService,
    OpenTelemetryService,
  ],
  exports: [
    OasisOrchestratorService,
    AgentRegistryService,
    MessageBusService,
  ],
})
export class OasisAgentModule {}
