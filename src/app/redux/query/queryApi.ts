import { api } from './../../../config/api';

export const queryApi = api.injectEndpoints({
  endpoints: builder => ({
    getvehicle: builder.mutation<any, { vendorid: string }>({
      query: (body) => ({
        url: 'get_vehicle',
        method: 'POST',
        body,
      }),
    }),
    validateVehicle: builder.mutation<any, any>({
      query: (body) => ({
        url: 'Vehicle_Verification',
        method: 'POST',
        body,
      }),
    }),
    getdriverdatabyscan: builder.mutation<any, { driver_id: string }>({
      query: (body) => ({
        url: 'qr_scan/driver_details',
        method: 'POST',
        body,
      }),
    }),
    getdriverdetails: builder.mutation<any, { vendorid: string }>({
      query: (body) => ({
        url: 'get_DriverDetails',
        method: 'POST',
        body,
      }),
    }),
    getavailabledrivers: builder.mutation<any, { vendorId: string }>({
      query: (body) => ({
        url: 'get_DriverAvailable',
        method: 'POST',
        body,
      }),
    }),
    getavailablevehicles: builder.mutation<any, { vendorId: string }>({
      query: (body) => ({
        url: 'get_VehicleAvailable',
        method: 'POST',
        body,
      }),
    }),
    getVehicleassigned: builder.mutation<any, { VendorID: string; verify_flag: 'Y' | 'N' }>({
      query: (body) => ({
        url: 'get_Driver_Vehicle_Assign',
        method: 'POST',
        body,
      }),
    }),
    getpancard: builder.mutation<any, { pan_number: string }>({
      query: (body) => ({
        url: 'pancard',
        method: 'POST',
        body,
      }),
    }),
    getAvailableDrivers: builder.query<any, { vendorId: string }>({
      query: (body) => ({
        url: 'get_DriverAvailable',
        method: 'POST',
        body,
      }),

    }),
    getAvailableVehicless: builder.query<any, { vendorId: string }>({
      query: (body) => ({
        url: 'get_VehicleAvailable',
        method: 'POST',
        body,
      }),
      keepUnusedDataFor: 0,
    }),
    getVehicleAssigned: builder.query<any, { VendorID: string; verify_flag: 'Y' | 'N' }>({
      query: (body) => ({
        url: 'get_Driver_Vehicle_Assign',
        method: 'POST',
        body,
      }),
      keepUnusedDataFor: 0,
      // providesTags: ['Assignments'],
    }),
    getexpiryAlerts: builder.query<any, { vendorid: string }>({
      query: (body) => ({
        url: 'expiry-alerts',
        method: 'POST',
        body,
      }),
      keepUnusedDataFor: 0
    }),
    getunAssigned: builder.query<any, { vendorid: string }>({
      query: (body) => ({
        url: 'get_unassign_vehicle',
        method: 'POST',
        body
      })

    }),
    getunAssignedDrivers: builder.query<any, { vendorid: string }>({
      query: (body) => ({
        url: 'get_unassign_driver',
        method: 'POST',
        body
      })
    }),
     getvendordetails: builder.query<any, { vendorid: string }>({
      query: (body) => ({
        url: 'get_Vendor_Details ',
        method: 'POST',
        body
      })
    }),
     getvendorkyc: builder.query<any, { vendorid: string }>({
      query: (body) => ({
        url: 'get_vendor_kyc  ',
        method: 'POST',
        body
      })
    })

    //=====query for verification=====
  }),
});

export const {
  useGetvehicleMutation,
  useValidateVehicleMutation,
  useGetdriverdatabyscanMutation,
  useGetdriverdetailsMutation,
  useGetavailabledriversMutation,
  useGetavailablevehiclesMutation,
  useGetVehicleassignedMutation,
  useGetpancardMutation,
  useGetAvailableDriversQuery,
  useGetAvailableVehiclessQuery,
  useGetVehicleAssignedQuery,
  useGetexpiryAlertsQuery,
  useGetunAssignedQuery,
  useGetunAssignedDriversQuery,
  useGetvendordetailsQuery,
  useGetvendorkycQuery

} = queryApi;