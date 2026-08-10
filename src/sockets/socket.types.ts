export interface DriverLocationPayload {
  latitude: number;
  longitude: number;
  heading: number;
  speed: number;
  timestamp: string;
}

export interface LoadOffer {
  loadId: string;
  pickup: string;
  drop: string;
  fare: number;
  weight: number;
}

/* Payment Mode */
export type PaymentMode = 'CASH' | 'UPI' | 'CARD' | 'BANK';
/* Collection Point */
export type CollectionPoint = 'PICKUP' | 'DELIVERY';

/* Payment Method selected by Driver */
export type PaymentOption =
  | 'FULL_PICKUP'
  | 'PARTIAL_PICKUP'
  | 'PAY_AT_DELIVERY';

export interface ReceivePaymentDTO {
  loadId: string;
  driverId?: string;
  receivedAmount: number;
  paymentMode: PaymentMode;
  collectionPoint: CollectionPoint;
  paymentOption: PaymentOption;
  remarks?: string;
}

export interface GaneratePaymentOTP {
  loadId: string;
}

export interface VerifyPaymentOtpDTO {
  loadId: string;
  otp: string;
  fileUrl: string;
}
