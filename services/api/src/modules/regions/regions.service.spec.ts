import { Test, TestingModule } from '@nestjs/testing';
import { RegionsService } from './regions.service';
import { NotFoundException } from '@nestjs/common';
import { RegionCode } from '../../common/types/region.types';

describe('RegionsService', () => {
  let service: RegionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RegionsService],
    }).compile();

    service = module.get<RegionsService>(RegionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllRegions', () => {
    it('should return all 8 Australian regions', async () => {
      const regions = await service.getAllRegions();
      expect(regions).toHaveLength(8);
      expect(regions.map(r => r.code)).toEqual(
        expect.arrayContaining(['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'])
      );
    });

    it('should have GST rate of 0.10 for all regions', async () => {
      const regions = await service.getAllRegions();
      regions.forEach(region => {
        expect(region.gstRate).toBe(0.10);
      });
    });
  });

  describe('getRegionByCode', () => {
    it('should return NSW when code is NSW', async () => {
      const region = await service.getRegionByCode('NSW');
      expect(region.code).toBe('NSW');
      expect(region.name).toBe('New South Wales');
      expect(region.timezone).toBe('Australia/Sydney');
    });

    it('should return VIC when code is VIC', async () => {
      const region = await service.getRegionByCode('VIC');
      expect(region.code).toBe('VIC');
      expect(region.name).toBe('Victoria');
      expect(region.timezone).toBe('Australia/Melbourne');
    });

    it('should throw NotFoundException for invalid code', async () => {
      await expect(service.getRegionByCode('XX' as RegionCode))
        .rejects
        .toThrow(NotFoundException);
    });
  });

  describe('getServiceAreas', () => {
    it('should return service areas for NSW', async () => {
      const areas = await service.getServiceAreas('NSW');
      expect(areas.length).toBeGreaterThan(0);
      expect(areas[0]).toHaveProperty('id');
      expect(areas[0]).toHaveProperty('name');
      expect(areas[0]).toHaveProperty('postcode');
    });

    it('should throw for invalid region code', async () => {
      await expect(service.getServiceAreas('XX' as RegionCode))
        .rejects
        .toThrow(NotFoundException);
    });
  });

  describe('getServiceAreaByPostcode', () => {
    it('should find Sydney CBD for postcode 2000', async () => {
      const area = await service.getServiceAreaByPostcode('NSW', '2000');
      expect(area).toBeDefined();
      expect(area?.postcode).toBe('2000');
    });

    it('should return undefined for non-existent postcode', async () => {
      const area = await service.getServiceAreaByPostcode('NSW', '0000');
      expect(area).toBeUndefined();
    });
  });

  describe('getNearestServiceArea', () => {
    it('should return a service area for valid postcode', async () => {
      const area = await service.getNearestServiceArea('NSW', '2000');
      expect(area).toBeDefined();
    });

    it('should return CBD area for unknown postcode', async () => {
      const area = await service.getNearestServiceArea('VIC', '9999');
      expect(area).toBeDefined();
      expect(area?.name).toContain('CBD');
    });
  });
});
