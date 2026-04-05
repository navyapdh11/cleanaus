import { Injectable, NotFoundException, Optional, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StaffEntity, StaffStatusEnum, StaffRoleEnum } from './entities/staff.entity';
import { CreateStaffDto, UpdateStaffDto } from './dto/staff.dto';

@Injectable()
export class StaffService {
  private readonly logger = new Logger(StaffService.name);
  private inMemoryStaff: Map<string, StaffEntity> = new Map();

  constructor(
    @Optional() @InjectRepository(StaffEntity)
    private staffRepository?: Repository<StaffEntity>,
  ) {
    this.seedDefaultStaff();
  }

  private async seedDefaultStaff() {
    const defaultStaff: Omit<StaffEntity, 'createdAt' | 'updatedAt'>[] = [
      {
        id: 'staff-001',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.j@cleanaus.com.au',
        phone: '+61412345001',
        role: StaffRoleEnum.TEAM_LEAD,
        status: StaffStatusEnum.ACTIVE,
        skills: ['deep_cleaning', 'carpet_cleaning', 'eco_friendly'],
        assignedRegions: ['NSW'],
        maxDailyBookings: 5,
        currentDailyBookings: 2,
        qualityScore: 4.8,
        totalBookingsCompleted: 342,
        policeCheckVerified: true,
        policeCheckExpiry: new Date('2027-06-01'),
        insuranceVerified: true,
        availability: { monday: true, tuesday: true, wednesday: true, thursday: true, friday: true },
        bio: 'Team lead with 8+ years experience in residential and commercial cleaning',
        profilePhotoUrl: null,
        emergencyContact: { name: 'Mike Johnson', phone: '+61412345999' },
      },
      {
        id: 'staff-002',
        firstName: 'David',
        lastName: 'Chen',
        email: 'david.c@cleanaus.com.au',
        phone: '+61412345002',
        role: StaffRoleEnum.CLEANER,
        status: StaffStatusEnum.ACTIVE,
        skills: ['window_cleaning', 'pressure_washing'],
        assignedRegions: ['NSW', 'VIC'],
        maxDailyBookings: 6,
        currentDailyBookings: 3,
        qualityScore: 4.6,
        totalBookingsCompleted: 189,
        policeCheckVerified: true,
        policeCheckExpiry: new Date('2027-03-15'),
        insuranceVerified: true,
        availability: { monday: true, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: true },
        bio: 'Specialist in window cleaning and outdoor pressure washing',
        profilePhotoUrl: null,
        emergencyContact: null,
      },
      {
        id: 'staff-003',
        firstName: 'Emma',
        lastName: 'Williams',
        email: 'emma.w@cleanaus.com.au',
        phone: '+61412345003',
        role: StaffRoleEnum.CLEANER,
        status: StaffStatusEnum.ACTIVE,
        skills: ['regular_cleaning', 'end_of_lease', 'airbnb_turnover'],
        assignedRegions: ['VIC'],
        maxDailyBookings: 7,
        currentDailyBookings: 4,
        qualityScore: 4.9,
        totalBookingsCompleted: 267,
        policeCheckVerified: true,
        policeCheckExpiry: new Date('2027-09-20'),
        insuranceVerified: true,
        availability: { monday: true, tuesday: true, wednesday: true, thursday: true, friday: true },
        bio: 'Top-rated cleaner specializing in end-of-lease and Airbnb turnovers',
        profilePhotoUrl: null,
        emergencyContact: { name: 'Tom Williams', phone: '+61412345888' },
      },
      {
        id: 'staff-004',
        firstName: 'James',
        lastName: 'Taylor',
        email: 'james.t@cleanaus.com.au',
        phone: '+61412345004',
        role: StaffRoleEnum.SUPERVISOR,
        status: StaffStatusEnum.ACTIVE,
        skills: ['quality_inspection', 'team_management', 'client_relations'],
        assignedRegions: ['NSW', 'VIC', 'QLD'],
        maxDailyBookings: 3,
        currentDailyBookings: 1,
        qualityScore: 4.7,
        totalBookingsCompleted: 521,
        policeCheckVerified: true,
        policeCheckExpiry: new Date('2027-12-01'),
        insuranceVerified: true,
        availability: { monday: true, tuesday: true, wednesday: true, thursday: true, friday: true },
        bio: 'Regional supervisor managing quality standards across eastern states',
        profilePhotoUrl: null,
        emergencyContact: null,
      },
      {
        id: 'staff-005',
        firstName: 'Olivia',
        lastName: 'Brown',
        email: 'olivia.b@cleanaus.com.au',
        phone: '+61412345005',
        role: StaffRoleEnum.CLEANER,
        status: StaffStatusEnum.ON_LEAVE,
        skills: ['regular_cleaning', 'eco_friendly', 'office_cleaning'],
        assignedRegions: ['QLD'],
        maxDailyBookings: 6,
        currentDailyBookings: 0,
        qualityScore: 4.5,
        totalBookingsCompleted: 98,
        policeCheckVerified: true,
        policeCheckExpiry: new Date('2027-01-10'),
        insuranceVerified: false,
        availability: { monday: false, tuesday: false, wednesday: false, thursday: false, friday: false },
        bio: 'Currently on leave - returning March 2026',
        profilePhotoUrl: null,
        emergencyContact: null,
      },
    ];

    for (const member of defaultStaff) {
      if (!this.inMemoryStaff.has(member.id)) {
        this.inMemoryStaff.set(member.id, {
          ...member,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as StaffEntity);
      }
    }
    this.logger.log(`Seeded ${defaultStaff.length} staff members`);
  }

  async create(dto: CreateStaffDto): Promise<StaffEntity> {
    const entity = this.staffRepository
      ? this.staffRepository.create({
          ...dto,
          skills: dto.skills || [],
          assignedRegions: dto.assignedRegions || [],
          currentDailyBookings: 0,
          qualityScore: 5.0,
          totalBookingsCompleted: 0,
          policeCheckVerified: false,
          insuranceVerified: false,
          availability: {},
        })
      : ({
          id: `staff-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          ...dto,
          skills: dto.skills || [],
          assignedRegions: dto.assignedRegions || [],
          currentDailyBookings: 0,
          qualityScore: 5.0,
          totalBookingsCompleted: 0,
          policeCheckVerified: false,
          insuranceVerified: false,
          availability: {},
          createdAt: new Date(),
          updatedAt: new Date(),
        } as StaffEntity);

    if (entity && this.staffRepository) {
      await this.staffRepository.save(entity);
    } else {
      this.inMemoryStaff.set(entity.id, entity);
    }

    this.logger.log(`Staff created: ${entity.id}`);
    return entity;
  }

  async findAll(): Promise<StaffEntity[]> {
    if (this.staffRepository) {
      return this.staffRepository.find();
    }
    return Array.from(this.inMemoryStaff.values());
  }

  async findActive(): Promise<StaffEntity[]> {
    if (this.staffRepository) {
      return this.staffRepository.find({ where: { status: StaffStatusEnum.ACTIVE } });
    }
    return Array.from(this.inMemoryStaff.values()).filter(
      (s) => s.status === StaffStatusEnum.ACTIVE,
    );
  }

  async findOne(id: string): Promise<StaffEntity> {
    const staff = this.staffRepository
      ? await this.staffRepository.findOne({ where: { id } })
      : this.inMemoryStaff.get(id);

    if (!staff) {
      throw new NotFoundException(`Staff member ${id} not found`);
    }
    return staff;
  }

  async findByRegion(regionCode: string): Promise<StaffEntity[]> {
    if (this.staffRepository) {
      return this.staffRepository
        .createQueryBuilder('staff')
        .where('staff.status = :status', { status: StaffStatusEnum.ACTIVE })
        .andWhere('staff.assigned_regions @> :region', { region: `"${regionCode}"` })
        .getMany();
    }
    return Array.from(this.inMemoryStaff.values()).filter(
      (s) => s.status === StaffStatusEnum.ACTIVE && s.assignedRegions.includes(regionCode),
    );
  }

  async findBySkill(skill: string): Promise<StaffEntity[]> {
    if (this.staffRepository) {
      return this.staffRepository
        .createQueryBuilder('staff')
        .where('staff.status = :status', { status: StaffStatusEnum.ACTIVE })
        .andWhere('staff.skills @> :skill', { skill: `"${skill}"` })
        .getMany();
    }
    return Array.from(this.inMemoryStaff.values()).filter(
      (s) => s.status === StaffStatusEnum.ACTIVE && s.skills.includes(skill),
    );
  }

  async update(id: string, dto: UpdateStaffDto): Promise<StaffEntity> {
    const staff = await this.findOne(id);
    Object.assign(staff, dto);
    staff.updatedAt = new Date();

    if (this.staffRepository) {
      await this.staffRepository.save(staff);
    } else {
      this.inMemoryStaff.set(id, staff);
    }

    this.logger.log(`Staff updated: ${id}`);
    return staff;
  }

  async incrementDailyBookings(id: string): Promise<StaffEntity> {
    const staff = await this.findOne(id);
    staff.currentDailyBookings += 1;
    staff.updatedAt = new Date();

    if (this.staffRepository) {
      await this.staffRepository.save(staff);
    } else {
      this.inMemoryStaff.set(id, staff);
    }

    return staff;
  }

  async remove(id: string): Promise<void> {
    const staff = await this.findOne(id);

    if (this.staffRepository) {
      await this.staffRepository.remove(staff);
    } else {
      this.inMemoryStaff.delete(id);
    }

    this.logger.log(`Staff deleted: ${id}`);
  }
}
