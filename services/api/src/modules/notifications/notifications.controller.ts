import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { SendNotificationDto } from './dto/notification.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all notifications (admin)' })
  async findAll() {
    return this.notificationsService.findAll();
  }

  @Get('stats')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get notification statistics' })
  async getStats() {
    return this.notificationsService.getStats();
  }

  @Get('customer/:customerId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get notifications for a customer' })
  @ApiParam({ name: 'customerId', description: 'Customer UUID' })
  async findByCustomer(@Param('customerId') customerId: string) {
    return this.notificationsService.findByCustomerId(customerId);
  }

  @Get('booking/:bookingId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get notifications for a booking' })
  @ApiParam({ name: 'bookingId', description: 'Booking UUID' })
  async findByBooking(@Param('bookingId') bookingId: string) {
    return this.notificationsService.findByBookingId(bookingId);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Send a notification' })
  @ApiResponse({ status: 201, description: 'Notification sent' })
  async send(@Body() dto: SendNotificationDto) {
    return this.notificationsService.send(dto);
  }

  // Convenience endpoints for common notification types

  @Post('booking-confirmation')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Send booking confirmation' })
  async sendBookingConfirmation(
    @Query('customerId') customerId: string,
    @Query('bookingId') bookingId: string,
    @Body() details: Record<string, any>,
  ) {
    return this.notificationsService.sendBookingConfirmation(customerId, bookingId, details);
  }

  @Post('booking-reminder')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Send booking reminder' })
  async sendBookingReminder(
    @Query('customerId') customerId: string,
    @Query('bookingId') bookingId: string,
    @Body() details: Record<string, any>,
  ) {
    return this.notificationsService.sendBookingReminder(customerId, bookingId, details);
  }

  @Post('review-request')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Send review request' })
  async sendReviewRequest(
    @Query('customerId') customerId: string,
    @Query('bookingId') bookingId: string,
  ) {
    return this.notificationsService.sendReviewRequest(customerId, bookingId);
  }
}
