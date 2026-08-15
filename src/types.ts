export type PropertyPurpose = 'Sale' | 'Rent';
export type PropertyType = 'Villa' | 'Penthouse' | 'Mansion' | 'Apartment' | 'Chateau' | 'Townhouse';
export type PropertyStatus = 'Ready' | 'Upcoming' | 'Sold';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Agent {
  name: string;
  photo: string;
  phone: string;
  email: string;
  whatsapp: string;
  role: string;
}

export interface Property {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  discountPrice?: number;
  propertyType: PropertyType;
  purpose: PropertyPurpose;
  location: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  coordinates: Coordinates;
  bedrooms: number;
  bathrooms: number;
  balcony: number;
  parking: number;
  area: number;
  areaUnit: 'Sq.Ft' | 'Sq.M';
  yearBuilt: number;
  status: PropertyStatus;
  amenities: string[];
  images: string[];
  thumbnail: string;
  floorPlan?: string;
  videoUrl?: string;
  virtualTourUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  isFeatured: boolean;
  isPublished: boolean;
  createdAt: string;
  viewsCount?: number;
  agent: Agent;
}

export type LeadType = 'contact' | 'inquiry' | 'schedule_visit' | 'call_back' | 'general_inquiry';
export type LeadStatus = 'New' | 'Contacted' | 'In Progress' | 'Closed' | 'Qualified' | 'Concluded';

export interface Lead {
  id: string;
  type: LeadType;
  propertyId?: string;
  propertyTitle?: string;
  name: string;
  email: string;
  phone: string;
  message?: string;
  preferredDate?: string;
  preferredTime?: string;
  status: LeadStatus;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  name?: string;
  photo: string;
  role: string;
  company?: string;
  location: string;
  rating: number;
  review: string;
  content?: string;
  verified: boolean;
  isFeatured: boolean;
}

export interface SiteSettings {
  companyName?: string;
  siteTitle?: string;
  siteTagline?: string;
  logoUrl?: string;
  contactPhone: string;
  contactEmail: string;
  address?: string;
  officeAddress?: string;
  targetCity?: string;
  targetState?: string;
  primaryService?: string;
  serviceAreas?: string[];
  seoCustomH1?: string;
  googleMapsApiKey: string;
  whatsappNumber?: string;
  currencySymbol: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    youtube?: string;
    twitter?: string;
  };
  smtpConfigured?: boolean;
}

export interface FilterState {
  search: string;
  location: string;
  propertyType: string;
  purpose: 'All' | 'Sale' | 'Rent';
  minPrice: number;
  maxPrice: number;
  bedrooms: string; // 'All' | '1' | '2' | '3' | '4+'
  bathrooms: string;
  minArea: number;
  maxArea: number;
  status: string; // 'All' | 'Ready' | 'Upcoming'
  isFeatured: boolean;
  sortBy: 'newest' | 'price-asc' | 'price-desc' | 'popular';
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'agent';
  token?: string;
}

export interface ClientSiteRecord {
  id: string;
  clientName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  country: string;
  primaryService: string;
  serviceAreas: string[];
  seoCustomH1: string;
  generatedUrl: string;
  createdAt: string;
  whatsappMessage: string;
}
