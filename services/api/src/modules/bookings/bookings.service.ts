import { Injectable, NotFoundException, BadRequestException, Optional, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingEntity, BookingStatusEnum, BookingPriorityEnum } from './entities/booking.entity';
import { CreateBookingDto, UpdateBookingDto, CancelBookingDto } from './dto/booking.dto';

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);
  private inMemoryBookings: Map<string, BookingEntity> = new Map();

  constructor(
    @Optional() @InjectRepository(BookingEntity)
    private bookingRepository?: Repository<BookingEntity>,
  ) {}

  async create(dto: CreateBookingDto): Promise<BookingEntity> {
    const booking = this.bookingRepository
      ? this.bookingRepository.create({
          customerId: dto.customerId,
          serviceId: dto.serviceId || null,
          serviceDetails: {},
          status: BookingStatusEnum.PENDING,
          priority: dto.priority || BookingPriorityEnum.STANDARD,
          scheduledDate: new Date(dto.scheduledDate),
          startTime: dto.startTime,
          endTime: null,
          totalAmount: 0,
          propertyDetails: dto.propertyDetails as any,
          customerPreferences: dto.preferences || null,
          specialInstructions: dto.specialInstructions || null,
          regionInfo: dto.regionInfo as any,
          paymentIntentId: null,
        })
      : ({
          id: `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          customerId: dto.customerId,
          serviceId: dto.serviceId || null,
          serviceDetails: {},
          status: BookingStatusEnum.PENDING,
          priority: dto.priority || BookingStatusEnum.PENDING,
          scheduledDate: new Date(dto.scheduledDate),
          startTime: dto.startTime,
          endTime: null,
          totalAmount: 0,
          propertyDetails: dto.propertyDetails as any,
          customerPreferences: dto.preferences || null,
          specialInstructions: dto.specialInstructions || null,
          regionInfo: dto.regionInfo as any,
          paymentIntentId: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as BookingEntity);

    if (booking && this.bookingRepository) {
      await this.bookingRepository.save(booking);
    } else {
      this.inMemoryBookings.set(booking.id, booking);
    }

    this.logger.log(`Booking created: ${booking.id}`);
    return booking;
  }

  async findAll(): Promise<BookingEntity[]> {
    if (this.bookingRepository) {
      return this.bookingRepository.find({ order: { createdAt: 'DESC' } });
    }
    return Array.from(this.inMemoryBookings.values());
  }

  async findOne(id: string): Promise<BookingEntity> {
    const booking = this.bookingRepository
      ? await this.bookingRepository.findOne({ where: { id } })
      : this.inMemoryBookings.get(id);

    if (!booking) {
      throw new NotFoundException(`Booking ${id} not found`);
    }
    return booking;
  }

  async findByCustomerId(customerId: string): Promise<BookingEntity[]> {
    if (this.bookingRepository) {
      return this.bookingRepository.find({
        where: { customerId },
        order: { createdAt: 'DESC' },
      });
    }
    return Array.from(this.inMemoryBookings.values()).filter(
      (b) => b.customerId === customerId,
    );
  }

  async findByStatus(status: BookingStatusEnum): Promise<BookingEntity[]> {
    if (this.bookingRepository) {
      return this.bookingRepository.find({
        where: { status },
        order: { scheduledDate: 'ASC' },
      });
    }
    return Array.from(this.inMemoryBookings.values()).filter(
      (b) => b.status === status,
    );
  }

  async update(id: string, dto: UpdateBookingDto): Promise<BookingEntity> {
    const booking = await this.findOne(id);

    if (dto.scheduledDate) booking.scheduledDate = new Date(dto.scheduledDate);
    if (dto.startTime) booking.startTime = dto.startTime;
    if (dto.priority) booking.priority = dto.priority;
    if (dto.propertyDetails) booking.propertyDetails = dto.propertyDetails as any;
    if (dto.customerPreferences) booking.customerPreferences = dto.customerPreferences;
    if (dto.specialInstructions !== undefined) booking.specialInstructions = dto.specialInstructions;
    booking.updatedAt = new Date();

    if (this.bookingRepository) {
      await this.bookingRepository.save(booking);
    } else {
      this.inMemoryBookings.set(id, booking);
    }

    this.logger.log(`Booking updated: ${id}`);
    return booking;
  }

  async updateStatus(id: string, status: BookingStatusEnum): Promise<BookingEntity> {
    const booking = await this.findOne(id);
    const previousStatus = booking.status;
    booking.status = status;
    booking.updatedAt = new Date();

    if (status === BookingStatusEnum.COMPLETED) {
      booking.completedAt = new Date();
    }
    if (status === BookingStatusEnum.CANCELLED) {
      booking.cancelledAt = new Date();
    }

    if (this.bookingRepository) {
      await this.bookingRepository.save(booking);
    } else {
      this.inMemoryBookings.set(id, booking);
    }

    this.logger.log(`Booking ${id} status changed: ${previousStatus} -> ${status}`);
    return booking;
  }

  async cancel(id: string, dto: CancelBookingDto): Promise<BookingEntity> {
    const booking = await this.findOne(id);

    if (
      booking.status === BookingStatusEnum.COMPLETED ||
      booking.status === BookingStatusEnum.CANCELLED
    ) {
      throw new BadRequestException(
        `Cannot cancel booking with status: ${booking.status}`,
      );
    }

    booking.status = BookingStatusEnum.CANCELLED;
    booking.cancellationReason = dto.reason;
    booking.cancelledAt = new Date();
    booking.updatedAt = new Date();

    if (this.bookingRepository) {
      await this.bookingRepository.save(booking);
    } else {
      this.inMemoryBookings.set(id, booking);
    }

    this.logger.log(`Booking cancelled: ${id}`);
    return booking;
  }

  async remove(id: string): Promise<void> {
    const booking = await this.findOne(id);

    if (this.bookingRepository) {
      await this.bookingRepository.remove(booking);
    } else {
      this.inMemoryBookings.delete(id);
    }

    this.logger.log(`Booking deleted: ${id}`);
  }
}
