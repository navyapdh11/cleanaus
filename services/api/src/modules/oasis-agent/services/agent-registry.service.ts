import { Injectable, Logger } from '@nestjs/common';

export interface AgentInfo {
  name: string;
  status: 'ACTIVE' | 'BUSY' | 'ERROR';
  lastSeen: Date;
  capabilities: string[];
}

@Injectable()
export class AgentRegistryService {
  private readonly logger = new Logger(AgentRegistryService.name);
  private agents = new Map<string, AgentInfo>();

  registerAgents(agentNames: string[]): void {
    agentNames.forEach(name => {
      this.agents.set(name, {
        name,
        status: 'ACTIVE',
        lastSeen: new Date(),
        capabilities: [],
      });
    });
    this.logger.log(`Registered ${agentNames.length} agents`);
  }

  updateAgentStatus(name: string, status: AgentInfo['status']): void {
    const agent = this.agents.get(name);
    if (agent) {
      agent.status = status;
      agent.lastSeen = new Date();
      this.agents.set(name, agent);
    }
  }

  getAgent(name: string): AgentInfo | undefined {
    return this.agents.get(name);
  }

  getAllAgents(): AgentInfo[] {
    return Array.from(this.agents.values());
  }

  getActiveAgents(): AgentInfo[] {
    return Array.from(this.agents.values()).filter(a => a.status === 'ACTIVE');
  }
}
