import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { PricingService } from './pricing.service';
import { PricingContextDto, CreatePricingRuleDto } from './dto/pricing.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Pricing')
@Controller('pricing')
export class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  @Post('calculate')
  @ApiOperation({ summary: 'Calculate price for a booking' })
  @ApiResponse({ status: 200, description: 'Price calculation with full breakdown' })
  async calculatePrice(@Body() context: PricingContextDto) {
    return this.pricingService.calculatePrice(context);
  }

  @Get('rules')
  @ApiOperation({ summary: 'Get all active pricing rules' })
  async getPricingRules() {
    return this.pricingService.getAllRules();
  }

  @Post('rules')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new pricing rule (admin)' })
  @ApiResponse({ status: 201, description: 'Pricing rule created' })
  async createRule(@Body() dto: CreatePricingRuleDto) {
    return this.pricingService.createRule(dto);
  }

  @Delete('rules/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a pricing rule (admin)' })
  @ApiParam({ name: 'id', description: 'Rule UUID' })
  async deleteRule(@Param('id') id: string) {
    return this.pricingService.removeRule(id);
  }
}
