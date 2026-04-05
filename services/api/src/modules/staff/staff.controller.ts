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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { StaffService } from './staff.service';
import { CreateStaffDto, UpdateStaffDto } from './dto/staff.dto';
import { StaffStatusEnum } from './entities/staff.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Staff')
@ApiBearerAuth()
@Controller('staff')
@UseGuards(JwtAuthGuard)
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Get()
  @ApiOperation({ summary: 'Get all staff members' })
  @ApiQuery({ name: 'status', required: false, enum: StaffStatusEnum })
  @ApiQuery({ name: 'region', required: false, description: 'Filter by region code' })
  @ApiQuery({ name: 'skill', required: false, description: 'Filter by skill' })
  async findAll(
    @Query('status') status?: StaffStatusEnum,
    @Query('region') region?: string,
    @Query('skill') skill?: string,
  ) {
    if (region) return this.staffService.findByRegion(region);
    if (skill) return this.staffService.findBySkill(skill);
    if (status) return this.staffService.findAll().then((s) => s.filter((x) => x.status === status));
    return this.staffService.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'Get all active staff members' })
  async findActive() {
    return this.staffService.findActive();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a staff member by ID' })
  @ApiParam({ name: 'id', description: 'Staff UUID' })
  async findOne(@Param('id') id: string) {
    return this.staffService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new staff member (admin)' })
  @ApiResponse({ status: 201, description: 'Staff member created' })
  async create(@Body() dto: CreateStaffDto) {
    return this.staffService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a staff member (admin)' })
  @ApiParam({ name: 'id', description: 'Staff UUID' })
  async update(@Param('id') id: string, @Body() dto: UpdateStaffDto) {
    return this.staffService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a staff member (admin)' })
  @ApiParam({ name: 'id', description: 'Staff UUID' })
  async remove(@Param('id') id: string) {
    return this.staffService.remove(id);
  }
}
