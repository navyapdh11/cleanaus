import { Injectable, NotFoundException, Optional, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerEntity, CustomerTierEnum, CustomerStatusEnum } from './entities/customer.entity';
import { CreateCustomerDto, UpdateCustomerDto, AddLoyaltyPointsDto } from './dto/customer.dto';

@Injectable()
export class CustomersService implements OnModuleInit {
  private readonly logger = new Logger(CustomersService.name);
  private inMemoryCustomers: Map<string, CustomerEntity> = new Map();

  constructor(
    @Optional() @InjectRepository(CustomerEntity)
    private customerRepository?: Repository<CustomerEntity>,
  ) {}

  async onModuleInit() {
    await this.seedDefaultCustomers();
  }

  private async seedDefaultCustomers() {
    const defaultCustomers: Omit<CustomerEntity, 'createdAt' | 'updatedAt'>[] = [
      {
        id: 'cust-001',
        userId: 'user-001',
        firstName: 'Alice',
        lastName: 'Thompson',
        email: 'alice.t@example.com',
        phone: '+61412345101',
        status: CustomerStatusEnum.ACTIVE,
        tier: CustomerTierEnum.GOLD,
        totalBookings: 32,
        completedBookings: 30,
        cancelledBookings: 2,
        totalSpent: 4800,
        loyaltyPoints: 3200,
        defaultAddress: { street: '42 George St', suburb: 'Sydney', state: 'NSW', postcode: '2000' },
        preferences: { ecoFriendly: true, preferredTime: 'morning', focusAreas: ['kitchen', 'bathroom'] },
        communicationPreferences: { email: true, sms: true, push: false },
        referralCode: 'ALICE2026',
        referredBy: null,
        lastBookingAt: new Date('2026-04-01'),
        churnRiskScore: 0.05,
        notes: 'Prefers eco-friendly products. Has a cat.',
      },
      {
        id: 'cust-002',
        userId: 'user-002',
        firstName: 'Robert',
        lastName: 'Kim',
        email: 'robert.kim@example.com',
        phone: '+61412345102',
        status: CustomerStatusEnum.ACTIVE,
        tier: CustomerTierEnum.SILVER,
        totalBookings: 18,
        completedBookings: 17,
        cancelledBookings: 1,
        totalSpent: 2700,
        loyaltyPoints: 1350,
        defaultAddress: { street: '15 Collins St', suburb: 'Melbourne', state: 'VIC', postcode: '3000' },
        preferences: { ecoFriendly: false, preferredTime: 'afternoon', focusAreas: ['office', 'kitchen'] },
        communicationPreferences: { email: true, sms: false, push: true },
        referralCode: 'ROBK2026',
        referredBy: 'ALICE2026',
        lastBookingAt: new Date('2026-03-28'),
        churnRiskScore: 0.15,
        notes: 'Commercial client - office cleaning contract',
      },
      {
        id: 'cust-003',
        userId: null,
        firstName: 'Maria',
        lastName: 'Santos',
        email: 'maria.s@example.com',
        phone: '+61412345103',
        status: CustomerStatusEnum.ACTIVE,
        tier: CustomerTierEnum.BRONZE,
        totalBookings: 5,
        completedBookings: 5,
        cancelledBookings: 0,
        totalSpent: 600,
        loyaltyPoints: 300,
        defaultAddress: { street: '88 Queen St', suburb: 'Brisbane', state: 'QLD', postcode: '4000' },
        preferences: { ecoFriendly: true },
        communicationPreferences: { email: true, sms: true, push: true },
        referralCode: 'MARIA2026',
        referredBy: null,
        lastBookingAt: new Date('2026-03-15'),
        churnRiskScore: 0.25,
        notes: null,
      },
    ];

    for (const cust of defaultCustomers) {
      if (!this.inMemoryCustomers.has(cust.id)) {
        this.inMemoryCustomers.set(cust.id, {
          ...cust,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as CustomerEntity);
      }
    }
    this.logger.log(`Seeded ${defaultCustomers.length} customers`);
  }

  async create(dto: CreateCustomerDto): Promise<CustomerEntity> {
    const entity = this.customerRepository
      ? this.customerRepository.create({
          ...dto,
          status: CustomerStatusEnum.ACTIVE,
          tier: CustomerTierEnum.BRONZE,
          totalBookings: 0,
          completedBookings: 0,
          cancelledBookings: 0,
          totalSpent: 0,
          loyaltyPoints: 0,
          preferences: {},
          communicationPreferences: { email: true, sms: false, push: false },
          referralCode: `${dto.firstName.substring(0, 3).toUpperCase()}${Date.now().toString().slice(-4)}`,
        })
      : ({
          id: `cust-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          ...dto,
          status: CustomerStatusEnum.ACTIVE,
          tier: CustomerTierEnum.BRONZE,
          totalBookings: 0,
          completedBookings: 0,
          cancelledBookings: 0,
          totalSpent: 0,
          loyaltyPoints: 0,
          preferences: {},
          communicationPreferences: { email: true, sms: false, push: false },
          referralCode: `${dto.firstName.substring(0, 3).toUpperCase()}${Date.now().toString().slice(-4)}`,
          defaultAddress: null,
          referredBy: null,
          lastBookingAt: null,
          churnRiskScore: 0,
          notes: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as unknown as CustomerEntity);

    if (entity && this.customerRepository) {
      await this.customerRepository.save(entity);
    } else {
      this.inMemoryCustomers.set(entity.id, entity);
    }

    this.logger.log(`Customer created: ${entity.id}`);
    return entity;
  }

  async findAll(): Promise<CustomerEntity[]> {
    if (this.customerRepository) {
      return this.customerRepository.find();
    }
    return Array.from(this.inMemoryCustomers.values());
  }

  async findOne(id: string): Promise<CustomerEntity> {
    const customer = this.customerRepository
      ? await this.customerRepository.findOne({ where: { id } })
      : this.inMemoryCustomers.get(id);

    if (!customer) {
      throw new NotFoundException(`Customer ${id} not found`);
    }
    return customer;
  }

  async findByEmail(email: string): Promise<CustomerEntity> {
    if (this.customerRepository) {
      const customer = await this.customerRepository.findOne({ where: { email } });
      if (!customer) throw new NotFoundException(`Customer with email ${email} not found`);
      return customer;
    }
    const customer = Array.from(this.inMemoryCustomers.values()).find((c) => c.email === email);
    if (!customer) throw new NotFoundException(`Customer with email ${email} not found`);
    return customer;
  }

  async update(id: string, dto: UpdateCustomerDto): Promise<CustomerEntity> {
    const customer = await this.findOne(id);
    Object.assign(customer, dto);
    customer.updatedAt = new Date();

    if (this.customerRepository) {
      await this.customerRepository.save(customer);
    } else {
      this.inMemoryCustomers.set(id, customer);
    }

    this.logger.log(`Customer updated: ${id}`);
    return customer;
  }

  async addLoyaltyPoints(id: string, dto: AddLoyaltyPointsDto): Promise<CustomerEntity> {
    const customer = await this.findOne(id);
    customer.loyaltyPoints += dto.points;
    customer.updatedAt = new Date();

    // Auto-upgrade tier based on points
    customer.tier = this.calculateTier(customer.loyaltyPoints);

    if (this.customerRepository) {
      await this.customerRepository.save(customer);
    } else {
      this.inMemoryCustomers.set(id, customer);
    }

    this.logger.log(`Added ${dto.points} points to customer ${id}. New total: ${customer.loyaltyPoints}`);
    return customer;
  }

  async recordBooking(id: string, amount: number): Promise<CustomerEntity> {
    const customer = await this.findOne(id);
    customer.totalBookings += 1;
    customer.totalSpent += amount;
    customer.lastBookingAt = new Date();
    customer.updatedAt = new Date();

    // Award loyalty points (10 points per dollar)
    customer.loyaltyPoints += Math.floor(amount / 10);
    customer.tier = this.calculateTier(customer.loyaltyPoints);

    if (this.customerRepository) {
      await this.customerRepository.save(customer);
    } else {
      this.inMemoryCustomers.set(id, customer);
    }

    return customer;
  }

  async recordCompletion(id: string): Promise<CustomerEntity> {
    const customer = await this.findOne(id);
    customer.completedBookings += 1;
    customer.updatedAt = new Date();

    if (this.customerRepository) {
      await this.customerRepository.save(customer);
    } else {
      this.inMemoryCustomers.set(id, customer);
    }

    return customer;
  }

  async recordCancellation(id: string): Promise<CustomerEntity> {
    const customer = await this.findOne(id);
    customer.cancelledBookings += 1;
    customer.updatedAt = new Date();

    // Increase churn risk
    customer.churnRiskScore = Math.min(1, customer.churnRiskScore + 0.1);

    if (this.customerRepository) {
      await this.customerRepository.save(customer);
    } else {
      this.inMemoryCustomers.set(id, customer);
    }

    return customer;
  }

  private calculateTier(points: number): CustomerTierEnum {
    if (points >= 15000) return CustomerTierEnum.PLATINUM;
    if (points >= 5000) return CustomerTierEnum.GOLD;
    if (points >= 1000) return CustomerTierEnum.SILVER;
    return CustomerTierEnum.BRONZE;
  }

  async remove(id: string): Promise<void> {
    const customer = await this.findOne(id);

    if (this.customerRepository) {
      await this.customerRepository.remove(customer);
    } else {
      this.inMemoryCustomers.delete(id);
    }

    this.logger.log(`Customer deleted: ${id}`);
  }
}
