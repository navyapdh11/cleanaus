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
} from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { CreateCustomerDto, UpdateCustomerDto, AddLoyaltyPointsDto } from './dto/customer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Customers')
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all customers (admin)' })
  async findAll() {
    return this.customersService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a customer by ID' })
  @ApiParam({ name: 'id', description: 'Customer UUID' })
  async findOne(@Param('id') id: string) {
    return this.customersService.findOne(id);
  }

  @Get('email/:email')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a customer by email' })
  @ApiParam({ name: 'email', description: 'Customer email' })
  async findByEmail(@Param('email') email: string) {
    return this.customersService.findByEmail(email);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new customer' })
  @ApiResponse({ status: 201, description: 'Customer created' })
  async create(@Body() dto: CreateCustomerDto) {
    return this.customersService.create(dto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a customer' })
  @ApiParam({ name: 'id', description: 'Customer UUID' })
  async update(@Param('id') id: string, @Body() dto: UpdateCustomerDto) {
    return this.customersService.update(id, dto);
  }

  @Post(':id/loyalty-points')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Add loyalty points to a customer' })
  @ApiParam({ name: 'id', description: 'Customer UUID' })
  async addLoyaltyPoints(@Param('id') id: string, @Body() dto: AddLoyaltyPointsDto) {
    return this.customersService.addLoyaltyPoints(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a customer (admin)' })
  @ApiParam({ name: 'id', description: 'Customer UUID' })
  async remove(@Param('id') id: string) {
    return this.customersService.remove(id);
  }
}
