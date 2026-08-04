import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '@app/redux';
import ENV from './index';

export const BASE_URL = 'https://uat.motohelpindia.com/vendor/v1/';

export const api = createApi({
  reducerPath: 'api',

  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,

    prepareHeaders: (headers, { getState }) => {
      console.log("🔥 REQUEST ENTERED RTK QUERY");

      const token = (getState() as RootState).auth.token;

      console.log("🔥 TOKEN:", token);

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      return headers;
    },
  }),

  tagTypes: ['User'],
  endpoints: () => ({}),
});
console.log(api)