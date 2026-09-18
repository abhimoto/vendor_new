import {api} from './../../config/api';

export const notificationApi = api.injectEndpoints({
  endpoints: builder => ({
    registerFcmToken: builder.mutation<
      any,
      {
        fcmToken: string;
        deviceType: string;
      }
    >({
      query: body => ({
        url: '/vendor/device-token',
        method: 'POST',
        body,
      }),
    }),

    removeFcmToken: builder.mutation<
      any,
      {
        fcmToken: string;
      }
    >({
      query: body => ({
        url: '/vendor/device-token',
        method: 'DELETE',
        body,
      }),
    }),
  }),

  overrideExisting: false,
});

export const {
  useRegisterFcmTokenMutation,
  useRemoveFcmTokenMutation,
} = notificationApi;