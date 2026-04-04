import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { CacheModule } from '@nestjs/cache-manager';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

// OASIS Agents
import { SchedulingAgent } from './agents/scheduling.agent';
import { PricingAgent } from './agents/pricing.agent';
import { DispatchAgent } from './agents/dispatch.agent';
import { SupportAgent } from './agents/support.agent';
import { QualityAgent } from './agents/quality.agent';

// Services
import { OasisOrchestratorService } from './services/orchestrator.service';
import { AgentRegistryService } from './services/agent-registry.service';
import { MessageBusService } from './services/message-bus.service';

// Entities
import { AgentLogEntity } from './entities/agent-log.entity';
import { DecisionEntity } from './entities/decision.entity';

// Queues
export enum OasisQueues {
  SCHEDULING = 'oasis-scheduling',
  PRICING = 'oasis-pricing',
  DISPATCH = 'oasis-dispatch',
  SUPPORT = 'oasis-support',
  QUALITY = 'oasis-quality',
  ORCHESTRATOR = 'oasis-orchestrator',
}

@Module({
  imports: [
    TypeOrmModule.forFeature([AgentLogEntity, DecisionEntity]),
    ScheduleModule.forRoot(),
    
    // BullMQ queues for each agent
    BullModule.registerQueue(
      { name: OasisQueues.SCHEDULING },
      { name: OasisQueues.PRICING },
      { name: OasisQueues.DISPATCH },
      { name: OasisQueues.SUPPORT },
      { name: OasisQueues.QUALITY },
      { name: OasisQueues.ORCHESTRATOR },
    ),

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
  ],
  exports: [
    OasisOrchestratorService,
    AgentRegistryService,
    MessageBusService,
    BullModule,
  ],
})
export class OasisAgentModule {}
