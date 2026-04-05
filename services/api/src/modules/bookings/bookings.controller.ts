import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseEnumPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import {
  CreateBookingDto,
  UpdateBookingDto,
  CancelBookingDto,
} from './dto/booking.dto';
import { BookingStatusEnum } from './entities/booking.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Bookings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiResponse({ status: 201, description: 'Booking created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  async create(@Body() dto: CreateBookingDto) {
    return this.bookingsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all bookings or filter by status' })
  @ApiQuery({ name: 'status', required: false, enum: BookingStatusEnum })
  async findAll(@Query('status') status?: BookingStatusEnum) {
    if (status) {
      return this.bookingsService.findByStatus(status);
    }
    return this.bookingsService.findAll();
  }

  @Get('customer/:customerId')
  @ApiOperation({ summary: 'Get bookings by customer ID' })
  @ApiParam({ name: 'customerId', description: 'Customer UUID' })
  async findByCustomerId(@Param('customerId') customerId: string) {
    return this.bookingsService.findByCustomerId(customerId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a booking by ID' })
  @ApiParam({ name: 'id', description: 'Booking UUID' })
  async findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a booking' })
  @ApiParam({ name: 'id', description: 'Booking UUID' })
  async update(@Param('id') id: string, @Body() dto: UpdateBookingDto) {
    return this.bookingsService.update(id, dto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update booking status' })
  @ApiParam({ name: 'id', description: 'Booking UUID' })
  @ApiQuery({ name: 'status', enum: BookingStatusEnum })
  async updateStatus(
    @Param('id') id: string,
    @Query('status', new ParseEnumPipe(BookingStatusEnum)) status: BookingStatusEnum,
  ) {
    return this.bookingsService.updateStatus(id, status);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel a booking' })
  @ApiParam({ name: 'id', description: 'Booking UUID' })
  async cancel(@Param('id') id: string, @Body() dto: CancelBookingDto) {
    return this.bookingsService.cancel(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a booking' })
  @ApiParam({ name: 'id', description: 'Booking UUID' })
  async remove(@Param('id') id: string) {
    return this.bookingsService.remove(id);
  }
}
