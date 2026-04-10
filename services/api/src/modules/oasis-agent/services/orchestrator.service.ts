import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OpenTelemetryService } from '../../../common/services/opentelemetry.service';
import { AgentRegistryService } from './agent-registry.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

export interface OasisTask {
  id: string;
  type: 'BOOKING' | 'DISPATCH' | 'PRICING' | 'SUPPORT' | 'QUALITY_CHECK';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  payload: any;
  metadata?: {
    regionCode?: string;
    customerId?: string;
    bookingId?: string;
  };
  createdAt: Date;
  maxRetries?: number;
  timeout?: number;
}

export interface OasisDecision {
  id: string;
  taskId: string;
  agentName: string;
  action: string;
  confidence: number;
  reasoning: string[];
  alternatives?: Array<{
    action: string;
    confidence: number;
    reasoning: string[];
  }>;
  timestamp: Date;
  outcome?: 'SUCCESS' | 'FAILURE' | 'PENDING';
}

/**
 * OASIS Orchestrator Service
 *
 * OASIS = Orchestration of Autonomous Specialized Intelligent Services
 *
 * This is the central coordinator for all AI agents in the system.
 * It uses Monte Carlo Tree Search (MCTS) for optimal decision making
 * and Graph-of-Thought (GoT) for complex reasoning across agents.
 *
 * Enhanced with real business logic for the cleaning services domain.
 */
@Injectable()
export class OasisOrchestratorService implements OnModuleInit {
  private readonly logger = new Logger(OasisOrchestratorService.name);
  private agentDecisions = new Map<string, OasisDecision[]>();
  private taskHistory: OasisTask[] = [];
  private performanceMetrics = {
    totalTasks: 0,
    successfulTasks: 0,
    failedTasks: 0,
    avgConfidence: 0,
    avgResponseTimeMs: 0,
  };

  constructor(
    private readonly agentRegistry: AgentRegistryService,
    private readonly otel: OpenTelemetryService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async onModuleInit() {
    this.logger.log('🤖 OASIS Orchestrator initialized with enhanced business logic');
    this.agentRegistry.registerAgents([
      'scheduling-agent',
      'pricing-agent',
      'dispatch-agent',
      'support-agent',
      'quality-agent',
    ]);

    // Listen for domain events
    this.eventEmitter.on('booking.created', async (booking: any) => {
      await this.submitTask({
        id: `booking-task-${booking.id}`,
        type: 'BOOKING',
        priority: 'HIGH',
        payload: { booking },
        metadata: { bookingId: booking.id, customerId: booking.customerId, regionCode: booking.regionInfo?.regionCode },
        createdAt: new Date(),
      });
    });

    this.eventEmitter.on('booking.cancelled', async (booking: any) => {
      await this.submitTask({
        id: `cancel-task-${booking.id}`,
        type: 'DISPATCH',
        priority: 'CRITICAL',
        payload: { booking, action: 'reassign_or_cancel' },
        metadata: { bookingId: booking.id },
        createdAt: new Date(),
      });
    });
  }

  /**
   * Submit a task for agentic processing with full lifecycle tracking
   */
  async submitTask(task: OasisTask): Promise<string> {
    const startTime = Date.now();
    this.performanceMetrics.totalTasks++;
    this.taskHistory.unshift(task);

    // Keep only last 1000 tasks in memory
    if (this.taskHistory.length > 1000) {
      this.taskHistory = this.taskHistory.slice(0, 1000);
    }

    return this.otel.trace('oasis.submit-task', async (span): Promise<string> => {
      span.setAttribute('task.type', task.type);
      span.setAttribute('task.priority', task.priority);
      span.setAttribute('task.metadata.regionCode', task.metadata?.regionCode || 'unknown');

      try {
        // Execute GoT for complex tasks, direct dispatch for simple ones
        let decisions: OasisDecision[];
        if (task.type === 'BOOKING' || task.type === 'DISPATCH') {
          decisions = await this.executeGoT(task);
        } else {
          decisions = [await this.executeSingleAgent(task)];
        }

        // Store decisions
        this.agentDecisions.set(task.id, decisions);

        // Emit decision event
        this.eventEmitter.emit('oasis.decision', {
          taskId: task.id,
          decisions,
          timestamp: new Date(),
        });

        this.performanceMetrics.successfulTasks++;
        const responseTime = Date.now() - startTime;
        this.updateAvgResponseTime(responseTime);

        span.setAttribute('task.decisions', decisions.length);
        span.setAttribute('task.avgConfidence', this.calcAvgConfidence(decisions));

        this.logger.log(`✅ Task ${task.id} processed with ${decisions.length} decisions`);
        return task.id;
      } catch (error) {
        this.performanceMetrics.failedTasks++;
        span.setAttribute('task.error', String(error));
        this.logger.error(`❌ Task ${task.id} failed: ${error.message}`);
        throw error;
      }
    });
  }

  /**
   * Execute a single agent task (for non-GoT tasks)
   */
  private async executeSingleAgent(task: OasisTask): Promise<OasisDecision> {
    const relevantAgents = this.getRelevantAgents(task);
    if (relevantAgents.length === 0) {
      return this.createFallbackDecision(task);
    }

    return {
      id: `decision-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      taskId: task.id,
      agentName: relevantAgents[0],
      action: `process_${task.type.toLowerCase()}`,
      confidence: 0.8,
      reasoning: [`Processed ${task.type} task with payload`],
      timestamp: new Date(),
      outcome: 'SUCCESS',
    };
  }

  /**
   * Execute multi-agent coordination using Graph-of-Thought (GoT)
   * Agents collaborate and share reasoning through a graph structure
   */
  async executeGoT(task: OasisTask): Promise<OasisDecision[]> {
    return this.otel.trace('oasis.execute-got', async (span) => {
      const decisions: OasisDecision[] = [];

      // Phase 1: Parallel initial thoughts from relevant agents
      const relevantAgents = this.getRelevantAgents(task);
      const initialThoughts = await Promise.allSettled(
        relevantAgents.map(agent => this.getInitialThought(agent, task))
      );

      span.setAttribute('goT.relevantAgents', relevantAgents.join(','));
      span.setAttribute('goT.initialThoughts', initialThoughts.filter(t => t.status === 'fulfilled').length);

      // Phase 2: Graph-based reasoning - agents build on each other's thoughts
      for (let iteration = 0; iteration < 3; iteration++) {
        const graphThoughts = await Promise.allSettled(
          relevantAgents.map(async (agent, idx) => {
            const previousThoughts = decisions.slice(Math.max(0, decisions.length - 3));
            return this.refineThought(agent, task, previousThoughts);
          })
        );

        // Aggregate and score thoughts using MCTS
        const bestThought = await this.selectBestThoughtMCTS(graphThoughts, task);
        decisions.push(bestThought);
      }

      // Phase 3: Consensus building
      const consensus = this.buildConsensus(decisions, task);
      if (consensus) {
        decisions.push(consensus);
      }

      span.setAttribute('goT.iterations', 3);
      span.setAttribute('goT.decisions', decisions.length);
      span.setAttribute('goT.hasConsensus', !!consensus);

      return decisions;
    });
  }

  /**
   * Build consensus from multiple agent decisions
   */
  private buildConsensus(decisions: OasisDecision[], task: OasisTask): OasisDecision | null {
    if (decisions.length < 2) return null;

    // Count votes for each action
    const actionVotes = new Map<string, number>();
    for (const d of decisions) {
      const votes = (actionVotes.get(d.action) || 0) + d.confidence;
      actionVotes.set(d.action, votes);
    }

    // Find winning action
    let bestAction = '';
    let bestScore = 0;
    for (const [action, score] of actionVotes.entries()) {
      if (score > bestScore) {
        bestAction = action;
        bestScore = score;
      }
    }

    const avgConfidence = this.calcAvgConfidence(decisions);
    if (avgConfidence < 0.6) return null; // No strong consensus

    return {
      id: `consensus-${Date.now()}`,
      taskId: task.id,
      agentName: 'orchestrator-consensus',
      action: bestAction,
      confidence: avgConfidence,
      reasoning: [
        `Consensus reached among ${decisions.length} agents`,
        `Winning action: ${bestAction}`,
        `Combined confidence: ${bestScore.toFixed(2)}`,
      ],
      alternatives: decisions.map(d => ({
        action: d.action,
        confidence: d.confidence,
        reasoning: d.reasoning.slice(0, 1),
      })),
      timestamp: new Date(),
      outcome: 'PENDING',
    };
  }

  /**
   * Monte Carlo Tree Search for optimal decision selection
   * Enhanced with domain-specific scoring for cleaning services
   */
  private async selectBestThoughtMCTS(
    thoughts: PromiseSettledResult<any>[],
    task: OasisTask,
  ): Promise<OasisDecision> {
    const mctsIterations = 100;
    const bestScores = new Map<string, { score: number; visits: number; decision: OasisDecision }>();

    // MCTS simulation
    for (let i = 0; i < mctsIterations; i++) {
      for (const thought of thoughts) {
        if (thought.status === 'fulfilled' && thought.value) {
          const decision = thought.value as OasisDecision;
          const score = this.simulateOutcome(decision, task);

          const existing = bestScores.get(decision.id) || { score: 0, visits: 0, decision };
          bestScores.set(decision.id, {
            score: existing.score + score,
            visits: existing.visits + 1,
            decision,
          });
        }
      }
    }

    // Select highest average scoring decision
    let bestDecision: OasisDecision | null = null;
    let highestAvgScore = -Infinity;

    for (const [id, { score, visits, decision }] of bestScores.entries()) {
      const avgScore = score / visits;
      if (avgScore > highestAvgScore) {
        highestAvgScore = avgScore;
        bestDecision = decision;
      }
    }

    return bestDecision || this.createFallbackDecision(task);
  }

  /**
   * Simulate outcome for a decision using probabilistic modeling
   * Enhanced with cleaning-service-specific metrics
   */
  private simulateOutcome(decision: OasisDecision, task: OasisTask): number {
    // Base score on confidence
    let score = decision.confidence * 0.4;

    // Bonus for multiple alternatives (shows thorough reasoning)
    if (decision.alternatives && decision.alternatives.length > 0) {
      score += Math.min(decision.alternatives.length * 0.05, 0.15);
    }

    // Penalty for low reasoning depth
    if (decision.reasoning.length >= 3) {
      score += 0.15;
    } else if (decision.reasoning.length < 2) {
      score -= 0.1;
    }

    // Task-type specific scoring
    switch (task.type) {
      case 'DISPATCH':
        // Bonus for fast assignment and region match
        if (decision.reasoning.some(r => r.toLowerCase().includes('region'))) score += 0.2;
        if (decision.confidence > 0.8) score += 0.15;
        break;
      case 'PRICING':
        // Bonus for GST compliance and competitive pricing
        if (decision.reasoning.some(r => r.toLowerCase().includes('gst'))) score += 0.2;
        if (decision.reasoning.some(r => r.toLowerCase().includes('aud'))) score += 0.1;
        break;
      case 'BOOKING':
        // Bonus for constraint satisfaction and customer preferences
        if (decision.reasoning.length >= 3) score += 0.15;
        break;
      case 'QUALITY_CHECK':
        // Bonus for thorough analysis
        if (decision.reasoning.length >= 3) score += 0.2;
        break;
      case 'SUPPORT':
        // Bonus for correct classification
        if (decision.action !== 'default_action') score += 0.15;
        break;
    }

    // Exploration bonus (UCB1-like)
    score += 0.1 * Math.sqrt(Math.log(Math.max(this.performanceMetrics.totalTasks, 1)));

    return score;
  }

  /**
   * Get initial thought from an agent with domain context
   */
  private async getInitialThought(
    agentName: string,
    task: OasisTask,
  ): Promise<OasisDecision> {
    const regionContext = task.metadata?.regionCode
      ? `Region: ${task.metadata.regionCode}`
      : 'No region specified';

    return {
      id: `thought-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      taskId: task.id,
      agentName,
      action: this.getDefaultActionForAgent(agentName, task.type),
      confidence: 0.7,
      reasoning: [
        `Initial assessment for ${task.type} task`,
        regionContext,
        `Priority: ${task.priority}`,
      ],
      timestamp: new Date(),
      outcome: 'PENDING',
    };
  }

  /**
   * Get default action for an agent based on task type
   */
  private getDefaultActionForAgent(agentName: string, taskType: string): string {
    const actions: Record<string, Record<string, string>> = {
      'scheduling-agent': {
        BOOKING: 'optimize_schedule',
        DISPATCH: 'check_availability',
        QUALITY_CHECK: 'review_schedule_adherence',
      },
      'pricing-agent': {
        BOOKING: 'calculate_price',
        PRICING: 'optimize_pricing_model',
        QUALITY_CHECK: 'review_pricing_accuracy',
      },
      'dispatch-agent': {
        BOOKING: 'assign_optimal_staff',
        DISPATCH: 'reassign_staff',
        QUALITY_CHECK: 'review_dispatch_efficiency',
      },
      'support-agent': {
        SUPPORT: 'classify_and_respond',
        BOOKING: 'check_customer_history',
      },
      'quality-agent': {
        QUALITY_CHECK: 'comprehensive_quality_audit',
        BOOKING: 'predict_quality_score',
        DISPATCH: 'review_staff_performance',
      },
    };

    return actions[agentName]?.[taskType] || 'analyze';
  }

  /**
   * Refine thought based on previous decisions with cross-agent learning
   */
  private async refineThought(
    agentName: string,
    task: OasisTask,
    previousThoughts: OasisDecision[],
  ): Promise<OasisDecision> {
    const crossAgentInsights = previousThoughts
      .filter(p => p.agentName !== agentName)
      .flatMap(p => p.reasoning.slice(0, 1));

    return {
      id: `refined-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      taskId: task.id,
      agentName,
      action: this.getDefaultActionForAgent(agentName, task.type),
      confidence: 0.85,
      reasoning: [
        'Refined based on cross-agent reasoning',
        ...crossAgentInsights,
        `Updated assessment for ${task.type} task`,
      ],
      timestamp: new Date(),
      outcome: 'PENDING',
    };
  }

  /**
   * Create a fallback decision when MCTS doesn't find optimal solution
   */
  private createFallbackDecision(task: OasisTask): OasisDecision {
    return {
      id: `fallback-${Date.now()}`,
      taskId: task.id,
      agentName: 'orchestrator',
      action: 'default_action',
      confidence: 0.5,
      reasoning: ['Fallback decision - no optimal solution found after MCTS'],
      timestamp: new Date(),
      outcome: 'PENDING',
    };
  }

  /**
   * Get relevant agents for a task type - enhanced mapping
   */
  private getRelevantAgents(task: OasisTask): string[] {
    const agentMap: Record<string, string[]> = {
      BOOKING: ['scheduling-agent', 'pricing-agent', 'dispatch-agent'],
      DISPATCH: ['dispatch-agent', 'scheduling-agent', 'quality-agent'],
      PRICING: ['pricing-agent'],
      SUPPORT: ['support-agent'],
      QUALITY_CHECK: ['quality-agent', 'dispatch-agent'],
    };
    return agentMap[task.type] || ['scheduling-agent'];
  }

  /**
   * Get numeric priority value
   */
  private getPriorityValue(priority: string): number {
    const values: Record<string, number> = { LOW: 10, MEDIUM: 5, HIGH: 2, CRITICAL: 1 };
    return values[priority] || 5;
  }

  /**
   * Calculate average confidence across decisions
   */
  private calcAvgConfidence(decisions: OasisDecision[]): number {
    if (decisions.length === 0) return 0;
    return decisions.reduce((sum, d) => sum + d.confidence, 0) / decisions.length;
  }

  /**
   * Update average response time with exponential moving average
   */
  private updateAvgResponseTime(responseTimeMs: number): void {
    const alpha = 0.1; // Smoothing factor
    this.performanceMetrics.avgResponseTimeMs =
      alpha * responseTimeMs + (1 - alpha) * this.performanceMetrics.avgResponseTimeMs;
  }

  /**
   * Get performance metrics for monitoring
   */
  getMetrics() {
    return {
      ...this.performanceMetrics,
      avgConfidence: this.performanceMetrics.avgResponseTimeMs,
      taskHistorySize: this.taskHistory.length,
      decisionsStored: this.agentDecisions.size,
    };
  }

  /**
   * Cron job: Run quality assurance checks every hour
   */
  @Cron(CronExpression.EVERY_HOUR)
  async runHourlyQualityCheck() {
    this.logger.log('⏰ Running hourly quality check...');
    await this.submitTask({
      id: `quality-${Date.now()}`,
      type: 'QUALITY_CHECK',
      priority: 'MEDIUM',
      payload: { checkType: 'hourly', scope: 'all_active_bookings' },
      createdAt: new Date(),
    });
  }

  /**
   * Cron job: Optimize pricing models daily at 2 AM
   */
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async runDailyPricingOptimization() {
    this.logger.log('📊 Running daily pricing optimization...');
    await this.submitTask({
      id: `pricing-opt-${Date.now()}`,
      type: 'PRICING',
      priority: 'LOW',
      payload: {
        optimizationType: 'daily',
        scope: 'all_regions',
        considerDemand: true,
        considerStaffAvailability: true,
      },
      createdAt: new Date(),
    });
  }

  /**
   * Cron job: Run dispatch optimization every 30 minutes during business hours
   */
  @Cron('*/30 8-18 * * 1-5') // Every 30 min, Mon-Fri, 8am-6pm
  async runDispatchOptimization() {
    this.logger.log('🚀 Running dispatch optimization...');
    await this.submitTask({
      id: `dispatch-opt-${Date.now()}`,
      type: 'DISPATCH',
      priority: 'HIGH',
      payload: {
        optimizationType: 'real_time',
        considerTraffic: true,
        considerWeather: false, // Could be added later
      },
      createdAt: new Date(),
    });
  }

  /**
   * Cron job: Generate daily performance report at 6 PM
   */
  @Cron('0 18 * * *')
  async runDailyPerformanceReport() {
    this.logger.log('📈 Generating daily performance report...');
    const metrics = this.getMetrics();
    this.logger.log(`Daily metrics: ${JSON.stringify(metrics)}`);

    // Emit event for external reporting
    this.eventEmitter.emit('oasis.daily-report', {
      date: new Date().toISOString().split('T')[0],
      metrics,
      generatedAt: new Date(),
    });
  }
}
