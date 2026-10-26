import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import { RootState } from '@app/redux';

// Single base URL
// THIS IS COMPUTER IP

// const BASE_URL = 'http://192.168.1.115:4000/api/v1'; /  

// http://192.168.1.115:4000/api/v1/vendor
// export const BASE_URL = 'https://stag.motohelpindia.com/api/v1';  
export const BASE_URL = 'https://appprod.motohelp.in/api/v1';
// THIS IS EMULTER IP
// const BASE_URL = 'http://10.0.2.2:4000/api/v1';

const rawBaseQuery = fetchBaseQuery({
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  },
});

export const baseQuery: BaseQueryFn<
  FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const isAbsolute =
    args.url.startsWith('http://') ||
    args.url.startsWith('https://');

  const finalUrl = isAbsolute
    ? args.url
    : `${BASE_URL}${args.url}`;

  // console.log('API:', finalUrl);

  return rawBaseQuery(
    {
      ...args,
      url: finalUrl,
    },
    api,
    extraOptions,
  );
};