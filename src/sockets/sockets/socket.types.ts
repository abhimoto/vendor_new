export interface DriverLocationPayload {
  DriverID: string;
  VendorID: string;
  VehicleID: string;
  MobileNo: string;
  lat: string;
  lng: string;
  Speed: string;
  Direction: string;
  City: string;
  District: string;
  Taluka: string;
  State: string;
  Pincode: string;
  Address: string;
  Driver_LPStatus: string;
  Status: string;
}

// Customer Load
export interface CreateCustomerLoadPayload {
  loadId: string;
  pickuplat: number;
  pickuplng: number;
  deliverylat: number;
  deliverylng: number;
  Approximate_weight: any;
}

// Select Load
export interface SelectLoadPayload {
  customerId: string;
  postId: string;
  pickupLat: number;
  pickupLng: number;
}

// Process Load
export interface ProcessLoadPayload {
  postId: string;
}

// Join Room
export interface JoinRoomPayload {
  loadId: string;
}
