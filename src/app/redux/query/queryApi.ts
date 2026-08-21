import { api } from './../../../config/api';

export const queryApi = api.injectEndpoints({
  endpoints: builder => ({
    getvehicle: builder.mutation<any, void>({
      query: () => ({
        url: '/vendor/vehicle/vehicles',
        method: 'POST',
        body: {},
      }),
    }),
    vehicledetails: builder.query<any, string | void>({
      query: (VehicleId) => ({
        url: VehicleId
          ? `/vendor/vehicle/details?VehicleId=${VehicleId}`
          : '/vendor/vehicle/details',
        method: 'GET',
      }),
    }),
    validateVehicle: builder.mutation<any, any>({
      query: (body) => ({
        url: 'Vehicle_Verification',
        method: 'POST',
        body,
      }),
    }),

    getdriverdatabyscan: builder.query<any, { userId?: string; notificationId?: string }>({
      query: ({ userId, notificationId }) => ({
        url: '/vendor/verify',
        method: 'GET',
        params: {
          userId,
          notificationId,
        },
      }),
    }),
    getdriverdetails: builder.mutation<any, { vendorid: string }>({
      query: (body) => ({
        url: 'get_DriverDetails',
        method: 'POST',
        body,
      }),
    }),
    checkDuplicateVehicle: builder.query<any, string>({
      query: (vehicleNo) => ({
        url: '/vendor/check-duplicate',
        method: 'GET',
        params: { vehicleNo },
      }),
    }),
    getCounts: builder.query<any, void>({
      query: () => ({
        url: '/vendor/dashboard/counts',
        method: 'GET',
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
        url: '/vendor/vehicle/unassigned',
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
        url: '/vendor/kyc/pan',
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
    getPincode: builder.query<any, { pincode: string }>({
      query: ({ pincode }) => ({
        url: `/vendor/location/pincode?search=${pincode}`,
        method: 'GET',
      }),
    }),
    getvehiceimages: builder.query<any, { segmentCode: string }>({
      query: ({ segmentCode }) => ({
        url: '/vendor/vehicle/body-type-images',
        method: 'GET',
        params: { segmentCode },
      }),
    }),
    getunAssignedVehicles: builder.query<any, void>({
      query: () => ({
        url: '/vendor/vehicle/unassigned',
        method: 'GET',
      }),
    }),
        getProfiledetails: builder.query<any, void>({
      query: () => ({
        url: '/vendor/profile',
        method: 'GET',
      }),
    }),

    getunAssignedDrivers: builder.query<any, void>({
      query: () => ({
        url: '/vendor/vehicle/unassigneddrivers',
        method: 'GET',
      }),
    }),
    getvendordetails: builder.query<any, { vendorid: string }>({
      query: (body) => ({
        url: 'get_Vendor_Details ',
        method: 'POST',
        body
      })
    }),
    getassigneddetails: builder.query<any, void>({
      query: () => ({
        url: '/vendor/vehicle/driver-vehicle-assignments',
        method: 'GET',
      }),
    }),
    getvendorkyc: builder.query<any, { vendorid: string }>({
      query: (body) => ({
        url: 'get_vendor_kyc  ',
        method: 'POST',
        body
      })
    }),
    getState: builder.query<any, void>({
      query: () => ({
        url: '/location/states',
        method: 'GET',
      }),
    }),

    getDistricts: builder.query<any, { state: string }>({
      query: ({ state }) => ({
        url: `/location/districts?state=${encodeURIComponent(state)}`,
        method: 'GET',
      }),
    }),
    vehicletypedetailswithcapacity: builder.query<any, { LoadingCapacity: string }>({
      query: ({ LoadingCapacity }) => ({
        url: `/vendor/vehicle/vehicle-type-details-by-capacity?LoadingCapacity=${encodeURIComponent(
          LoadingCapacity,
        )}`,
        method: 'GET',
      }),
    }),
    verifyDriverQr: builder.query<any, string>({
      query: (qrUrl) => ({
        url: qrUrl,
        method: 'GET',
      }),

    })

    //=====query for verification=====
  }),

});

export const {
  useGetvehicleMutation,
  useValidateVehicleMutation,
  useGetdriverdatabyscanQuery,
  useLazyGetdriverdatabyscanQuery,
  useGetCountsQuery,
  useGetdriverdetailsMutation,
  useGetavailabledriversMutation,
  useGetavailablevehiclesMutation,
  useGetVehicleassignedMutation,
  useGetpancardMutation,
  useGetAvailableDriversQuery,
  useGetAvailableVehiclessQuery,
  useGetVehicleAssignedQuery,
  useGetexpiryAlertsQuery,
  useGetunAssignedVehiclesQuery,
  useGetunAssignedDriversQuery,
  useGetvendordetailsQuery,
  useGetvendorkycQuery,
  useLazyGetvendordetailsQuery,
  useVehicledetailsQuery,
  useLazyVerifyDriverQrQuery,
  useLazyGetPincodeQuery,
  useGetStateQuery,
  useLazyGetStateQuery,
  useGetDistrictsQuery,
  useLazyGetDistrictsQuery,
  useGetassigneddetailsQuery,
  useLazyCheckDuplicateVehicleQuery,
  useGetProfiledetailsQuery,
  useGetvehiceimagesQuery,
  useVehicletypedetailswithcapacityQuery
} = queryApi;