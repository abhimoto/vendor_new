import { EditRequest, LoginRequest, LoginResponse } from '../types';
import { api } from './../../../config/api';

export const authApi = api.injectEndpoints({
  endpoints: builder => ({
    sendOtp: builder.mutation<LoginResponse, LoginRequest>({
      query: body => ({
        url: '/vendor/send-otp',
        method: 'POST',
        body,
      }),
    }),

    verifyOtp: builder.mutation<any, any>({
      query: body => ({
        url: '/vendor/verify-otp',
        method: 'POST',
        body,
      }),
    }),

    onboarding: builder.mutation<any, any>({
      query: body => ({
        url: '/vendor/register',
        method: 'POST',
        body,
      }),
    }),
       updateprofile: builder.mutation<any, any>({
      query: body => ({
        url: '/vendor/profile/update',
        method: 'POST',
        body,
      }),
    }),

    addvehicle: builder.mutation<any, any>({
      query: body => ({
        url: '/vendor/vehicle/add-vehicle',
        method: 'POST',
        body,
      }),
    }),



    bankdetails: builder.mutation<any, any>({
      query: body => ({
        url: '/vendor/kyc/bankdetails',
        method: 'POST',
        body,
      }),
    }),

    gstverify: builder.mutation<any, any>({
      query: body => ({
        url: '/vendor/kyc/gst',
        method: 'POST',
        body,
      }),
    }),

    vehicleverify: builder.mutation<any, FormData>({
      query: formData => ({
        url: '/vendor/vehicle/verify-rc',
        method: 'POST',
        body: formData,
      }),
    }),

    vehicleedit: builder.mutation<any, EditRequest>({
      query: body => ({
        url: '/vendor/vehicle/editvehicles',
        method: 'PUT',
        body,
      }),
    }),

    Licenseverify: builder.mutation<any, any>({
      query: body => ({
        url: '/vendor/kyc/driving-license/verify',
        method: 'POST',
        body,
      }),
    }),

    Driver_verification: builder.mutation<any, any>({
      query: body => ({
        url: '/vendor/vehicle/driver-onboarding',
        method: 'POST',
        body,
      }),
    }),

    AssignVehicle: builder.mutation<any, any>({
      query: body => ({
        url: '/vendor/vehicle/assign-vehicle',
        method: 'POST',
        body,
      }),
    }),
        DessignVehicle: builder.mutation<any, any>({
      query: body => ({
        url: '/vendor/vehicle/deassign-vehicle',
        method: 'POST',
        body,
      }),
    }),

    deleteassignvehicle: builder.mutation<any, {
      DriverID: string;
      VendorID: string;
      VehicleID: string;
    }>({
      query: body => ({
        url: '/delete_Driver_Vehicle_Assign',
        method: 'POST',
        body,
      }),
    }),

    updateassignvehicle: builder.mutation<any, any>({
      query: body => ({
        url: '/update_Driver_Vehicle_Assign',
        method: 'POST',
        body,
      }),
    }),

deletevehicle: builder.mutation<
  any,
  {
    VehicleId: string;
    Remark: string;
    RatingValue: number;
  }
>({
  query: body => ({
    url: '/vendor/vehicle/discontinue-vehicle',
    method: 'POST',
    body,
  }),
}),

discontinueDriver: builder.mutation<
  any,
  {
    DriverProfileId: string;
    Remark: string;
    RatingValue: number;
  }
>({
  query: body => ({
    url: '/vendor/vehicle/discontinue-driver',
    method: 'POST',
    body,
  }),
}),

    updatevendordetails: builder.mutation<any, any>({
      query: body => ({
        url: '/update_Vendor_Details',
        method: 'POST',
        body,
      }),
    }),

    updatevendorkyc: builder.mutation<any, any>({
      query: body => ({
        url: '/update_vendor_kyc',
        method: 'POST',
        body,
      }),
    }),
uploadDocument: builder.mutation<
  any,
  {
    documentType: string;
    file: any;
    vehicleId?: string;
    loadId?: string;
    rcNumber?: string;
  }>({
  query: ({ documentType, file, vehicleId, loadId, rcNumber }) => {
    const formData = new FormData();

    formData.append('documentType', documentType);

    if (vehicleId) formData.append('vehicleId', vehicleId);
    if (loadId) formData.append('loadId', loadId);
    if (rcNumber) formData.append('rcNumber', rcNumber);

    formData.append('file', {
      uri: file.uri,
      name: file.fileName || 'document.jpg',
      type: file.type || 'image/jpeg',
    } as any);


    return {
      url: '/vendor/upload-document',
      method: 'POST',
      body: formData,
    };
  },
}),

    duplicatevehicle: builder.mutation<any, any>({
      query: body => ({
        url: '/Vendor_KYC_Check',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useSendOtpMutation,
  useVerifyOtpMutation,
  useOnboardingMutation,
  useBankdetailsMutation,
  useGstverifyMutation,
  useVehicleverifyMutation,
  useLicenseverifyMutation,
  useDriver_verificationMutation,
  useAssignVehicleMutation,
  useDeleteassignvehicleMutation,
  useUpdateassignvehicleMutation,
  useDeletevehicleMutation,
 useDiscontinueDriverMutation,
  useVehicleeditMutation,
  useUpdatevendordetailsMutation,
  useUpdatevendorkycMutation,
  useDuplicatevehicleMutation,
  useAddvehicleMutation,
  useDessignVehicleMutation,
  useUploadDocumentMutation,
  useUpdateprofileMutation
} = authApi;