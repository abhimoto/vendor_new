import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type VendorStatus = {
  vehicleAdded: boolean | null;
  kycCompleted: boolean | null;
  bankAdded: boolean | null;
};

type OnboardingState = {
  vendorStatus: VendorStatus;
};

const initialState: OnboardingState = {
  vendorStatus: {
    vehicleAdded: false,
    kycCompleted: false,
    bankAdded: false,
  },
};

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    setVehicleAdded: (state, action: PayloadAction<boolean>) => {
      state.vendorStatus.vehicleAdded = action.payload;
    },

    setKycCompleted: (state, action: PayloadAction<boolean>) => {
      state.vendorStatus.kycCompleted = action.payload;
    },

    setBankAdded: (state, action: PayloadAction<boolean>) => {
      state.vendorStatus.bankAdded = action.payload;
    },

    setVendorStatus: (state, action: PayloadAction<VendorStatus>) => {
      state.vendorStatus = action.payload;
    },

    resetVendorStatus: state => {
      state.vendorStatus = {
        vehicleAdded: false,
        kycCompleted: false,
        bankAdded: false,
      };
    },
  },
});

export const {
  setVehicleAdded,
  setKycCompleted,
  setBankAdded,
  setVendorStatus,
  resetVendorStatus,
} = onboardingSlice.actions;

export default onboardingSlice.reducer;
