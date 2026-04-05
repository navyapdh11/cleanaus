import {
  Controller,
  Get,
  Post,
  Patch,
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
  ApiQuery,
} from '@nestjs/swagger';
import { DispatchService } from './dispatch.service';
import { AssignStaffDto } from './dto/dispatch.dto';
import { DispatchStatusEnum } from './entities/dispatch-assignment.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Dispatch')
@Controller('dispatch')
export class DispatchController {
  constructor(private readonly dispatchService: DispatchService) {}

  @Get('recommend')
  @ApiOperation({ summary: 'Get staff recommendations for a booking' })
  @ApiQuery({ name: 'bookingId', description: 'Booking UUID' })
  @ApiQuery({ name: 'region', description: 'Region code' })
  @ApiQuery({ name: 'skills', required: false, description: 'Comma-separated skills' })
  async getRecommendations(
    @Query('bookingId') bookingId: string,
    @Query('region') region: string,
    @Query('skills') skills?: string,
  ) {
    const skillList = skills ? skills.split(',').map((s) => s.trim()) : [];
    return this.dispatchService.recommendStaffForBooking(bookingId, region, skillList);
  }

  @Post('assign')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Manually assign staff to a booking' })
  @ApiResponse({ status: 201, description: 'Staff assigned successfully' })
  async assignStaff(@Body() dto: AssignStaffDto) {
    return this.dispatchService.assignStaff(dto);
  }

  @Post('auto-assign')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'AI-powered auto-assignment of staff' })
  @ApiResponse({ status: 201, description: 'Auto-assigned staff' })
  async autoAssign(
    @Query('bookingId') bookingId: string,
    @Query('region') region: string,
    @Query('skills') skills?: string,
  ) {
    const skillList = skills ? skills.split(',').map((s) => s.trim()) : [];
    return this.dispatchService.autoAssign(bookingId, region, skillList);
  }

  @Get('booking/:bookingId')
  @ApiOperation({ summary: 'Get dispatch assignments for a booking' })
  @ApiParam({ name: 'bookingId', description: 'Booking UUID' })
  async findByBooking(@Param('bookingId') bookingId: string) {
    return this.dispatchService.findByBookingId(bookingId);
  }

  @Get('staff/:staffId')
  @ApiOperation({ summary: 'Get dispatch assignments for a staff member' })
  @ApiParam({ name: 'staffId', description: 'Staff UUID' })
  async findByStaff(@Param('staffId') staffId: string) {
    return this.dispatchService.findByStaffId(staffId);
  }

  @Patch(':id/status')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update dispatch assignment status' })
  @ApiParam({ name: 'id', description: 'Assignment UUID' })
  @ApiQuery({ name: 'status', enum: DispatchStatusEnum })
  async updateStatus(
    @Param('id') id: string,
    @Query('status') status: DispatchStatusEnum,
  ) {
    return this.dispatchService.updateStatus(id, status);
  }
}
