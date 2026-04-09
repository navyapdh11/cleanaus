import { Test, TestingModule } from '@nestjs/testing';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/customer.dto';
import { CustomerTierEnum, CustomerStatusEnum } from './entities/customer.entity';

describe('CustomersService', () => {
  let service: CustomersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomersService],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all customers', async () => {
      const customers = await service.findAll();
      expect(Array.isArray(customers)).toBe(true);
      expect(customers.length).toBeGreaterThan(0);
    });
  });

  describe('findOne', () => {
    it('should return a customer by id', async () => {
      const customer = await service.findOne('cust-001');
      expect(customer).toBeDefined();
      expect(customer.id).toBe('cust-001');
      expect(customer.firstName).toBe('Alice');
    });

    it('should throw NotFoundException for non-existent customer', async () => {
      await expect(service.findOne('non-existent'))
        .rejects
        .toThrow('not found');
    });
  });

  describe('findByEmail', () => {
    it('should return a customer by email', async () => {
      const customer = await service.findByEmail('alice.t@example.com');
      expect(customer).toBeDefined();
      expect(customer.email).toBe('alice.t@example.com');
    });

    it('should throw NotFoundException for non-existent email', async () => {
      await expect(service.findByEmail('nonexistent@example.com'))
        .rejects
        .toThrow('not found');
    });
  });

  describe('create', () => {
    it('should create a new customer', async () => {
      const createDto: CreateCustomerDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+61412345678',
      };

      const customer = await service.create(createDto);

      expect(customer).toBeDefined();
      expect(customer.id).toBeDefined();
      expect(customer.firstName).toBe('John');
      expect(customer.status).toBe(CustomerStatusEnum.ACTIVE);
      expect(customer.tier).toBe(CustomerTierEnum.BRONZE);
      expect(customer.loyaltyPoints).toBe(0);
    });
  });

  describe('update', () => {
    it('should update customer information', async () => {
      const updated = await service.update('cust-001', {
        firstName: 'Updated',
      });

      expect(updated.firstName).toBe('Updated');
      expect(updated.updatedAt).toBeDefined();
    });
  });

  describe('addLoyaltyPoints', () => {
    it('should add loyalty points to a customer', async () => {
      const customer = await service.findOne('cust-001');
      const originalPoints = customer.loyaltyPoints;

      const updated = await service.addLoyaltyPoints('cust-001', { points: 500, reason: 'Test points' });

      expect(updated.loyaltyPoints).toBe(originalPoints + 500);
    });

    it('should upgrade tier based on points', async () => {
      // Create a new customer with 0 points
      const customer = await service.create({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        phone: '+61412345000',
      });

      // Add enough points to reach SILVER tier (1000+ points)
      const updated = await service.addLoyaltyPoints(customer.id, { points: 1500, reason: 'Initial loyalty bonus' });

      expect(updated.tier).toBe(CustomerTierEnum.SILVER);
    });
  });

  describe('recordBooking', () => {
    it('should record a booking for a customer', async () => {
      const customer = await service.findOne('cust-001');
      const originalBookings = customer.totalBookings;
      const originalSpent = customer.totalSpent;

      const updated = await service.recordBooking('cust-001', 150);

      expect(updated.totalBookings).toBe(originalBookings + 1);
      expect(updated.totalSpent).toBe(originalSpent + 150);
      expect(updated.lastBookingAt).toBeDefined();
    });
  });

  describe('recordCompletion', () => {
    it('should increment completed bookings', async () => {
      const customer = await service.findOne('cust-001');
      const originalCompleted = customer.completedBookings;

      const updated = await service.recordCompletion('cust-001');

      expect(updated.completedBookings).toBe(originalCompleted + 1);
    });
  });

  describe('recordCancellation', () => {
    it('should increment cancelled bookings and increase churn risk', async () => {
      const customer = await service.findOne('cust-001');
      const originalCancelled = customer.cancelledBookings;
      const originalChurn = customer.churnRiskScore;

      const updated = await service.recordCancellation('cust-001');

      expect(updated.cancelledBookings).toBe(originalCancelled + 1);
      expect(updated.churnRiskScore).toBeGreaterThan(originalChurn);
    });
  });
});
