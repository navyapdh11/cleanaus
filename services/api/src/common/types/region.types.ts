/**
 * Region types for Australian cleaning services platform
 */

export type RegionCode = 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'ACT' | 'NT';

export interface Region {
  code: RegionCode;
  name: string;
  timezone: string;
  gstRate: number;
  serviceAreas: ServiceArea[];
}

export interface ServiceArea {
  id: string;
  name: string;
  postcode: string;
  serviceRadius: number; // in kilometers
}

export interface Address {
  street: string;
  suburb: string;
  postcode: string;
  state: RegionCode;
  country: 'AU';
  instructions?: string;
  latitude?: number;
  longitude?: number;
}
