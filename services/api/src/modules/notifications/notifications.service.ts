import { Injectable, Optional, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  NotificationEntity,
  NotificationChannelEnum,
  NotificationTypeEnum,
  NotificationStatusEnum,
} from './entities/notification.entity';
import { SendNotificationDto, NotificationStatsDto } from './dto/notification.dto';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private inMemoryNotifications: Map<string, NotificationEntity> = new Map();

  constructor(
    @Optional() @InjectRepository(NotificationEntity)
    private notificationRepository?: Repository<NotificationEntity>,
  ) {}

  async send(dto: SendNotificationDto): Promise<NotificationEntity> {
    const entity = this.notificationRepository
      ? this.notificationRepository.create({
          ...dto,
          status: NotificationStatusEnum.PENDING,
          templateData: dto.templateData || null,
          sentAt: null,
          deliveredAt: null,
          errorMessage: null,
          retryCount: 0,
          maxRetries: 3,
          externalId: null,
        })
      : ({
          id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          ...dto,
          status: NotificationStatusEnum.PENDING,
          templateData: dto.templateData || null,
          sentAt: null,
          deliveredAt: null,
          errorMessage: null,
          retryCount: 0,
          maxRetries: 3,
          externalId: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as NotificationEntity);

    if (entity && this.notificationRepository) {
      await this.notificationRepository.save(entity);
    } else {
      this.inMemoryNotifications.set(entity.id, entity);
    }

    // Simulate sending (in production this would connect to SendGrid/Twilio/FCM)
    await this.simulateDelivery(entity);

    this.logger.log(`Notification queued: ${entity.id} (${entity.channel}) to ${entity.customerId}`);
    return entity;
  }

  /**
   * Send a booking confirmation notification
   */
  async sendBookingConfirmation(customerId: string, bookingId: string, details: Record<string, any>): Promise<NotificationEntity> {
    return this.send({
      customerId,
      channel: NotificationChannelEnum.EMAIL,
      type: NotificationTypeEnum.BOOKING_CONFIRMATION,
      subject: 'Your Cleaning Booking is Confirmed! 🧹',
      body: this.buildBookingConfirmationBody(details),
      templateData: details,
      bookingId,
    });
  }

  /**
   * Send a booking reminder notification
   */
  async sendBookingReminder(customerId: string, bookingId: string, details: Record<string, any>): Promise<NotificationEntity> {
    return this.send({
      customerId,
      channel: NotificationChannelEnum.SMS,
      type: NotificationTypeEnum.BOOKING_REMINDER,
      subject: 'Reminder: Cleaning Tomorrow',
      body: `Hi! Your cleaning is scheduled for tomorrow at ${details.time}. See you then!`,
      templateData: details,
      bookingId,
    });
  }

  /**
   * Send a staff assigned notification
   */
  async sendStaffAssigned(customerId: string, bookingId: string, staffName: string): Promise<NotificationEntity> {
    return this.send({
      customerId,
      channel: NotificationChannelEnum.EMAIL,
      type: NotificationTypeEnum.STAFF_ASSIGNED,
      subject: 'Your Cleaning Team Has Been Assigned',
      body: `Great news! ${staffName} has been assigned to your cleaning booking.`,
      templateData: { staffName, bookingId },
      bookingId,
    });
  }

  /**
   * Send a payment received notification
   */
  async sendPaymentReceived(customerId: string, paymentId: string, amount: number): Promise<NotificationEntity> {
    return this.send({
      customerId,
      channel: NotificationChannelEnum.EMAIL,
      type: NotificationTypeEnum.PAYMENT_RECEIVED,
      subject: 'Payment Received',
      body: `We've received your payment of $${amount.toFixed(2)} AUD. Thank you!`,
      templateData: { amount, currency: 'AUD' },
      paymentId,
    });
  }

  /**
   * Send a review request notification
   */
  async sendReviewRequest(customerId: string, bookingId: string): Promise<NotificationEntity> {
    return this.send({
      customerId,
      channel: NotificationChannelEnum.EMAIL,
      type: NotificationTypeEnum.REVIEW_REQUEST,
      subject: 'How Was Your Cleaning Experience? ⭐',
      body: 'We hope you loved your clean space! Please take a moment to rate your experience.',
      templateData: { bookingId },
      bookingId,
    });
  }

  async findAll(): Promise<NotificationEntity[]> {
    if (this.notificationRepository) {
      return this.notificationRepository.find({ order: { createdAt: 'DESC' } });
    }
    return Array.from(this.inMemoryNotifications.values());
  }

  async findByCustomerId(customerId: string): Promise<NotificationEntity[]> {
    if (this.notificationRepository) {
      return this.notificationRepository.find({
        where: { customerId },
        order: { createdAt: 'DESC' },
      });
    }
    return Array.from(this.inMemoryNotifications.values()).filter(
      (n) => n.customerId === customerId,
    );
  }

  async findByBookingId(bookingId: string): Promise<NotificationEntity[]> {
    if (this.notificationRepository) {
      return this.notificationRepository.find({
        where: { bookingId },
        order: { createdAt: 'DESC' },
      });
    }
    return Array.from(this.inMemoryNotifications.values()).filter(
      (n) => n.bookingId === bookingId,
    );
  }

  async getStats(): Promise<NotificationStatsDto> {
    const all = await this.findAll();

    const stats: NotificationStatsDto = {
      total: all.length,
      pending: all.filter((n) => n.status === NotificationStatusEnum.PENDING).length,
      sent: all.filter((n) => n.status === NotificationStatusEnum.SENT).length,
      delivered: all.filter((n) => n.status === NotificationStatusEnum.DELIVERED).length,
      failed: all.filter((n) => n.status === NotificationStatusEnum.FAILED).length,
      bounced: all.filter((n) => n.status === NotificationStatusEnum.BOUNCED).length,
      byChannel: {},
      byType: {},
    };

    for (const n of all) {
      stats.byChannel[n.channel] = (stats.byChannel[n.channel] || 0) + 1;
      stats.byType[n.type] = (stats.byType[n.type] || 0) + 1;
    }

    return stats;
  }

  async markAsDelivered(id: string): Promise<NotificationEntity> {
    const notification = this.notificationRepository
      ? await this.notificationRepository.findOne({ where: { id } })
      : this.inMemoryNotifications.get(id);

    if (!notification) {
      throw new Error(`Notification ${id} not found`);
    }

    notification.status = NotificationStatusEnum.DELIVERED;
    notification.deliveredAt = new Date();
    notification.updatedAt = new Date();

    if (this.notificationRepository) {
      await this.notificationRepository.save(notification);
    } else {
      this.inMemoryNotifications.set(id, notification);
    }

    return notification;
  }

  async markAsFailed(id: string, errorMessage: string): Promise<NotificationEntity> {
    const notification = this.notificationRepository
      ? await this.notificationRepository.findOne({ where: { id } })
      : this.inMemoryNotifications.get(id);

    if (!notification) {
      throw new Error(`Notification ${id} not found`);
    }

    notification.status = NotificationStatusEnum.FAILED;
    notification.errorMessage = errorMessage;
    notification.retryCount += 1;
    notification.updatedAt = new Date();

    if (this.notificationRepository) {
      await this.notificationRepository.save(notification);
    } else {
      this.inMemoryNotifications.set(id, notification);
    }

    return notification;
  }

  /**
   * Simulate notification delivery for demo mode
   */
  private async simulateDelivery(notification: NotificationEntity): Promise<void> {
    // In demo mode, mark as delivered immediately
    notification.status = NotificationStatusEnum.DELIVERED;
    notification.sentAt = new Date();
    notification.deliveredAt = new Date();
    notification.externalId = `demo-${notification.id}`;

    if (this.notificationRepository) {
      await this.notificationRepository.save(notification);
    } else {
      this.inMemoryNotifications.set(notification.id, notification);
    }

    this.logger.log(`[DEMO] Notification delivered: ${notification.id}`);
  }

  private buildBookingConfirmationBody(details: Record<string, any>): string {
    const date = details.date || 'TBD';
    const time = details.time || 'TBD';
    const service = details.service || 'Cleaning Service';
    const address = details.address || 'Your location';

    return `Hi there!\n\nYour ${service} is confirmed for ${date} at ${time}.\n\nLocation: ${address}\n\nOur team will arrive on time and provide excellent service. You'll receive a notification when they're on their way.\n\nThank you for choosing CleanAUS!`;
  }
}
