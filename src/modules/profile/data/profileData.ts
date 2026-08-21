import {
  ProfileValues,
  Vehicle,
} from '../types/profileTypes';

export const DUMMY_VENDOR_ID = 'DUMMY-VENDOR-ID';

export const initialProfileValues: ProfileValues = {
  vendorName: 'ABC Logistics Pvt Ltd',
  organizationType: 'Private Limited',
  authorizedPerson: 'Abhishek Vishwakarma',
  mobileNumber: '9876543210',

  building: 'Building No 12',
  area: 'Ghatkopar West',
  pincode: '400086',
  state: 'Maharashtra',
  district: 'Mumbai Suburban',
  town: 'Ghatkopar',

  gstNumber: '27ABCDE1234F1Z5',
  panNumber: 'ABCDE1234F',
};

export const initialVehicles: Vehicle[] = [
  {
    vehicleid: 'VEH001',
    vendorid: DUMMY_VENDOR_ID,
    vehicleWeight: '12000',
    registrationNo: 'MH02AB1234',
  },
  {
    vehicleid: 'VEH002',
    vendorid: DUMMY_VENDOR_ID,
    vehicleWeight: '18000',
    registrationNo: 'MH03CD5678',
  },
];