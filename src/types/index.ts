
export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  country: string;
  verified: number;
  stripe_customer_id?: string;
  account_balance: number;
  status?: number;
}

export interface Driver extends User {
  status: number;
}

export interface Vehicle {
  id: number;
  car_name: string;
  car_number: string;
  car_model: string;
  car_color: string;
  seats: number;
  driver?: Driver;
}

export interface Booking {
  id: number;
  booking_code: string;
  pickup_type?: string;
  pickuptype?: string;
  place: string;
  destination_place: string;
  payment?: string;
  status: string;
  from_latitude?: string;
  from_longitude?: string;
  to_latitude?: string;
  to_longitude?: string;
}

export interface Transaction {
  id: number;
  transaction_id: string;
  transaction_type: string;
  intent: string;
  intent_type: string;
  description: string;
  amount: string;
  transaction_date: string;
  charges: string;
}

export interface Ticket {
  id: number;
  name: string;
  email: string;
  message: string;
  photo?: string;
}

export interface KYCDocument {
  id: number;
  driver_id: number;
  name: string;
  email: string;
  files: string; // JSON string that needs to be parsed
}

export interface Admin {
  id: number;
  name: string;
  email: string;
  phone: string;
  address?: string;
  role: string;
}

export interface DashboardStats {
  users: number;
  drivers: number;
  activeBookings: Booking[];
  uploadedCars: number;
  totalInflow: number;
  totalOutflow: number;
  rideShareInProgress: number;
  stripePublishableApiKey: string;
  stripeSecretKey: string;
  admins: Admin[];
  account: Admin;
  kyc: KYCDocument[];
  vehicles: Vehicle[];
  totalDriverBalance: number;
  totalUserBalance: number;
  depositPerformance: {
    total: number;
    percentagePerformance: number;
    growthIndicator: 'positive' | 'negative';
  };
  payoutPerformance: {
    total: number;
    percentagePerformance: number;
    growthIndicator: 'positive' | 'negative';
  };
  cancelChargePerformance: {
    total: number;
    percentagePerformance: number;
    growthIndicator: 'positive' | 'negative';
  };
  reports: Ticket[];
  dispatchStat: Array<{
    name: string;
    value: string;
  }>;
  hourlyRides: number[];
}

export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data?: T;
  pagination?: PaginationData;
}
