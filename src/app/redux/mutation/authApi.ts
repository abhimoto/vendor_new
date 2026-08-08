import { EditRequest, LoginRequest, LoginResponse } from '../types';
import { api } from './../../../config/api';

export const authApi = api.injectEndpoints({
  endpoints: builder => ({
    sendOtp: builder.mutation<LoginResponse, LoginRequest>({
      query: body => ({
        url: '/auth/send-otp',
        method: 'POST',
        body,
      }),
    }),

    verifyOtp: builder.mutation<any, any>({
      query: body => ({
        url: '/auth/verify-otp',
        method: 'POST',
        body,
      }),
    }),

    onboarding: builder.mutation<any, any>({
      query: body => ({
        url: '/auth/vendor/register',
        method: 'POST',
        body,
      }),
    }),

    addvehicle: builder.mutation<any, any>({
      query: body => ({
        url: '/vendor/add-vehicle',
        method: 'POST',
        body,
      }),
    }),



    bankdetails: builder.mutation<any, any>({
      query: body => ({
        url: '/vendor/bankdetails',
        method: 'POST',
        body,
      }),
    }),

    gstverify: builder.mutation<any, any>({
      query: body => ({
        url: '/auth/kyc/gst',
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
        url: '/vendor/editvehicles',
        method: 'PUT',
        body,
      }),
    }),

    Licenseverify: builder.mutation<any, any>({
      query: body => ({
        url: '/auth/kyc/driving-license/verify',
        method: 'POST',
        body,
      }),
    }),

    Driver_verification: builder.mutation<any, any>({
      query: body => ({
        url: '/vendor/driver-onboarding',
        method: 'POST',
        body,
      }),
    }),

    AssignVehicle: builder.mutation<any, any>({
      query: body => ({
        url: '/vendor/assign-vehicle',
        method: 'POST',
        body,
      }),
    }),
        DessignVehicle: builder.mutation<any, any>({
      query: body => ({
        url: '/vendor/deassign-vehicle',
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

    deletevehicle: builder.mutation<any, {
      vehicleid: string;
      vendorid: string;
      Remark: string;
    }>({
      query: body => ({
        url: '/delete_vehicle',
        method: 'POST',
        body,
      }),
    }),

    deletedriver: builder.mutation<any, {
      driverid: string;
      vendorid: string;
    }>({
      query: body => ({
        url: '/delete_driver',
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
  useDeletedriverMutation,
  useVehicleeditMutation,
  useUpdatevendordetailsMutation,
  useUpdatevendorkycMutation,
  useDuplicatevehicleMutation,
  useAddvehicleMutation,
  useDessignVehicleMutation
} = authApi;