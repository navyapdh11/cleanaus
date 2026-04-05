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
import { ServicesService } from './services.service';
import { CreateServiceDto, UpdateServiceDto } from './dto/service.dto';
import { ServiceCategoryEnum } from './entities/service.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Services')
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active cleaning services' })
  @ApiQuery({ name: 'category', required: false, enum: ServiceCategoryEnum })
  @ApiQuery({ name: 'region', required: false, description: 'Region code (e.g. NSW)' })
  async findAll(
    @Query('category') category?: ServiceCategoryEnum,
    @Query('region') region?: string,
  ) {
    if (category) {
      return this.servicesService.findByCategory(category);
    }
    if (region) {
      return this.servicesService.findByRegion(region);
    }
    return this.servicesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a service by ID' })
  @ApiParam({ name: 'id', description: 'Service UUID' })
  async findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new cleaning service (admin)' })
  @ApiResponse({ status: 201, description: 'Service created successfully' })
  async create(@Body() dto: CreateServiceDto) {
    return this.servicesService.create(dto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a cleaning service (admin)' })
  @ApiParam({ name: 'id', description: 'Service UUID' })
  async update(@Param('id') id: string, @Body() dto: UpdateServiceDto) {
    return this.servicesService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a cleaning service (admin)' })
  @ApiParam({ name: 'id', description: 'Service UUID' })
  async remove(@Param('id') id: string) {
    return this.servicesService.remove(id);
  }
}
