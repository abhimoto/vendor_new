export interface ProfileValues {
  vendorName: string;
  organizationType: string;
  authorizedPerson: string;
  mobileNumber: string;
  building: string;
  area: string;
  pincode: string;
  state: string;
  district: string;
  town: string;
  gstNumber: string;
  panNumber: string;
}

export interface Vehicle {
  vehicleid: string;
  vendorid: string;
  vehicleWeight: string;
  registrationNo: string;
}

export type ProfileSection =
  | 'personal'
  | 'kyc'
  | 'vehicle';