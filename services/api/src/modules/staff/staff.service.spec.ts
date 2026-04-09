import { Test, TestingModule } from '@nestjs/testing';
import { StaffService } from './staff.service';
import { CreateStaffDto } from './dto/staff.dto';
import { StaffStatusEnum, StaffRoleEnum } from './entities/staff.entity';

describe('StaffService', () => {
  let service: StaffService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StaffService],
    }).compile();

    service = module.get<StaffService>(StaffService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all staff members', async () => {
      const staff = await service.findAll();
      expect(Array.isArray(staff)).toBe(true);
      expect(staff.length).toBeGreaterThan(0);
    });
  });

  describe('findActive', () => {
    it('should return only active staff', async () => {
      const activeStaff = await service.findActive();
      expect(Array.isArray(activeStaff)).toBe(true);
      activeStaff.forEach(member => {
        expect(member.status).toBe(StaffStatusEnum.ACTIVE);
      });
    });
  });

  describe('findOne', () => {
    it('should return a staff member by id', async () => {
      const staff = await service.findOne('staff-001');
      expect(staff).toBeDefined();
      expect(staff.id).toBe('staff-001');
      expect(staff.firstName).toBe('Sarah');
    });

    it('should throw NotFoundException for non-existent staff', async () => {
      await expect(service.findOne('non-existent'))
        .rejects
        .toThrow('not found');
    });
  });

  describe('findByRegion', () => {
    it('should return staff for a specific region', async () => {
      const staff = await service.findByRegion('NSW');
      expect(Array.isArray(staff)).toBe(true);
      staff.forEach(member => {
        expect(member.assignedRegions).toContain('NSW');
        expect(member.status).toBe(StaffStatusEnum.ACTIVE);
      });
    });

    it('should return staff for VIC region', async () => {
      const staff = await service.findByRegion('VIC');
      expect(staff.length).toBeGreaterThan(0);
    });
  });

  describe('findBySkill', () => {
    it('should return staff with specific skill', async () => {
      const staff = await service.findBySkill('deep_cleaning');
      expect(Array.isArray(staff)).toBe(true);
      staff.forEach(member => {
        expect(member.skills).toContain('deep_cleaning');
      });
    });
  });

  describe('create', () => {
    it('should create a new staff member', async () => {
      const createDto: CreateStaffDto = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test.user@cleanaus.com.au',
        phone: '+61412345999',
        role: StaffRoleEnum.CLEANER,
        assignedRegions: ['NSW'],
        skills: ['regular_cleaning'],
        maxDailyBookings: 5,
      };

      const staff = await service.create(createDto);

      expect(staff).toBeDefined();
      expect(staff.id).toBeDefined();
      expect(staff.firstName).toBe('Test');
      expect(staff.status).toBe(StaffStatusEnum.ACTIVE);
      expect(staff.policeCheckVerified).toBe(false);
    });
  });

  describe('update', () => {
    it('should update staff information', async () => {
      const staff = await service.findOne('staff-001');
      const originalName = staff.firstName;

      const updated = await service.update('staff-001', {
        firstName: 'Updated Name',
      });

      expect(updated.firstName).toBe('Updated Name');
      expect(updated.updatedAt).toBeDefined();
    });
  });

  describe('incrementDailyBookings', () => {
    it('should increment daily bookings for a staff member', async () => {
      const staff = await service.findOne('staff-001');
      const originalCount = staff.currentDailyBookings;

      const updated = await service.incrementDailyBookings('staff-001');
      expect(updated.currentDailyBookings).toBe(originalCount + 1);
    });
  });
});
