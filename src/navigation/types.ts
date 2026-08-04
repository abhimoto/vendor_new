export type RootStackParamList = {
  AuthStack: undefined;
  AppDrawer: undefined;
};

export type AuthStackParamList = {
  Splashscreen: undefined;
  Login: undefined;
  Signup: undefined;
  VendorOnboarding: undefined;
};

import { HOME_ROUTES } from './routes';

export type HomeStackParamList = {
  [HOME_ROUTES.HOME_CONTROLLER]: undefined;

  [HOME_ROUTES.TEMP_DASHBOARD]: undefined;

  [HOME_ROUTES.VEHICLE_SCREEN]: {
    from?: string;
  };

  [HOME_ROUTES.VALIDATE_VEHICLES]: {
    item: any;
  };

  [HOME_ROUTES.VERIFIES_VEHICLES]: {
    vehicle: any;
  };
  [HOME_ROUTES.EDITVEHICLES]: {
    EditVehicles: any;
  }

  [HOME_ROUTES.ADDBANK_DETAILS]: undefined;

  [HOME_ROUTES.DASHBOARD]: undefined;

  [HOME_ROUTES.DRIVER_ONBOARDSCREEN]: undefined;

  [HOME_ROUTES.DRIVERSCAN]: undefined;

  [HOME_ROUTES.DRIVERINDEX]: undefined;

  [HOME_ROUTES.DISCONTINUEDRIVER]: undefined;

  [HOME_ROUTES.DRIVERDISCONTINUELIST]: undefined;

  [HOME_ROUTES.ADDDRIVER]: undefined;

  [HOME_ROUTES.LICENSEADD]: undefined;

  [HOME_ROUTES.ASSIGNVEHICLE]: undefined;

  [HOME_ROUTES.DISCONTINUEVEHICLE]: undefined;

  [HOME_ROUTES.VEHICLEDISCONTINUELIST]: undefined;

  [HOME_ROUTES.VEHICLEEXPIRY]: undefined;

  [HOME_ROUTES.TRACKING]: undefined;
};

export type TabParamList = {
  Home: undefined;
  Expense: undefined;
  Load: undefined;
  Payments: undefined;
  Profile: undefined;
};
