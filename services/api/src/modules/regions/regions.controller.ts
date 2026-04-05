import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { RegionsService } from './regions.service';
import { RegionCode } from '../../common/types/region.types';
import { REGION_CODES } from '../../config/region-constants';

@ApiTags('Regions')
@Controller('regions')
export class RegionsController {
  constructor(private readonly regionsService: RegionsService) {}

  @Get()
  @ApiOperation({ summary: 'List all Australian service regions' })
  @ApiResponse({ status: 200, description: 'Returns all regions' })
  async findAll() {
    return this.regionsService.getAllRegions();
  }

  @Get(':code')
  @ApiOperation({ summary: 'Get region by code' })
  @ApiParam({ name: 'code', enum: REGION_CODES })
  @ApiResponse({ status: 200, description: 'Returns region details' })
  @ApiResponse({ status: 404, description: 'Region not found' })
  async findOne(@Param('code') code: RegionCode) {
    return this.regionsService.getRegionByCode(code);
  }

  @Get(':code/service-areas')
  @ApiOperation({ summary: 'Get service areas for a region' })
  @ApiParam({ name: 'code', enum: REGION_CODES })
  @ApiResponse({ status: 200, description: 'Returns service areas' })
  async getServiceAreas(
    @Param('code') code: RegionCode,
    @Query('postcode') postcode?: string,
  ) {
    if (postcode) {
      return this.regionsService.getServiceAreaByPostcode(code, postcode);
    }
    return this.regionsService.getServiceAreas(code);
  }
}
