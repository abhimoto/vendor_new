import {useAddvehicleMutation} from '@app/redux/mutation/authApi';

interface AddVehicleInput {
  registrationNo: string;
  vehicleWeight: string;
}

interface AddVehiclePayload {
  Vehicles: {
    VehicleNo: string;
    LoadingCapacity: number;
  }[];
}

export const useVehicleActions = () => {
  const [
    addVehicleMutation,
    {
      isLoading: isAddingVehicle,
      isError: isAddVehicleError,
      error: addVehicleError,
    },
  ] = useAddvehicleMutation();

  const addVehicles = async (
    vehicles: AddVehicleInput[],
  ) => {
    const payload: AddVehiclePayload = {
      Vehicles: vehicles.map(vehicle => ({
        VehicleNo: vehicle.registrationNo
          .trim()
          .toUpperCase(),

        LoadingCapacity: Number(
          vehicle.vehicleWeight,
        ),
      })),
    };

    try {
      const response =
        await addVehicleMutation(
          payload,
        ).unwrap();

      return {
        success: response?.status === '00',
        data: response,
      };
    } catch (error: any) {
      return {
        success: false,
        data: null,
        error:
          error?.data?.message ||
          error?.message ||
          'Unable to add vehicles.',
      };
    }
  };

  return {
    addVehicles,
    isAddingVehicle,
    isAddVehicleError,
    addVehicleError,
  };
};