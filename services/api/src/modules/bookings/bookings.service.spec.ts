import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from './bookings.service';
import { BookingStatusEnum, BookingPriorityEnum } from './entities/booking.entity';

describe('BookingsService', () => {
  let service: BookingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookingsService],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a booking successfully', async () => {
      const createDto = {
        customerId: 'cust-001',
        serviceId: 'svc-regular-house',
        scheduledDate: '2026-04-10',
        startTime: '09:00',
        priority: BookingPriorityEnum.STANDARD,
        propertyDetails: {
          propertyType: 'house',
          bedrooms: 3,
          bathrooms: 2,
        },
        regionInfo: {
          regionCode: 'NSW',
          serviceArea: 'Sydney CBD',
          postcode: '2000',
        },
      };

      const booking = await service.create(createDto as any);

      expect(booking).toBeDefined();
      expect(booking.id).toBeDefined();
      expect(booking.customerId).toBe('cust-001');
      expect(booking.status).toBe(BookingStatusEnum.PENDING);
      expect(booking.scheduledDate).toBeInstanceOf(Date);
    });

    it('should set default priority to STANDARD if not provided', async () => {
      const createDto = {
        customerId: 'cust-001',
        scheduledDate: '2026-04-10',
        startTime: '09:00',
        propertyDetails: {
          propertyType: 'apartment',
          bedrooms: 2,
          bathrooms: 1,
        },
        regionInfo: {
          regionCode: 'NSW',
          serviceArea: 'Sydney CBD',
          postcode: '2000',
        },
      };

      const booking = await service.create(createDto as any);
      expect(booking.priority).toBe(BookingPriorityEnum.STANDARD);
    });
  });

  describe('findAll', () => {
    it('should return an array of bookings', async () => {
      const bookings = await service.findAll();
      expect(Array.isArray(bookings)).toBe(true);
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException for non-existent booking', async () => {
      await expect(service.findOne('non-existent-id'))
        .rejects
        .toThrow('not found');
    });
  });

  describe('findByCustomerId', () => {
    it('should return bookings for a specific customer', async () => {
      // Create a booking first
      await service.create({
        customerId: 'cust-test',
        scheduledDate: '2026-04-10',
        startTime: '09:00',
        propertyDetails: {
          propertyType: 'house',
          bedrooms: 2,
          bathrooms: 1,
        },
        regionInfo: {
          regionCode: 'NSW',
          serviceArea: 'Sydney CBD',
          postcode: '2000',
        },
      } as any);

      const bookings = await service.findByCustomerId('cust-test');
      expect(Array.isArray(bookings)).toBe(true);
      bookings.forEach(booking => {
        expect(booking.customerId).toBe('cust-test');
      });
    });
  });

  describe('updateStatus', () => {
    it('should update booking status', async () => {
      const booking = await service.create({
        customerId: 'cust-001',
        scheduledDate: '2026-04-10',
        startTime: '09:00',
        propertyDetails: {
          propertyType: 'house',
          bedrooms: 3,
          bathrooms: 2,
        },
        regionInfo: {
          regionCode: 'NSW',
          serviceArea: 'Sydney CBD',
          postcode: '2000',
        },
      } as any);

      const updated = await service.updateStatus(booking.id, BookingStatusEnum.CONFIRMED);
      expect(updated.status).toBe(BookingStatusEnum.CONFIRMED);
    });

    it('should set completedAt when status is COMPLETED', async () => {
      const booking = await service.create({
        customerId: 'cust-001',
        scheduledDate: '2026-04-10',
        startTime: '09:00',
        propertyDetails: {
          propertyType: 'house',
          bedrooms: 3,
          bathrooms: 2,
        },
        regionInfo: {
          regionCode: 'NSW',
          serviceArea: 'Sydney CBD',
          postcode: '2000',
        },
      } as any);

      const updated = await service.updateStatus(booking.id, BookingStatusEnum.COMPLETED);
      expect(updated.completedAt).toBeDefined();
    });
  });

  describe('cancel', () => {
    it('should cancel a booking', async () => {
      const booking = await service.create({
        customerId: 'cust-001',
        scheduledDate: '2026-04-10',
        startTime: '09:00',
        propertyDetails: {
          propertyType: 'house',
          bedrooms: 3,
          bathrooms: 2,
        },
        regionInfo: {
          regionCode: 'NSW',
          serviceArea: 'Sydney CBD',
          postcode: '2000',
        },
      } as any);

      const cancelled = await service.cancel(booking.id, { reason: 'Customer request' });
      expect(cancelled.status).toBe(BookingStatusEnum.CANCELLED);
      expect(cancelled.cancellationReason).toBe('Customer request');
    });

    it('should throw if trying to cancel a completed booking', async () => {
      const booking = await service.create({
        customerId: 'cust-001',
        scheduledDate: '2026-04-10',
        startTime: '09:00',
        propertyDetails: {
          propertyType: 'house',
          bedrooms: 3,
          bathrooms: 2,
        },
        regionInfo: {
          regionCode: 'NSW',
          serviceArea: 'Sydney CBD',
          postcode: '2000',
        },
      } as any);

      await service.updateStatus(booking.id, BookingStatusEnum.COMPLETED);

      await expect(service.cancel(booking.id, { reason: 'Test' }))
        .rejects
        .toThrow('Cannot cancel booking');
    });
  });
});
