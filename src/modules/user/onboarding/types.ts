export type Authorities = {
  designation: string;
  fullname: string;
  mobileno: string;
  email: string;
};

export type Vehicle = {
  registrationNumber: string;
  capacity: string;
};

export type legaldocuments = {
  gstnumber: string;
  pannumber: string;
  numberofvehicles: number;
  vehicles: Vehicle[];
};

export type VendorFormValues = {
  companyName: string;
  companyType: string;
  ownerName: string;
  mobileNumber: string | undefined;
  building: string;
  area: string;
  pincode: string;
  state: string;
  district: string;
  town: string;
  // Numberofauthrity: string; // ⬅️ string as per your type
  // Authority: Authorities[]; // ⬅️ array of authorities
  legaldocuments: legaldocuments;
};
