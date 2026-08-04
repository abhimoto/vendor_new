import { EditRequest, LoginRequest, LoginResponse } from '../types';
import { api } from './../../../config/api';

export const authApi = api.injectEndpoints({
  endpoints: builder => ({
    sendOtp: builder.mutation<LoginResponse, LoginRequest>({
      query: body => ({
        url: 'sendOTP',
        method: 'POST',
        body,
      }),
    }),
    verifyOtp: builder.mutation<any, any>({
      query: body => ({
        url: 'validateOTP',
        method: 'POST',
        body,
      }),
    }),
    onboarding: builder.mutation<any, any>({
      query: body => ({
        url: 'VendorOnboarding',
        method: 'POST',
        body,
      }),
    }),
    getPincode: builder.mutation<any, { pincode: string }>({
      query: body => ({
        url: 'pincode',
        method: 'POST',
        body,
      }),
    }),
    bankdetails: builder.mutation<any, any>({
      query: body => ({
        url: 'vendor_Bank_kyc',
        method: 'POST',
        body,
      }),
    }),
    gstverify: builder.mutation<any, any>({
      query: body => ({
        url: 'GST',
        method: 'POST',
        body,
      }),
    }),
    vehicleverify: builder.mutation<any, any>({
      query: body => ({
        url: 'Insert_Vehicle',
        method: 'POST',
        body,
      }),
    }),
    vehicleedit: builder.mutation<any, EditRequest>({
      query: body => ({
        url: 'update_vehicle',
        method: 'POST',
        body,
      }),
    }),
    Licenseverify: builder.mutation<any, any>({
      query: body => ({
        url: 'DrivingLicense',
        method: 'POST',
        body,
      }),
    }),
    Driver_verification: builder.mutation<any, any>({
      query: body => ({
        url: 'Driver_verification',
        method: 'POST',
        body,
      }),
    }),
    Divervehicleassign: builder.mutation<any, any>({
      query: body => ({
        url: 'Insert_Driver_Vehicle_Assign',
        method: 'POST',
        body,
      }),
    }),
    deleteassignvehicle: builder.mutation<any, { DriverID: string, VendorID: string, VehicleID: string }>({
      query: body => ({
        url: 'delete_Driver_Vehicle_Assign',
        method: 'POST',
        body,
      }),
    }),
    updateassignvehicle: builder.mutation<any, any>({
      query: body => ({
        url: 'update_Driver_Vehicle_Assign',
        method: 'POST',
        body,
      }),
    }),
    deletevehicle: builder.mutation<any, { vehicleid: string, vendorid: string, Remark: string, }>({
      query: body => ({
        url: 'delete_vehicle',
        method: 'POST',
        body,
      })
    }),
    deletedriver: builder.mutation<any, { driverid: string, vendorid: string }>({
      query: body => ({
        url: 'delete_driver',
        method: 'POST',
        body,
      })
    }),
    updatevendordetails: builder.mutation<any, any>({
      query: body => ({
        url: 'update_Vendor_Details',
        method: 'POST',
        body,
      })
    }),
    updatevendorkyc: builder.mutation<any, any>({
      query: body => ({
        url: 'update_vendor_kyc',
        method: 'POST',
        body,
      })
    }),
    duplicatevehicle:builder.mutation<any,any>({
      query:body => ({
        url:'Vendor_KYC_Check',
        method:'POST',
        body,
      })
    })
  }),
});

export const {
  useSendOtpMutation,
  useVerifyOtpMutation,
  useOnboardingMutation,
  useGetPincodeMutation,
  useBankdetailsMutation,
  useGstverifyMutation,
  useVehicleverifyMutation,
  useLicenseverifyMutation,
  useDriver_verificationMutation,
  useDivervehicleassignMutation,
  useDeleteassignvehicleMutation,
  useUpdateassignvehicleMutation,
  useDeletevehicleMutation,
  useDeletedriverMutation,
  useVehicleeditMutation,
  useUpdatevendordetailsMutation,
  useUpdatevendorkycMutation,
  useDuplicatevehicleMutation
} = authApi;