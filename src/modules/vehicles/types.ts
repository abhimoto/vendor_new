export type VehicleForm = {
  vendorid: string;
  vehicleid: string;
  vehicleDetails: {
    registrationNo: string;
    bodyType: string;
  };
  VehicleTypesDetails: {
    VehicleWeight: number;
    vehicleType: string;
    height: string;
    width: string;
    length: string;
  };
  vehiclePhotos: {
    front_img: string;
    back_img: string;
    right_img: string;
    left_img: string;
  };
};
