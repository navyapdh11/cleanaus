import { Injectable, Optional, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DispatchAssignmentEntity, DispatchStatusEnum } from './entities/dispatch-assignment.entity';
import { AssignStaffDto, DispatchRecommendationDto } from './dto/dispatch.dto';

// In production these would be injected services
interface StaffLike {
  id: string;
  role: string;
  status: string;
  skills: string[];
  assignedRegions: string[];
  maxDailyBookings: number;
  currentDailyBookings: number;
  qualityScore: number;
}

@Injectable()
export class DispatchService {
  private readonly logger = new Logger(DispatchService.name);
  private inMemoryAssignments: Map<string, DispatchAssignmentEntity> = new Map();

  // Simulated staff data (in production, injected from StaffService)
  private staffCache: Map<string, StaffLike> = new Map();

  constructor(
    @Optional() @InjectRepository(DispatchAssignmentEntity)
    private dispatchRepository?: Repository<DispatchAssignmentEntity>,
  ) {}

  /**
   * Register staff data for dispatch calculations.
   * In production this would be handled via cross-module service injection.
   */
  registerStaff(staff: StaffLike[]) {
    for (const s of staff) {
      this.staffCache.set(s.id, s);
    }
  }

  /**
   * MCTS-inspired staff assignment optimization.
   * Scores each candidate staff member on multiple weighted factors:
   * - Availability (can they take more bookings today?)
   * - Region match (are they assigned to this region?)
   * - Skill match (do they have the required skills?)
   * - Quality score (higher is better)
   * - Current load balancing (prefer less loaded staff)
   */
  async recommendStaffForBooking(
    bookingId: string,
    regionCode: string,
    requiredSkills: string[] = [],
  ): Promise<DispatchRecommendationDto[]> {
    const allStaff = Array.from(this.staffCache.values());
    const activeStaff = allStaff.filter((s) => s.status === 'active');

    const recommendations: DispatchRecommendationDto[] = [];

    for (const staff of activeStaff) {
      let score = 0;
      const reasons: string[] = [];

      // Availability check (weight: 30%)
      const hasCapacity = staff.currentDailyBookings < staff.maxDailyBookings;
      if (!hasCapacity) continue; // Skip fully booked staff

      const capacityRatio = 1 - staff.currentDailyBookings / staff.maxDailyBookings;
      score += capacityRatio * 30;
      reasons.push(`Capacity available: ${staff.maxDailyBookings - staff.currentDailyBookings} slots`);

      // Region match (weight: 25%)
      const regionMatch = staff.assignedRegions.includes(regionCode);
      if (regionMatch) {
        score += 25;
        reasons.push(`Region match: ${regionCode}`);
      }

      // Skill match (weight: 25%)
      const matchedSkills = requiredSkills.filter((skill) => staff.skills.includes(skill));
      const skillRatio = requiredSkills.length > 0 ? matchedSkills.length / requiredSkills.length : 1;
      score += skillRatio * 25;
      if (matchedSkills.length > 0) {
        reasons.push(`Skills matched: ${matchedSkills.join(', ')}`);
      }

      // Quality score (weight: 15%)
      const qualityNormalized = staff.qualityScore / 5;
      score += qualityNormalized * 15;
      reasons.push(`Quality score: ${staff.qualityScore}/5`);

      // Load balancing (weight: 5%)
      const loadRatio = 1 - staff.currentDailyBookings / staff.maxDailyBookings;
      score += loadRatio * 5;

      recommendations.push({
        staffId: staff.id,
        score: Math.round(score * 100) / 100,
        reasons,
        available: hasCapacity,
        distance: regionMatch ? 5 : 25, // Simulated distance in km
        qualityScore: staff.qualityScore,
        skillsMatch: skillRatio === 1,
        currentLoad: staff.currentDailyBookings,
        maxLoad: staff.maxDailyBookings,
      });
    }

    // Sort by score descending (best matches first)
    recommendations.sort((a, b) => b.score - a.score);
    return recommendations.slice(0, 5); // Top 5
  }

  async assignStaff(dto: AssignStaffDto): Promise<DispatchAssignmentEntity> {
    // Verify staff exists and is available
    const staff = this.staffCache.get(dto.staffId);
    if (!staff) {
      throw new BadRequestException(`Staff member ${dto.staffId} not found`);
    }
    if (staff.status !== 'active') {
      throw new BadRequestException(`Staff member ${dto.staffId} is not active`);
    }
    if (staff.currentDailyBookings >= staff.maxDailyBookings) {
      throw new BadRequestException(`Staff member ${dto.staffId} is at max capacity`);
    }

    const entity = this.dispatchRepository
      ? this.dispatchRepository.create({
          bookingId: dto.bookingId,
          staffId: dto.staffId,
          teamLeadId: dto.teamLeadId || null,
          additionalStaffIds: dto.additionalStaffIds || [],
          status: DispatchStatusEnum.ASSIGNED,
          assignedAt: new Date(),
          confidenceScore: 0,
          assignmentReason: { manual: true },
          estimatedTravelTimeMin: dto.estimatedTravelTimeMin || null,
          estimatedDurationMin: dto.estimatedDurationMin || null,
          routeInfo: null,
        })
      : ({
          id: `dispatch-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          bookingId: dto.bookingId,
          staffId: dto.staffId,
          teamLeadId: dto.teamLeadId || null,
          additionalStaffIds: dto.additionalStaffIds || [],
          status: DispatchStatusEnum.ASSIGNED,
          assignedAt: new Date(),
          confidenceScore: 0,
          assignmentReason: { manual: true },
          estimatedTravelTimeMin: dto.estimatedTravelTimeMin || null,
          estimatedDurationMin: dto.estimatedDurationMin || null,
          routeInfo: null,
          enRouteAt: null,
          startedAt: null,
          completedAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as unknown as DispatchAssignmentEntity);

    if (entity && this.dispatchRepository) {
      await this.dispatchRepository.save(entity);
    } else {
      this.inMemoryAssignments.set(entity.id, entity);
    }

    this.logger.log(`Staff ${dto.staffId} assigned to booking ${dto.bookingId}`);
    return entity;
  }

  async autoAssign(
    bookingId: string,
    regionCode: string,
    requiredSkills: string[] = [],
  ): Promise<DispatchAssignmentEntity> {
    const recommendations = await this.recommendStaffForBooking(bookingId, regionCode, requiredSkills);

    if (recommendations.length === 0) {
      throw new BadRequestException('No available staff for this booking');
    }

    const best = recommendations[0];

    return this.assignStaff({
      bookingId,
      staffId: best.staffId,
      estimatedTravelTimeMin: best.distance * 2, // Rough estimate: 2 min per km
    });
  }

  async findByBookingId(bookingId: string): Promise<DispatchAssignmentEntity[]> {
    if (this.dispatchRepository) {
      return this.dispatchRepository.find({ where: { bookingId } });
    }
    return Array.from(this.inMemoryAssignments.values()).filter(
      (a) => a.bookingId === bookingId,
    );
  }

  async findByStaffId(staffId: string): Promise<DispatchAssignmentEntity[]> {
    if (this.dispatchRepository) {
      return this.dispatchRepository.find({ where: { staffId } });
    }
    return Array.from(this.inMemoryAssignments.values()).filter(
      (a) => a.staffId === staffId,
    );
  }

  async updateStatus(id: string, status: DispatchStatusEnum): Promise<DispatchAssignmentEntity> {
    const assignment = this.dispatchRepository
      ? await this.dispatchRepository.findOne({ where: { id } })
      : this.inMemoryAssignments.get(id);

    if (!assignment) {
      throw new Error(`Dispatch assignment ${id} not found`);
    }

    assignment.status = status;
    assignment.updatedAt = new Date();

    const now = new Date();
    if (status === DispatchStatusEnum.EN_ROUTE) assignment.enRouteAt = now;
    if (status === DispatchStatusEnum.IN_PROGRESS) assignment.startedAt = now;
    if (status === DispatchStatusEnum.COMPLETED) assignment.completedAt = now;

    if (this.dispatchRepository) {
      await this.dispatchRepository.save(assignment);
    } else {
      this.inMemoryAssignments.set(id, assignment);
    }

    this.logger.log(`Dispatch ${id} status updated: ${status}`);
    return assignment;
  }
}
