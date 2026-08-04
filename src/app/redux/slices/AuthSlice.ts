import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from '../types';

const initialState: AuthState = {
  token: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,
  kyc_verified: false,
  vehicle_verified: false,
  vendor_onboarded: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthData: (
      state,
      action: PayloadAction<{
        token: string;
        refreshToken?: string | null;
        user: User;
        kyc_verified?: boolean;
        vehicle_verified?: boolean;
        vendor_onboarded?: boolean;
      }>,
    ) => {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken || null;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.vendor_onboarded = action.payload.vendor_onboarded || false;
      state.kyc_verified = action.payload.kyc_verified || false;
      state.vehicle_verified = action.payload.vehicle_verified || false;
    },
    setVendorOnboarded: (state, action: PayloadAction<boolean>) => {
  state.vendor_onboarded = action.payload;
},

setVehicleVerified: (state, action: PayloadAction<boolean>) => {
  state.vehicle_verified = action.payload;
},

setKycVerified: (state, action: PayloadAction<boolean>) => {
  state.kyc_verified = action.payload;
},

    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },

    logout: state => {
      state.token = null;
      state.refreshToken = null;
      state.user = null;
      state.isAuthenticated = false;
    },
    setMobile: (state, action: PayloadAction<string>) => {
      if (!state.user) {
        state.user = {} as User;
      }
      state.user.mobile = action.payload;
    },
  },
});

export const {
  setAuthData,
  updateUser,
  logout,
  setMobile,
  setVendorOnboarded,
  setVehicleVerified,
  setKycVerified,
} = authSlice.actions;
export default authSlice.reducer;
