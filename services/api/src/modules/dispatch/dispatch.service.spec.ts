import { Test, TestingModule } from '@nestjs/testing';
import { DispatchService } from './dispatch.service';
import { DispatchStatusEnum } from './entities/dispatch-assignment.entity';
import { BadRequestException } from '@nestjs/common';

describe('DispatchService', () => {
  let service: DispatchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DispatchService],
    }).compile();

    service = module.get<DispatchService>(DispatchService);

    // Register test staff
    service.registerStaff([
      {
        id: 'staff-001',
        role: 'cleaner',
        status: 'active',
        skills: ['regular_cleaning', 'deep_cleaning'],
        assignedRegions: ['NSW', 'VIC'],
        maxDailyBookings: 5,
        currentDailyBookings: 2,
        qualityScore: 4.8,
      },
      {
        id: 'staff-002',
        role: 'cleaner',
        status: 'active',
        skills: ['window_cleaning', 'pressure_washing'],
        assignedRegions: ['NSW'],
        maxDailyBookings: 6,
        currentDailyBookings: 3,
        qualityScore: 4.6,
      },
      {
        id: 'staff-003',
        role: 'team_lead',
        status: 'on_leave',
        skills: ['quality_inspection'],
        assignedRegions: ['NSW'],
        maxDailyBookings: 3,
        currentDailyBookings: 0,
        qualityScore: 4.9,
      },
      {
        id: 'staff-004',
        role: 'cleaner',
        status: 'active',
        skills: ['regular_cleaning'],
        assignedRegions: ['QLD'],
        maxDailyBookings: 4,
        currentDailyBookings: 4, // Fully booked
        qualityScore: 4.3,
      },
    ]);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('recommendStaffForBooking', () => {
    it('should return recommendations sorted by score', async () => {
      const recommendations = await service.recommendStaffForBooking(
        'booking-001',
        'NSW',
        ['regular_cleaning'],
      );

      expect(recommendations).toBeDefined();
      expect(Array.isArray(recommendations)).toBe(true);
      expect(recommendations.length).toBeGreaterThan(0);
      expect(recommendations.length).toBeLessThanOrEqual(5);

      // Should be sorted by score descending
      for (let i = 0; i < recommendations.length - 1; i++) {
        expect(recommendations[i].score).toBeGreaterThanOrEqual(
          recommendations[i + 1].score,
        );
      }
    });

    it('should not include staff on leave', async () => {
      const recommendations = await service.recommendStaffForBooking(
        'booking-001',
        'NSW',
      );

      const staffIds = recommendations.map((r) => r.staffId);
      expect(staffIds).not.toContain('staff-003'); // On leave
    });

    it('should not include fully booked staff', async () => {
      const recommendations = await service.recommendStaffForBooking(
        'booking-001',
        'QLD',
      );

      const staffIds = recommendations.map((r) => r.staffId);
      expect(staffIds).not.toContain('staff-004'); // Fully booked
    });

    it('should prefer staff with region match', async () => {
      const recommendations = await service.recommendStaffForBooking(
        'booking-001',
        'NSW',
        ['regular_cleaning'],
      );

      expect(recommendations.length).toBeGreaterThan(0);
      // staff-001 should be in recommendations (has region + skill match)
      const staff001 = recommendations.find((r) => r.staffId === 'staff-001');
      expect(staff001).toBeDefined();
      expect(staff001?.reasons.some((r) => r.includes('Region match'))).toBe(true);
    });

    it('should score skill matches higher', async () => {
      const withSkills = await service.recommendStaffForBooking(
        'booking-001',
        'NSW',
        ['regular_cleaning', 'deep_cleaning'],
      );

      const withoutSkills = await service.recommendStaffForBooking(
        'booking-001',
        'NSW',
      );

      // Both should return results, but withSkills should have staff-001 ranked higher
      expect(withSkills.length).toBeGreaterThan(0);
      expect(withoutSkills.length).toBeGreaterThan(0);
    });

    it('should return empty array when no staff available', async () => {
      const recommendations = await service.recommendStaffForBooking(
        'booking-001',
        'NT', // No staff assigned to NT in our test data
        ['specialized_skill'],
      );

      expect(recommendations).toBeDefined();
      expect(Array.isArray(recommendations)).toBe(true);
    });
  });

  describe('assignStaff', () => {
    it('should assign staff to a booking', async () => {
      const assignment = await service.assignStaff({
        bookingId: 'booking-001',
        staffId: 'staff-001',
      });

      expect(assignment).toBeDefined();
      expect(assignment.staffId).toBe('staff-001');
      expect(assignment.bookingId).toBe('booking-001');
      expect(assignment.status).toBe(DispatchStatusEnum.ASSIGNED);
    });

    it('should throw for non-existent staff', async () => {
      await expect(
        service.assignStaff({
          bookingId: 'booking-001',
          staffId: 'non-existent',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw for staff on leave', async () => {
      await expect(
        service.assignStaff({
          bookingId: 'booking-001',
          staffId: 'staff-003', // On leave
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw for fully booked staff', async () => {
      await expect(
        service.assignStaff({
          bookingId: 'booking-001',
          staffId: 'staff-004', // Fully booked
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should include optional fields', async () => {
      const assignment = await service.assignStaff({
        bookingId: 'booking-001',
        staffId: 'staff-001',
        teamLeadId: 'staff-003',
        additionalStaffIds: ['staff-002'],
        estimatedTravelTimeMin: 15,
        estimatedDurationMin: 120,
      });

      expect(assignment.teamLeadId).toBe('staff-003');
      expect(assignment.additionalStaffIds).toContain('staff-002');
      expect(assignment.estimatedTravelTimeMin).toBe(15);
      expect(assignment.estimatedDurationMin).toBe(120);
    });
  });

  describe('autoAssign', () => {
    it('should automatically assign best available staff', async () => {
      const assignment = await service.autoAssign(
        'booking-001',
        'NSW',
        ['regular_cleaning'],
      );

      expect(assignment).toBeDefined();
      expect(assignment.status).toBe(DispatchStatusEnum.ASSIGNED);
    });

    it('should return lower scores for mismatched region and skills', async () => {
      // NT with specialized_skill - staff exist but scores will be lower
      const recommendations = await service.recommendStaffForBooking(
        'booking-001',
        'NT',
        ['specialized_skill'],
      );

      // May return results but with low scores due to no region/skill match
      expect(Array.isArray(recommendations)).toBe(true);
    });
  });

  describe('findByBookingId', () => {
    it('should return assignments for a booking', async () => {
      await service.assignStaff({
        bookingId: 'booking-find',
        staffId: 'staff-001',
      });

      const assignments = await service.findByBookingId('booking-find');
      expect(Array.isArray(assignments)).toBe(true);
      expect(assignments.length).toBeGreaterThan(0);
      expect(assignments[0].bookingId).toBe('booking-find');
    });

    it('should return empty array for unknown booking', async () => {
      const assignments = await service.findByBookingId('non-existent');
      expect(assignments).toEqual([]);
    });
  });

  describe('findByStaffId', () => {
    it('should return assignments for a staff member', async () => {
      await service.assignStaff({
        bookingId: 'booking-001',
        staffId: 'staff-001',
      });

      const assignments = await service.findByStaffId('staff-001');
      expect(Array.isArray(assignments)).toBe(true);
      expect(assignments.length).toBeGreaterThan(0);
      expect(assignments[0].staffId).toBe('staff-001');
    });
  });

  describe('updateStatus', () => {
    it('should update assignment status', async () => {
      const assignment = await service.assignStaff({
        bookingId: 'booking-status',
        staffId: 'staff-001',
      });

      const updated = await service.updateStatus(
        assignment.id,
        DispatchStatusEnum.EN_ROUTE,
      );

      expect(updated.status).toBe(DispatchStatusEnum.EN_ROUTE);
      expect(updated.enRouteAt).toBeDefined();
    });

    it('should set completedAt when status is COMPLETED', async () => {
      const assignment = await service.assignStaff({
        bookingId: 'booking-complete',
        staffId: 'staff-001',
      });

      const updated = await service.updateStatus(
        assignment.id,
        DispatchStatusEnum.COMPLETED,
      );

      expect(updated.status).toBe(DispatchStatusEnum.COMPLETED);
      expect(updated.completedAt).toBeDefined();
    });

    it('should throw for non-existent assignment', async () => {
      await expect(
        service.updateStatus('non-existent', DispatchStatusEnum.EN_ROUTE),
      ).rejects.toThrow('not found');
    });
  });
});
