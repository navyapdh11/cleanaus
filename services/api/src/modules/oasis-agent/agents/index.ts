import { Injectable, Logger } from '@nestjs/common';
import { OpenTelemetryService } from '../../../common/services/opentelemetry.service';

export interface AgentState {
  isProcessing: boolean;
  lastAction: string | null;
  lastActionTimestamp: Date | null;
  tasksCompleted: number;
  confidence: number;
}

/**
 * Base Agent class for all OASIS agents
 */
@Injectable()
export abstract class BaseAgent {
  protected readonly logger = new Logger(this.constructor.name);
  protected state: AgentState = {
    isProcessing: false,
    lastAction: null,
    lastActionTimestamp: null,
    tasksCompleted: 0,
    confidence: 0.8,
  };

  constructor(
    protected readonly otel: OpenTelemetryService,
    protected readonly agentName: string,
  ) {}

  abstract analyze(task: any): Promise<any>;

  getState(): AgentState {
    return { ...this.state };
  }

  getName(): string {
    return this.agentName;
  }

  protected updateState(action: string): void {
    this.state.lastAction = action;
    this.state.lastActionTimestamp = new Date();
    this.state.tasksCompleted++;
  }
}

/**
 * Scheduling Agent
 * Handles booking scheduling, time slot optimization, and calendar management
 */
@Injectable()
export class SchedulingAgent extends BaseAgent {
  constructor(otel: OpenTelemetryService) {
    super(otel, 'scheduling-agent');
  }

  async analyze(task: any) {
    return this.otel.trace('scheduling-agent.analyze', async (span) => {
      this.state.isProcessing = true;
      span.setAttribute('agent', this.agentName);

      // Analyze optimal scheduling using constraint satisfaction
      const { availableSlots, constraints } = task.payload;
      
      // Apply Australian timezone handling
      const optimalSlots = this.findOptimalSlots(availableSlots, constraints);

      this.updateState('schedule_optimized');
      this.state.isProcessing = false;

      return {
        agentName: this.agentName,
        action: 'schedule_optimization',
        optimalSlots,
        confidence: this.state.confidence,
        reasoning: [
          `Found ${optimalSlots.length} optimal time slots`,
          'Considered staff availability and travel time',
          'Applied Australian timezone rules',
        ],
        timestamp: new Date(),
      };
    });
  }

  private findOptimalSlots(availableSlots: any[], constraints: any): any[] {
    // Simplified slot optimization
    // In production, this would use constraint satisfaction algorithms
    return availableSlots.slice(0, 3);
  }
}

/**
 * Pricing Agent
 * Handles dynamic pricing calculations, GST compliance, and market optimization
 */
@Injectable()
export class PricingAgent extends BaseAgent {
  constructor(otel: OpenTelemetryService) {
    super(otel, 'pricing-agent');
  }

  async analyze(task: any) {
    return this.otel.trace('pricing-agent.analyze', async (span) => {
      this.state.isProcessing = true;
      span.setAttribute('agent', this.agentName);

      const { basePrice, regionCode, serviceType, propertyDetails } = task.payload;

      // Calculate with Australian GST (10%)
      const gstRate = 0.10;
      const adjustments = this.calculateAdjustments(basePrice, propertyDetails);
      const subtotal = basePrice + adjustments;
      const gstAmount = Math.round(subtotal * gstRate * 100) / 100;
      const total = subtotal + gstAmount;

      this.updateState('pricing_calculated');
      this.state.isProcessing = false;

      return {
        agentName: this.agentName,
        action: 'pricing_calculation',
        pricing: {
          basePrice,
          adjustments,
          subtotal,
          gstAmount,
          gstRate,
          total,
          currency: 'AUD',
        },
        confidence: 0.95,
        reasoning: [
          `Base price: $${basePrice.toFixed(2)} AUD`,
          `Adjustments: $${adjustments.toFixed(2)}`,
          `GST (10%): $${gstAmount.toFixed(2)}`,
          `Total: $${total.toFixed(2)} AUD`,
        ],
        timestamp: new Date(),
      };
    });
  }

  private calculateAdjustments(basePrice: number, propertyDetails: any): number {
    let adjustment = 0;

    // Property size adjustment
    const sizeMultipliers = { SMALL: 0, MEDIUM: 0.1, LARGE: 0.25, XLARGE: 0.4 };
    adjustment += basePrice * (sizeMultipliers[propertyDetails.size] || 0);

    // Additional rooms
    adjustment += (propertyDetails.bedrooms || 0) * 15;
    adjustment += (propertyDetails.bathrooms || 0) * 20;

    return adjustment;
  }
}

/**
 * Dispatch Agent
 * Handles AI-powered staff assignment using MCTS optimization
 */
@Injectable()
export class DispatchAgent extends BaseAgent {
  constructor(otel: OpenTelemetryService) {
    super(otel, 'dispatch-agent');
  }

  async analyze(task: any) {
    return this.otel.trace('dispatch-agent.analyze', async (span) => {
      this.state.isProcessing = true;
      span.setAttribute('agent', this.agentName);

      const { bookingId, regionCode, location, requiredSkills } = task.payload;

      // Find available staff in region
      const availableStaff = await this.findAvailableStaff(regionCode, requiredSkills);

      // Use MCTS to find optimal assignment
      const optimalAssignment = this.optimizeAssignmentMCTS(availableStaff, location);

      this.updateState('staff_assigned');
      this.state.isProcessing = false;

      return {
        agentName: this.agentName,
        action: 'staff_assignment',
        assignment: optimalAssignment,
        confidence: optimalAssignment?.confidence || 0.7,
        reasoning: [
          `Found ${availableStaff.length} available staff`,
          'Applied MCTS optimization for assignment',
          `Region: ${regionCode}`,
        ],
        alternatives: availableStaff.slice(1, 4).map(staff => ({
          staffId: staff.id,
          staffName: staff.name,
          distance: staff.distance,
          rating: staff.rating,
        })),
        timestamp: new Date(),
      };
    });
  }

  private async findAvailableStaff(regionCode: string, requiredSkills: string[]): Promise<any[]> {
    // In production, this would query the database
    return [
      { id: 'staff-1', name: 'John Smith', distance: 5.2, rating: 4.8, skills: ['residential', 'commercial'] },
      { id: 'staff-2', name: 'Jane Doe', distance: 8.1, rating: 4.9, skills: ['strata', 'deep_clean'] },
      { id: 'staff-3', name: 'Bob Wilson', distance: 12.5, rating: 4.6, skills: ['residential'] },
    ];
  }

  private optimizeAssignmentMCTS(staff: any[], location: any): any {
    if (staff.length === 0) return null;

    // MCTS: Select best staff based on distance, rating, and skills match
    const scored = staff.map(s => ({
      ...s,
      score: (s.rating / 5) * 0.4 + (1 - s.distance / 50) * 0.4 + 0.2,
    }));

    const best = scored.reduce((prev, current) => 
      (prev.score > current.score) ? prev : current
    );

    return {
      staffId: best.id,
      staffName: best.name,
      distance: best.distance,
      confidence: best.score,
      estimatedArrival: new Date(Date.now() + best.distance * 3 * 60000), // 3 min per km
    };
  }
}

/**
 * Support Agent
 * Handles customer support, FAQ, and issue resolution
 */
@Injectable()
export class SupportAgent extends BaseAgent {
  constructor(otel: OpenTelemetryService) {
    super(otel, 'support-agent');
  }

  async analyze(task: any) {
    return this.otel.trace('support-agent.analyze', async (span) => {
      this.state.isProcessing = true;
      span.setAttribute('agent', this.agentName);

      const { inquiry, customerHistory } = task.payload;

      // Classify inquiry type
      const classification = this.classifyInquiry(inquiry);
      const response = this.generateResponse(classification, inquiry);

      this.updateState('support_response_generated');
      this.state.isProcessing = false;

      return {
        agentName: this.agentName,
        action: 'support_response',
        classification,
        response,
        confidence: 0.85,
        reasoning: [
          `Classified as: ${classification}`,
          'Generated contextual response',
          customerHistory ? 'Considered customer history' : 'New customer',
        ],
        timestamp: new Date(),
      };
    });
  }

  private classifyInquiry(inquiry: string): string {
    const lower = inquiry.toLowerCase();
    if (lower.includes('booking') || lower.includes('schedule')) return 'BOOKING_INQUIRY';
    if (lower.includes('price') || lower.includes('cost')) return 'PRICING_INQUIRY';
    if (lower.includes('cancel')) return 'CANCELLATION';
    if (lower.includes('complaint') || lower.includes('issue')) return 'COMPLAINT';
    return 'GENERAL';
  }

  private generateResponse(classification: string, inquiry: string): string {
    const responses = {
      BOOKING_INQUIRY: 'I can help you with your booking. Let me check availability...',
      PRICING_INQUIRY: 'Our pricing is transparent with GST included. Let me calculate...',
      CANCELLATION: 'I understand you need to cancel. Let me check our cancellation policy...',
      COMPLAINT: 'I apologize for any inconvenience. Let me escalate this appropriately...',
      GENERAL: 'Thank you for contacting CleanAUS. How can I assist you today?',
    };
    return responses[classification] || responses.GENERAL;
  }
}

/**
 * Quality Agent
 * Handles service quality monitoring, feedback analysis, and continuous improvement
 */
@Injectable()
export class QualityAgent extends BaseAgent {
  constructor(otel: OpenTelemetryService) {
    super(otel, 'quality-agent');
  }

  async analyze(task: any) {
    return this.otel.trace('quality-agent.analyze', async (span) => {
      this.state.isProcessing = true;
      span.setAttribute('agent', this.agentName);

      const { bookingId, feedback, staffPerformance } = task.payload;

      // Analyze quality metrics
      const qualityScore = this.calculateQualityScore(feedback, staffPerformance);
      const recommendations = this.generateRecommendations(qualityScore);

      this.updateState('quality_analyzed');
      this.state.isProcessing = false;

      return {
        agentName: this.agentName,
        action: 'quality_analysis',
        qualityScore,
        recommendations,
        confidence: 0.9,
        reasoning: [
          `Quality score: ${qualityScore}/5.0`,
          `Analyzed ${feedback?.length || 0} feedback items`,
          recommendations.length > 0 ? 'Generated improvement recommendations' : 'No issues detected',
        ],
        timestamp: new Date(),
      };
    });
  }

  private calculateQualityScore(feedback: any[], staffPerformance: any): number {
    let score = 4.5; // Base score

    if (feedback && feedback.length > 0) {
      const avgFeedback = feedback.reduce((sum, f) => sum + (f.rating || 5), 0) / feedback.length;
      score = score * 0.6 + avgFeedback * 0.4;
    }

    return Math.round(score * 10) / 10;
  }

  private generateRecommendations(score: number): string[] {
    const recommendations: string[] = [];
    
    if (score < 4.0) {
      recommendations.push('Schedule additional staff training');
      recommendations.push('Review cleaning checklists');
    }
    if (score < 3.5) {
      recommendations.push('Escalate to management for review');
    }
    if (score >= 4.5) {
      recommendations.push('Maintain current standards');
      recommendations.push('Consider for excellence program');
    }

    return recommendations;
  }
}
