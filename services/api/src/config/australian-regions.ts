import { RegionCode, Region, ServiceArea } from '../common/types/region.types';

/**
 * Australian regions configuration
 * Covers all 8 states/territories with major service areas
 */
export const AUSTRALIAN_REGIONS: Record<RegionCode, Region> = {
  NSW: {
    code: 'NSW',
    name: 'New South Wales',
    timezone: 'Australia/Sydney',
    gstRate: 0.10,
    serviceAreas: [
      { id: 'nsw-sydney-cbd', name: 'Sydney CBD', postcode: '2000', serviceRadius: 5 },
      { id: 'nsw-north-sydney', name: 'North Sydney', postcode: '2060', serviceRadius: 10 },
      { id: 'nsw-parramatta', name: 'Parramatta', postcode: '2150', serviceRadius: 15 },
      { id: 'nsw-bondi', name: 'Bondi', postcode: '2026', serviceRadius: 8 },
      { id: 'nsw-chatswood', name: 'Chatswood', postcode: '2067', serviceRadius: 12 },
      { id: 'nsw-liverpool', name: 'Liverpool', postcode: '2170', serviceRadius: 20 },
      { id: 'nsw-penrith', name: 'Penrith', postcode: '2750', serviceRadius: 25 },
      { id: 'nsw-newcastle', name: 'Newcastle', postcode: '2300', serviceRadius: 30 },
      { id: 'nsw-wollongong', name: 'Wollongong', postcode: '2500', serviceRadius: 30 },
      { id: 'nsw-central-coast', name: 'Central Coast', postcode: '2250', serviceRadius: 35 },
    ],
  },
  VIC: {
    code: 'VIC',
    name: 'Victoria',
    timezone: 'Australia/Melbourne',
    gstRate: 0.10,
    serviceAreas: [
      { id: 'vic-melbourne-cbd', name: 'Melbourne CBD', postcode: '3000', serviceRadius: 5 },
      { id: 'vic-southbank', name: 'Southbank', postcode: '3006', serviceRadius: 8 },
      { id: 'vic-richmond', name: 'Richmond', postcode: '3121', serviceRadius: 10 },
      { id: 'vic-st-kilda', name: 'St Kilda', postcode: '3182', serviceRadius: 12 },
      { id: 'vic-box-hill', name: 'Box Hill', postcode: '3128', serviceRadius: 15 },
      { id: 'vic-dandenong', name: 'Dandenong', postcode: '3175', serviceRadius: 20 },
      { id: 'vic-frankston', name: 'Frankston', postcode: '3199', serviceRadius: 25 },
      { id: 'vic-geelong', name: 'Geelong', postcode: '3220', serviceRadius: 30 },
      { id: 'vic-ballarat', name: 'Ballarat', postcode: '3350', serviceRadius: 35 },
      { id: 'vic-bendigo', name: 'Bendigo', postcode: '3550', serviceRadius: 35 },
    ],
  },
  QLD: {
    code: 'QLD',
    name: 'Queensland',
    timezone: 'Australia/Brisbane',
    gstRate: 0.10,
    serviceAreas: [
      { id: 'qld-brisbane-cbd', name: 'Brisbane CBD', postcode: '4000', serviceRadius: 5 },
      { id: 'qld-south-brisbane', name: 'South Brisbane', postcode: '4101', serviceRadius: 8 },
      { id: 'qld-gold-coast', name: 'Gold Coast', postcode: '4217', serviceRadius: 30 },
      { id: 'qld-sunshine-coast', name: 'Sunshine Coast', postcode: '4558', serviceRadius: 35 },
      { id: 'qld-ipswich', name: 'Ipswich', postcode: '4305', serviceRadius: 25 },
      { id: 'qld-logan', name: 'Logan', postcode: '4114', serviceRadius: 20 },
      { id: 'qld-redlands', name: 'Redlands', postcode: '4165', serviceRadius: 20 },
      { id: 'qld-cairns', name: 'Cairns', postcode: '4870', serviceRadius: 30 },
      { id: 'qld-townsville', name: 'Townsville', postcode: '4810', serviceRadius: 30 },
      { id: 'qld-toowoomba', name: 'Toowoomba', postcode: '4350', serviceRadius: 25 },
    ],
  },
  WA: {
    code: 'WA',
    name: 'Western Australia',
    timezone: 'Australia/Perth',
    gstRate: 0.10,
    serviceAreas: [
      { id: 'wa-perth-cbd', name: 'Perth CBD', postcode: '6000', serviceRadius: 5 },
      { id: 'wa-fremantle', name: 'Fremantle', postcode: '6160', serviceRadius: 15 },
      { id: 'wa-joondalup', name: 'Joondalup', postcode: '6027', serviceRadius: 20 },
      { id: 'wa-armadale', name: 'Armadale', postcode: '6112', serviceRadius: 20 },
      { id: 'wa-rockingham', name: 'Rockingham', postcode: '6168', serviceRadius: 25 },
      { id: 'wa-mandurah', name: 'Mandurah', postcode: '6210', serviceRadius: 35 },
      { id: 'wa-bunbury', name: 'Bunbury', postcode: '6230', serviceRadius: 30 },
      { id: 'wa-kalgoorlie', name: 'Kalgoorlie', postcode: '6430', serviceRadius: 25 },
    ],
  },
  SA: {
    code: 'SA',
    name: 'South Australia',
    timezone: 'Australia/Adelaide',
    gstRate: 0.10,
    serviceAreas: [
      { id: 'sa-adelaide-cbd', name: 'Adelaide CBD', postcode: '5000', serviceRadius: 5 },
      { id: 'sa-north-adelaide', name: 'North Adelaide', postcode: '5006', serviceRadius: 8 },
      { id: 'sa-glenelg', name: 'Glenelg', postcode: '5045', serviceRadius: 12 },
      { id: 'sa-eli-springs', name: 'Elizabeth', postcode: '5112', serviceRadius: 20 },
      { id: 'sa-morphett-vale', name: 'Morphett Vale', postcode: '5162', serviceRadius: 20 },
      { id: 'sa-mount-gambier', name: 'Mount Gambier', postcode: '5290', serviceRadius: 25 },
      { id: 'sa-whyalla', name: 'Whyalla', postcode: '5600', serviceRadius: 20 },
    ],
  },
  TAS: {
    code: 'TAS',
    name: 'Tasmania',
    timezone: 'Australia/Hobart',
    gstRate: 0.10,
    serviceAreas: [
      { id: 'tas-hobart-cbd', name: 'Hobart CBD', postcode: '7000', serviceRadius: 8 },
      { id: 'tas-glenorchy', name: 'Glenorchy', postcode: '7010', serviceRadius: 12 },
      { id: 'tas-clarence', name: 'Clarence', postcode: '7011', serviceRadius: 12 },
      { id: 'tas-kingston', name: 'Kingston', postcode: '7050', serviceRadius: 15 },
      { id: 'tas-launceston', name: 'Launceston', postcode: '7250', serviceRadius: 20 },
      { id: 'tas-devonport', name: 'Devonport', postcode: '7310', serviceRadius: 20 },
      { id: 'tas-burnie', name: 'Burnie', postcode: '7320', serviceRadius: 15 },
    ],
  },
  ACT: {
    code: 'ACT',
    name: 'Australian Capital Territory',
    timezone: 'Australia/Sydney',
    gstRate: 0.10,
    serviceAreas: [
      { id: 'act-canberra-cbd', name: 'Canberra CBD', postcode: '2601', serviceRadius: 5 },
      { id: 'act-belconnen', name: 'Belconnen', postcode: '2617', serviceRadius: 12 },
      { id: 'act-woden', name: 'Woden', postcode: '2606', serviceRadius: 10 },
      { id: 'act-tuggeranong', name: 'Tuggeranong', postcode: '2900', serviceRadius: 15 },
      { id: 'act-gungahlin', name: 'Gungahlin', postcode: '2912', serviceRadius: 15 },
      { id: 'act-weston-creek', name: 'Weston Creek', postcode: '2611', serviceRadius: 12 },
    ],
  },
  NT: {
    code: 'NT',
    name: 'Northern Territory',
    timezone: 'Australia/Darwin',
    gstRate: 0.10,
    serviceAreas: [
      { id: 'nt-darwin-cbd', name: 'Darwin CBD', postcode: '0800', serviceRadius: 8 },
      { id: 'nt-palmerston', name: 'Palmerston', postcode: '0830', serviceRadius: 15 },
      { id: 'nt-alice-springs', name: 'Alice Springs', postcode: '0870', serviceRadius: 20 },
      { id: 'nt-katherine', name: 'Katherine', postcode: '0850', serviceRadius: 15 },
      { id: 'nt-casuarina', name: 'Casuarina', postcode: '0810', serviceRadius: 12 },
    ],
  },
};

/**
 * Get region by code
 */
export function getRegionByCode(code: RegionCode): Region | undefined {
  return AUSTRALIAN_REGIONS[code];
}

/**
 * Get all regions
 */
export function getAllRegions(): Region[] {
  return Object.values(AUSTRALIAN_REGIONS);
}

/**
 * Get service area by postcode and region
 */
export function getServiceAreaByPostcode(regionCode: RegionCode, postcode: string): ServiceArea | undefined {
  const region = AUSTRALIAN_REGIONS[regionCode];
  if (!region) return undefined;
  
  return region.serviceAreas.find(area => area.postcode === postcode);
}

/**
 * Get nearest service area for a postcode
 */
export function getNearestServiceArea(regionCode: RegionCode, postcode: string): ServiceArea | undefined {
  const region = AUSTRALIAN_REGIONS[regionCode];
  if (!region || region.serviceAreas.length === 0) return undefined;

  // Find exact match first
  const exact = region.serviceAreas.find(area => area.postcode === postcode);
  if (exact) return exact;

  // Return CBD/central area as fallback
  return region.serviceAreas.find(area => 
    area.name.toLowerCase().includes('cbd') || 
    area.name.toLowerCase().includes(region.name.split(' ')[0].toLowerCase())
  ) || region.serviceAreas[0];
}
