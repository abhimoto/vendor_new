import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UserDetails = {
  vendorid: string;
  companyType: string;
  companyName: string;
  owner_name: string;
  mobileNo: string;
  Building: string;
  Area: string;
  pincode: string;
  state: string;
  Tahsil: string;
  role: string;
  status: string;
  vendor_onboarded: boolean;
  kyc_verify: boolean;
  flag: string;
  vehicle_verify_flag: string;
};

type UserDetailsState = {
  userDetails: UserDetails | null;
};

const initialState: UserDetailsState = {
  userDetails: null,
};

const userDetailsSlice = createSlice({
  name: 'userDetails',
  initialState,

  reducers: {

    // Store complete user details object
    setUserDetails: (
      state,
      action: PayloadAction<UserDetails>,
    ) => {
      state.userDetails = action.payload;
    },

    // Update specific fields dynamically
    updateUserDetails: (
      state,
      action: PayloadAction<Partial<UserDetails>>,
    ) => {
      if (state.userDetails) {
        state.userDetails = {
          ...state.userDetails,
          ...action.payload,
        };
      }
    },

    // Clear user details on logout
    resetUserDetails: state => {
      state.userDetails = null;
    },
  },
});

export const {
  setUserDetails,
  updateUserDetails,
  resetUserDetails,
} = userDetailsSlice.actions;

export default userDetailsSlice.reducer;