import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

export interface AgentMessage {
  id: string;
  from: string;
  to: string | string[];
  type: 'REQUEST' | 'RESPONSE' | 'EVENT' | 'BROADCAST';
  payload: any;
  timestamp: Date;
  correlationId?: string;
}

/**
 * Message Bus Service for inter-agent communication
 * Implements publish/subscribe pattern for agent coordination
 */
@Injectable()
export class MessageBusService {
  private readonly logger = new Logger(MessageBusService.name);
  private messageHistory: AgentMessage[] = [];
  private maxHistorySize = 1000;

  constructor(private eventEmitter: EventEmitter2) {}

  /**
   * Publish a message to the bus
   */
  async publish(message: AgentMessage): Promise<void> {
    this.messageHistory.push(message);
    
    // Trim history if needed
    if (this.messageHistory.length > this.maxHistorySize) {
      this.messageHistory = this.messageHistory.slice(-this.maxHistorySize);
    }

    // Emit event for subscribers
    this.eventEmitter.emit(`agent.message.${message.type}`, message);
    
    if (message.to) {
      const targets = Array.isArray(message.to) ? message.to : [message.to];
      targets.forEach(target => {
        this.eventEmitter.emit(`agent.message.to.${target}`, message);
      });
    }

    this.logger.debug(`Message published: ${message.type} from ${message.from}`);
  }

  /**
   * Broadcast message to all agents
   */
  async broadcast(from: string, type: string, payload: any): Promise<void> {
    await this.publish({
      id: `msg-${Date.now()}-${Math.random()}`,
      from,
      to: 'ALL',
      type: 'BROADCAST',
      payload: { type, ...payload },
      timestamp: new Date(),
    });
  }

  /**
   * Send direct message to specific agent
   */
  async sendDirect(from: string, to: string, payload: any): Promise<void> {
    await this.publish({
      id: `msg-${Date.now()}-${Math.random()}`,
      from,
      to,
      type: 'REQUEST',
      payload,
      timestamp: new Date(),
    });
  }

  /**
   * Get message history
   */
  getMessageHistory(limit = 50): AgentMessage[] {
    return this.messageHistory.slice(-limit);
  }

  /**
   * Get messages by correlation ID
   */
  getMessagesByCorrelationId(correlationId: string): AgentMessage[] {
    return this.messageHistory.filter(m => m.correlationId === correlationId);
  }
}
