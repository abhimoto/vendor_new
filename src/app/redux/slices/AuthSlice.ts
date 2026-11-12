import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from '../types';

const initialState: AuthState = {
  token: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,
  vendor_onboarded: false,
  vehicle_verified: false,
  kyc_verified: false,
  isMpincreated: false,
  isMpinVerified: false,
};

const authSlice = createSlice({
  name: 'auth',

  initialState,

  reducers: {
    /**
     * Called after OTP login / session restoration
     */
    setAuthData: (
      state,
      action: PayloadAction<{
        token: string;
        refreshToken?: string | null;

        user: User;

        vendor_onboarded?: boolean;
        vehicle_verified?: boolean;
        kyc_verified?: boolean;
        isMpincreated?: boolean;

        /**
         * Runtime only.
         * Usually false after OTP login.
         */
        isMpinVerified?: boolean;
      }>,
    ) => {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken ?? null;

      state.user = action.payload.user;

      state.isAuthenticated = true;

      state.vendor_onboarded =
        action.payload.vendor_onboarded ?? false;

      state.vehicle_verified =
        action.payload.vehicle_verified ?? false;

      state.kyc_verified =
        action.payload.kyc_verified ?? false;

      state.isMpincreated =
        action.payload.isMpincreated ?? false;

      state.isMpinVerified =
        action.payload.isMpinVerified ?? false;
    },

    setVendorOnboarded: (
      state,
      action: PayloadAction<boolean>,
    ) => {
      state.vendor_onboarded = action.payload;
    },

    setVehicleVerified: (
      state,
      action: PayloadAction<boolean>,
    ) => {
      state.vehicle_verified = action.payload;
    },

    setKycVerified: (
      state,
      action: PayloadAction<boolean>,
    ) => {
      state.kyc_verified = action.payload;
    },

    setMpinCreated: (
      state,
      action: PayloadAction<boolean>,
    ) => {
      state.isMpincreated = action.payload;
    },

    setMpinVerified: (
      state,
      action: PayloadAction<boolean>,
    ) => {
      state.isMpinVerified = action.payload;
    },

    updateUser: (
      state,
      action: PayloadAction<Partial<User>>,
    ) => {
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload,
        };
      }
    },

    logout: state => {
      state.token = null;
      state.refreshToken = null;
      state.user = null;

      state.isAuthenticated = false;

      state.vendor_onboarded = false;
      state.vehicle_verified = false;
      state.kyc_verified = false;

      state.isMpincreated = false;
      state.isMpinVerified = false;
    },

    /**
     * Used when app starts and MPIN must be entered again.
     */
    resetMpinSession: state => {
      state.isMpinVerified = false;
    },

    setMobile: (
      state,
      action: PayloadAction<string>,
    ) => {
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

  setVendorOnboarded,
  setVehicleVerified,
  setKycVerified,

  setMpinCreated,
  setMpinVerified,

  resetMpinSession,

  logout,
  setMobile,
} = authSlice.actions;

export default authSlice.reducer;