export enum Role {
  Producer = 'Producer',
  Consumer = 'Consumer',
  Regulator = 'Regulator',
  Certifier = 'Certifier',
}

export enum CreditStatus {
  AWAITING_CERTIFICATION = 'Awaiting Certification',
  AVAILABLE = 'Available',
  RETIRED = 'Retired',
  REJECTED = 'Rejected',
  EXPIRED = 'Expired',
}

export enum TransactionType {
  ISSUE = 'ISSUE',
  TRANSFER = 'TRANSFER',
  RETIRE = 'RETIRE',
  CERTIFY = 'CERTIFY',
  REJECT = 'REJECT',
  EXPIRE = 'EXPIRE',
}

export interface User {
  id: string;
  name: string;
  role: Role;
  email: string;
  password?: string; // Should not be sent to client in real app
  location?: string; // For Producers: The state/UT they are registered in
  jurisdictionType?: 'State' | 'Country'; // For Certifiers
  jurisdictionName?: string; // For Certifiers: e.g., 'Maharashtra' or 'India'
}

export type EnergySource = 'Solar' | 'Wind' | 'Hydro' | 'Geothermal' | 'Biomass' | 'Nuclear';

export interface ProductionData {
  volume: number; // in kg
  timestamp: number;
  energySource: EnergySource;
  location: string; // The location of production, which is the same as the producer's registered state/UT
}

export interface Credit {
  id: string;
  producerId: string;
  ownerId: string;
  certifierId: string;
  productionDataHash: string;
  producerSignature: string; // Signature from the producer upon issuance
  issueTimestamp: number;
  expiryTimestamp: number; // New field for credit expiry
  volume: number; // in kg
  status: CreditStatus;
  price: number; // in USD
  location: string; // Specific plant location
  energySource: EnergySource;
}

export interface Transaction {
  id: string;
  creditId: string;
  type: TransactionType;
  fromId: string | null;
  toId: string;
  timestamp: number;
  notes?: string;
  signature?: string; // Signature for key actions like ISSUE, CERTIFY, REJECT
}

export interface ChartDataPoint {
  time: string;
  volume: number;
}

// Additional utility types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  loading: boolean;
}

export interface PaginationParams {
  page: number;
  limit: number;
  total?: number;
}

export interface SortParams {
  field: string;
  direction: 'asc' | 'desc';
}