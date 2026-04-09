import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import {
  NotificationChannelEnum,
  NotificationTypeEnum,
  NotificationStatusEnum,
} from './entities/notification.entity';

describe('NotificationsService', () => {
  let service: NotificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationsService],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('send', () => {
    it('should send a notification', async () => {
      const notification = await service.send({
        customerId: 'cust-001',
        channel: NotificationChannelEnum.EMAIL,
        type: NotificationTypeEnum.GENERAL,
        subject: 'Test Notification',
        body: 'This is a test',
      });

      expect(notification).toBeDefined();
      expect(notification.customerId).toBe('cust-001');
      expect(notification.channel).toBe(NotificationChannelEnum.EMAIL);
      expect(notification.status).toBe(NotificationStatusEnum.DELIVERED);
    });

    it('should set delivery timestamps in demo mode', async () => {
      const notification = await service.send({
        customerId: 'cust-001',
        channel: NotificationChannelEnum.SMS,
        type: NotificationTypeEnum.BOOKING_CONFIRMATION,
        subject: 'Booking Confirmed',
        body: 'Your booking is confirmed',
      });

      expect(notification.sentAt).toBeDefined();
      expect(notification.deliveredAt).toBeDefined();
    });
  });

  describe('sendBookingConfirmation', () => {
    it('should send a booking confirmation email', async () => {
      const details = {
        date: '2026-04-10',
        time: '09:00',
        service: 'Regular House Cleaning',
        address: '123 Example St, Sydney NSW 2000',
      };

      const notification = await service.sendBookingConfirmation(
        'cust-001',
        'booking-001',
        details,
      );

      expect(notification).toBeDefined();
      expect(notification.type).toBe(NotificationTypeEnum.BOOKING_CONFIRMATION);
      expect(notification.channel).toBe(NotificationChannelEnum.EMAIL);
      expect(notification.bookingId).toBe('booking-001');
      expect(notification.subject).toContain('Confirmed');
    });
  });

  describe('sendBookingReminder', () => {
    it('should send a booking reminder SMS', async () => {
      const details = { time: '09:00' };

      const notification = await service.sendBookingReminder(
        'cust-001',
        'booking-001',
        details,
      );

      expect(notification).toBeDefined();
      expect(notification.type).toBe(NotificationTypeEnum.BOOKING_REMINDER);
      expect(notification.channel).toBe(NotificationChannelEnum.SMS);
      expect(notification.body).toContain('09:00');
    });
  });

  describe('sendStaffAssigned', () => {
    it('should send staff assigned notification', async () => {
      const notification = await service.sendStaffAssigned(
        'cust-001',
        'booking-001',
        'Sarah Johnson',
      );

      expect(notification).toBeDefined();
      expect(notification.type).toBe(NotificationTypeEnum.STAFF_ASSIGNED);
      expect(notification.body).toContain('Sarah Johnson');
    });
  });

  describe('sendPaymentReceived', () => {
    it('should send payment received notification', async () => {
      const notification = await service.sendPaymentReceived(
        'cust-001',
        'payment-001',
        250.0,
      );

      expect(notification).toBeDefined();
      expect(notification.type).toBe(NotificationTypeEnum.PAYMENT_RECEIVED);
      expect(notification.body).toContain('250.00');
      expect(notification.paymentId).toBe('payment-001');
    });
  });

  describe('sendReviewRequest', () => {
    it('should send a review request', async () => {
      const notification = await service.sendReviewRequest(
        'cust-001',
        'booking-001',
      );

      expect(notification).toBeDefined();
      expect(notification.type).toBe(NotificationTypeEnum.REVIEW_REQUEST);
      expect(notification.subject).toContain('⭐');
    });
  });

  describe('findAll', () => {
    it('should return all notifications', async () => {
      await service.send({
        customerId: 'cust-001',
        channel: NotificationChannelEnum.EMAIL,
        type: NotificationTypeEnum.GENERAL,
        subject: 'Test 1',
        body: 'Body 1',
      });

      await service.send({
        customerId: 'cust-002',
        channel: NotificationChannelEnum.SMS,
        type: NotificationTypeEnum.BOOKING_CONFIRMATION,
        subject: 'Test 2',
        body: 'Body 2',
      });

      const notifications = await service.findAll();
      expect(notifications.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('findByCustomerId', () => {
    it('should return notifications for a specific customer', async () => {
      await service.send({
        customerId: 'cust-specific',
        channel: NotificationChannelEnum.EMAIL,
        type: NotificationTypeEnum.GENERAL,
        subject: 'Test',
        body: 'Body',
      });

      const notifications = await service.findByCustomerId('cust-specific');
      expect(Array.isArray(notifications)).toBe(true);
      notifications.forEach((n) => {
        expect(n.customerId).toBe('cust-specific');
      });
    });

    it('should return empty array for customer with no notifications', async () => {
      const notifications = await service.findByCustomerId('cust-nonexistent');
      expect(notifications).toEqual([]);
    });
  });

  describe('findByBookingId', () => {
    it('should return notifications for a specific booking', async () => {
      await service.sendBookingConfirmation(
        'cust-001',
        'booking-specific',
        { date: '2026-04-10', time: '09:00' },
      );

      const notifications = await service.findByBookingId('booking-specific');
      expect(Array.isArray(notifications)).toBe(true);
      expect(notifications.length).toBeGreaterThan(0);
      notifications.forEach((n) => {
        expect(n.bookingId).toBe('booking-specific');
      });
    });
  });

  describe('getStats', () => {
    it('should return notification statistics', async () => {
      await service.send({
        customerId: 'cust-001',
        channel: NotificationChannelEnum.EMAIL,
        type: NotificationTypeEnum.GENERAL,
        subject: 'Test',
        body: 'Body',
      });

      const stats = await service.getStats();

      expect(stats).toBeDefined();
      expect(stats.total).toBeGreaterThan(0);
      expect(stats.delivered).toBeGreaterThan(0);
      expect(stats.byChannel).toBeDefined();
      expect(stats.byType).toBeDefined();
    });
  });

  describe('markAsDelivered', () => {
    it('should mark a notification as delivered', async () => {
      const notification = await service.send({
        customerId: 'cust-001',
        channel: NotificationChannelEnum.EMAIL,
        type: NotificationTypeEnum.GENERAL,
        subject: 'Test',
        body: 'Body',
      });

      // In demo mode it's already delivered, but test the method
      const updated = await service.markAsDelivered(notification.id);
      expect(updated.status).toBe(NotificationStatusEnum.DELIVERED);
      expect(updated.deliveredAt).toBeDefined();
    });
  });

  describe('markAsFailed', () => {
    it('should mark a notification as failed with error message', async () => {
      const notification = await service.send({
        customerId: 'cust-001',
        channel: NotificationChannelEnum.EMAIL,
        type: NotificationTypeEnum.GENERAL,
        subject: 'Test',
        body: 'Body',
      });

      const updated = await service.markAsFailed(
        notification.id,
        'SMTP connection failed',
      );

      expect(updated.status).toBe(NotificationStatusEnum.FAILED);
      expect(updated.errorMessage).toBe('SMTP connection failed');
      expect(updated.retryCount).toBe(1);
    });
  });
});
