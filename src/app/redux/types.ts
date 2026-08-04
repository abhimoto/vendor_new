export type User = {
  id: string;
  companyType?: string;
  companyName?: string;
  ownerName?: string;
  mobile?: string;
  building?: string;
  area?: string;
  pincode?: string;
  state?: string;
  tahsil?: string;
  role?: string;
  status?: string;
  vendorOnboarded?: boolean;
  kycVerify?: boolean;
};
export interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  kyc_verified: boolean;      // ✅ Consistent naming
  vehicle_verified: boolean;   // ✅ Consistent naming
  vendor_onboarded: boolean;   // ✅ Consistent naming
}

export type DashboardState = {
  selectedModule: string | null;
  stats: {
    totalVehicles: number;
    totalDrivers: number;
    totalTrips: number;
    totalRevenue: number;
  };
};

export type RegistrationState = {
  currentStep: number;
  personalDetails: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
  };
  companyDetails: {
    companyName: string;
    gstNumber: string;
    panNumber: string;
    address: string;
  };
  completed: boolean;
};

export type VehicleFormState = {
  vehicleNumber: string;
  vehicleType: string;
  truckBodyType: string;
  capacity: string;
  rcFront: string;
  rcBack: string;
  insurance: string;
};

export type BankFormState = {
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branchName: string;
  cancelledCheque: string;
};
//===============login ==================
export interface LoginRequest {
  mobile_number: string;
}

export interface LoginResponse {
  status: string;
  message: string;
  userDetails?: {
    vendorid: string;
    companyType: string;
    companyName: string;
    owner_name: string;
    mobileNo: string;
    Building: string;
    Area: string;
    pincode: string;
    state: string;
    Tahsil: string;
    role: string;
    status: string;
    vendor_onboarded: boolean;
    kyc_verify: boolean;
    flag: string;
  };
}

export interface DeleteRequest {
  vendorid: string;
  vehicleid: string;
  driverName: string;
  Remark: string;
  rating: string;
}

export interface EditRequest {
  vehicleid: string;
  vendorid: string;
  vehicleWeight: string;
  registrationNo: string;
}
