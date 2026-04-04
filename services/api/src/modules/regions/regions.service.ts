import { Injectable, NotFoundException } from '@nestjs/common';
import {
  RegionCode,
  Region,
  ServiceArea,
} from '../../common/types/region.types';
import {
  AUSTRALIAN_REGIONS,
  getRegionByCode,
  getServiceAreaByPostcode,
  getNearestServiceArea,
} from '../../config/australian-regions';

@Injectable()
export class RegionsService {
  async getAllRegions(): Promise<Region[]> {
    return Object.values(AUSTRALIAN_REGIONS);
  }

  async getRegionByCode(code: RegionCode): Promise<Region> {
    const region = getRegionByCode(code);
    if (!region) {
      throw new NotFoundException(`Region ${code} not found`);
    }
    return region;
  }

  async getServiceAreas(code: RegionCode): Promise<ServiceArea[]> {
    const region = getRegionByCode(code);
    if (!region) {
      throw new NotFoundException(`Region ${code} not found`);
    }
    return region.serviceAreas;
  }

  async getServiceAreaByPostcode(
    code: RegionCode,
    postcode: string,
  ): Promise<ServiceArea | undefined> {
    return getServiceAreaByPostcode(code, postcode);
  }

  async getNearestServiceArea(
    code: RegionCode,
    postcode: string,
  ): Promise<ServiceArea | undefined> {
    return getNearestServiceArea(code, postcode);
  }
}
