import { Injectable, NotFoundException, Optional, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceEntity, ServiceCategoryEnum, ServiceTypeEnum } from './entities/service.entity';
import { CreateServiceDto, UpdateServiceDto } from './dto/service.dto';

@Injectable()
export class ServicesService {
  private readonly logger = new Logger(ServicesService.name);
  private inMemoryServices: Map<string, ServiceEntity> = new Map();

  constructor(
    @Optional() @InjectRepository(ServiceEntity)
    private serviceRepository?: Repository<ServiceEntity>,
  ) {
    // Seed default cleaning service catalog in demo mode
    this.seedDefaultServices();
  }

  private async seedDefaultServices() {
    const defaultServices: Omit<ServiceEntity, 'createdAt' | 'updatedAt'>[] = [
      {
        id: 'svc-regular-house',
        type: ServiceTypeEnum.REGULAR_CLEANING,
        category: ServiceCategoryEnum.RESIDENTIAL,
        name: 'Regular House Cleaning',
        description: 'Standard recurring cleaning for homes and apartments',
        basePrice: 120,
        pricePerHour: 45,
        estimatedDurationHours: 2.5,
        includedTasks: ['Dusting', 'Vacuuming', 'Mopping', 'Kitchen sanitizing', 'Bathroom cleaning'],
        availableRegions: ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'],
        addOnServiceIds: ['svc-oven-clean', 'svc-window-clean'],
        isActive: true,
        ecoFriendly: false,
        requiresSpecialEquipment: false,
      },
      {
        id: 'svc-deep-clean',
        type: ServiceTypeEnum.DEEP_CLEANING,
        category: ServiceCategoryEnum.RESIDENTIAL,
        name: 'Deep Cleaning',
        description: 'Thorough top-to-bottom cleaning for homes that need extra attention',
        basePrice: 280,
        pricePerHour: 55,
        estimatedDurationHours: 5,
        includedTasks: ['All regular tasks', 'Inside cabinets', 'Behind appliances', 'Baseboard cleaning', 'Light fixture dusting', 'Window sills'],
        availableRegions: ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'ACT'],
        addOnServiceIds: ['svc-carpet-clean', 'svc-oven-clean', 'svc-window-clean'],
        isActive: true,
        ecoFriendly: false,
        requiresSpecialEquipment: false,
      },
      {
        id: 'svc-end-of-lease',
        type: ServiceTypeEnum.END_OF_LEASE_CLEANING,
        category: ServiceCategoryEnum.RESIDENTIAL,
        name: 'End of Lease Cleaning',
        description: 'Comprehensive bond cleaning to ensure full bond return',
        basePrice: 350,
        pricePerHour: 60,
        estimatedDurationHours: 6,
        includedTasks: ['Full deep clean', 'Oven cleaning', 'Window cleaning (interior)', 'Carpet steam clean', 'Wall spot cleaning', 'Garage sweep'],
        availableRegions: ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'],
        addOnServiceIds: ['svc-carpet-clean', 'svc-pressure-wash'],
        isActive: true,
        ecoFriendly: false,
        requiresSpecialEquipment: true,
      },
      {
        id: 'svc-office-clean',
        type: ServiceTypeEnum.OFFICE_CLEANING,
        category: ServiceCategoryEnum.COMMERCIAL,
        name: 'Office Cleaning',
        description: 'Professional office and workspace cleaning services',
        basePrice: 200,
        pricePerHour: 50,
        estimatedDurationHours: 4,
        includedTasks: ['Desk sanitizing', 'Floor vacuuming/mopping', 'Kitchen/breakroom cleaning', 'Restroom sanitizing', 'Trash removal', 'Glass surface cleaning'],
        availableRegions: ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'ACT'],
        addOnServiceIds: ['svc-carpet-clean', 'svc-window-clean'],
        isActive: true,
        ecoFriendly: false,
        requiresSpecialEquipment: false,
      },
      {
        id: 'svc-carpet-clean',
        type: ServiceTypeEnum.CARPET_CLEANING,
        category: ServiceCategoryEnum.RESIDENTIAL,
        name: 'Carpet Steam Cleaning',
        description: 'Deep steam cleaning for carpets and rugs',
        basePrice: 80,
        pricePerHour: 65,
        estimatedDurationHours: 1.5,
        includedTasks: ['Pre-vacuum', 'Steam cleaning', 'Stain treatment', 'Deodorizing'],
        availableRegions: ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'ACT'],
        addOnServiceIds: [],
        isActive: true,
        ecoFriendly: true,
        requiresSpecialEquipment: true,
      },
      {
        id: 'svc-window-clean',
        type: ServiceTypeEnum.WINDOW_CLEANING,
        category: ServiceCategoryEnum.RESIDENTIAL,
        name: 'Window Cleaning',
        description: 'Interior and exterior window cleaning',
        basePrice: 60,
        pricePerHour: 50,
        estimatedDurationHours: 1.5,
        includedTasks: ['Interior glass cleaning', 'Exterior glass cleaning', 'Frame wiping', 'Sill dusting'],
        availableRegions: ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT'],
        addOnServiceIds: [],
        isActive: true,
        ecoFriendly: true,
        requiresSpecialEquipment: false,
      },
      {
        id: 'svc-airbnb-turnover',
        type: ServiceTypeEnum.AIRBNB_TURNOVER,
        category: ServiceCategoryEnum.SPECIALIZED,
        name: 'Airbnb/Vacation Rental Turnover',
        description: 'Quick turnaround cleaning between guests',
        basePrice: 150,
        pricePerHour: 55,
        estimatedDurationHours: 2.5,
        includedTasks: ['Linen change', 'Bathroom sanitizing', 'Kitchen reset', 'Floor cleaning', 'Restock essentials', 'Damage check'],
        availableRegions: ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'ACT'],
        addOnServiceIds: ['svc-laundry', 'svc-window-clean'],
        isActive: true,
        ecoFriendly: false,
        requiresSpecialEquipment: false,
      },
      {
        id: 'svc-eco-clean',
        type: ServiceTypeEnum.ECO_FRIENDLY_CLEANING,
        category: ServiceCategoryEnum.SPECIALIZED,
        name: 'Eco-Friendly Cleaning',
        description: 'Environmentally friendly cleaning with organic products',
        basePrice: 160,
        pricePerHour: 50,
        estimatedDurationHours: 3,
        includedTasks: ['Organic product cleaning', 'Non-toxic sanitizing', 'Natural deodorizing', 'Eco-friendly floor care'],
        availableRegions: ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'ACT'],
        addOnServiceIds: [],
        isActive: true,
        ecoFriendly: true,
        requiresSpecialEquipment: false,
      },
      {
        id: 'svc-oven-clean',
        type: ServiceTypeEnum.OVEN_CLEANING,
        category: ServiceCategoryEnum.ADD_ON,
        name: 'Oven Cleaning (Add-On)',
        description: 'Deep cleaning for ovens and stovetops',
        basePrice: 45,
        pricePerHour: 50,
        estimatedDurationHours: 1,
        includedTasks: ['Interior degreasing', 'Rack cleaning', 'Glass door cleaning', 'Exterior polishing'],
        availableRegions: ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'],
        addOnServiceIds: [],
        isActive: true,
        ecoFriendly: false,
        requiresSpecialEquipment: false,
      },
      {
        id: 'svc-pressure-wash',
        type: ServiceTypeEnum.PRESSURE_WASHING,
        category: ServiceCategoryEnum.RESIDENTIAL,
        name: 'Pressure Washing',
        description: 'Outdoor pressure washing for driveways, patios, and walls',
        basePrice: 180,
        pricePerHour: 70,
        estimatedDurationHours: 2.5,
        includedTasks: ['Driveway cleaning', 'Patio cleaning', 'Exterior wall spot cleaning', 'Gutter exterior rinse'],
        availableRegions: ['NSW', 'VIC', 'QLD', 'WA', 'SA'],
        addOnServiceIds: [],
        isActive: true,
        ecoFriendly: false,
        requiresSpecialEquipment: true,
      },
    ];

    for (const svc of defaultServices) {
      if (!this.inMemoryServices.has(svc.id)) {
        this.inMemoryServices.set(svc.id, {
          ...svc,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as ServiceEntity);
      }
    }
    this.logger.log(`Seeded ${defaultServices.length} default services`);
  }

  async create(dto: CreateServiceDto): Promise<ServiceEntity> {
    const entity = this.serviceRepository
      ? this.serviceRepository.create({
          ...dto,
          includedTasks: dto.includedTasks || [],
          availableRegions: dto.availableRegions || [],
          addOnServiceIds: dto.addOnServiceIds || [],
        })
      : ({
          id: `svc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          ...dto,
          includedTasks: dto.includedTasks || [],
          availableRegions: dto.availableRegions || [],
          addOnServiceIds: dto.addOnServiceIds || [],
          createdAt: new Date(),
          updatedAt: new Date(),
        } as ServiceEntity);

    if (entity && this.serviceRepository) {
      await this.serviceRepository.save(entity);
    } else {
      this.inMemoryServices.set(entity.id, entity);
    }

    this.logger.log(`Service created: ${entity.id}`);
    return entity;
  }

  async findAll(): Promise<ServiceEntity[]> {
    if (this.serviceRepository) {
      return this.serviceRepository.find({ where: { isActive: true } });
    }
    return Array.from(this.inMemoryServices.values()).filter((s) => s.isActive);
  }

  async findAllActive(): Promise<ServiceEntity[]> {
    return this.findAll();
  }

  async findOne(id: string): Promise<ServiceEntity> {
    const service = this.serviceRepository
      ? await this.serviceRepository.findOne({ where: { id } })
      : this.inMemoryServices.get(id);

    if (!service) {
      throw new NotFoundException(`Service ${id} not found`);
    }
    return service;
  }

  async findByCategory(category: ServiceCategoryEnum): Promise<ServiceEntity[]> {
    if (this.serviceRepository) {
      return this.serviceRepository.find({ where: { category, isActive: true } });
    }
    return Array.from(this.inMemoryServices.values()).filter(
      (s) => s.category === category && s.isActive,
    );
  }

  async findByRegion(regionCode: string): Promise<ServiceEntity[]> {
    if (this.serviceRepository) {
      return this.serviceRepository
        .createQueryBuilder('service')
        .where('service.isActive = :isActive', { isActive: true })
        .andWhere('service.available_regions @> :region', { region: `"${regionCode}"` })
        .getMany();
    }
    return Array.from(this.inMemoryServices.values()).filter(
      (s) => s.isActive && s.availableRegions.includes(regionCode),
    );
  }

  async update(id: string, dto: UpdateServiceDto): Promise<ServiceEntity> {
    const service = await this.findOne(id);

    Object.assign(service, dto);
    service.updatedAt = new Date();

    if (this.serviceRepository) {
      await this.serviceRepository.save(service);
    } else {
      this.inMemoryServices.set(id, service);
    }

    this.logger.log(`Service updated: ${id}`);
    return service;
  }

  async remove(id: string): Promise<void> {
    const service = await this.findOne(id);

    if (this.serviceRepository) {
      await this.serviceRepository.remove(service);
    } else {
      this.inMemoryServices.delete(id);
    }

    this.logger.log(`Service deleted: ${id}`);
  }
}
