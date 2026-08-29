import {useMemo} from 'react';
import {useGetTrackingdetailsQuery} from '@app/redux/query/queryApi';

/* ============================================================
   API TYPES
============================================================ */

type LoadData = {
  LoadId: string;
  CustomerId: string;
  VehicleType: string;
  Weight: number | null;
  LoadStatus: string;
  LoadDriverId: string;
  LoadCreatedAt: string;
  FreightAmount: number | null;

  PickupAddressId: string;
  PickupAddressType: string;
  PickupPlaceName: string;
  PickupFullAddress: string;
  PickupLatitude: number | null;
  PickupLongitude: number | null;
  PickupContactName: string | null;
  PickupContactMobile: string | null;

  DeliveryAddressId: string;
  DeliveryAddressType: string;
  DeliveryPlaceName: string;
  DeliveryFullAddress: string;
  DeliveryLatitude: number | null;
  DeliveryLongitude: number | null;
  DeliveryContactName: string | null;
  DeliveryContactMobile: string | null;

  DriverProfileId: string;
  DriverName: string;

  VendorId: string;
  AssignmentId: string;
  VehicleId: string;
  VehicleNo: string;

  AssignedAt: string | null;
  VehicleAssignmentActive: boolean;

  TrackingId: string | null;
  TrackingDriverId: string | null;

  CurrentStatus: string | null;

  AcceptedAt: string | null;
  DriverStartedAt: string | null;
  NearPickupAt: string | null;
  ArrivedPickupAt: string | null;
  LoadingStartedAt: string | null;
  LoadingCompletedAt: string | null;
  TripStartedAt: string | null;
  NearDeliveryAt: string | null;
  ArrivedDeliveryAt: string | null;
  DeliveryCompletedAt: string | null;
  CancelledAt: string | null;

  LastLatitude: number | null;
  LastLongitude: number | null;
  LastSpeed: number | null;
  LastHeading: number | null;

  LastUpdated: string | null;
  LastLocationAt: string | null;

  CurrentPackagesLoaded: number | null;
};

type TrackingHistoryItem = {
  HistoryId: string;
  LoadId: string;
  DriverId: string;
  CustomerId: string;

  Status: string;

  Latitude: number | null;
  Longitude: number | null;

  DistanceFromPickup: number | null;
  DistanceFromDelivery: number | null;

  DocumentId: string | null;
  Remarks: string | null;

  CreatedBy: string;
  CreatedAt: string;

  PackagesLoaded: number | null;
};

type TimelineItem = {
  id: string;
  title: string;
  time: string;

  status: 'done' | 'active' | 'pending';

  originalStatus: string;

  remarks?: string | null;

  latitude?: number | null;
  longitude?: number | null;

  distanceFromPickup?: number | null;
  distanceFromDelivery?: number | null;

  packagesLoaded?: number | null;
};

/* ============================================================
   STATUS ORDER

   These are the actual statuses coming from your API.
============================================================ */

const STATUS_ORDER = [
  'PENDING',

  'DRIVER_ACCEPTED',
  'DRIVER_STARTED',
  'DRIVER_NEAR_PICKUP',

  'DRIVER_ARRIVED_PICKUP',
  'ARRIVED_PICKUP',

  'LOADING_STARTED',
  'LOADING_COMPLETED',

  'TRIP_STARTED',

  'DRIVER_NEAR_DELIVERY',
  'NEAR_DELIVERY',

  'ARRIVED_DELIVERY',

  'DELIVERY_OTP_PENDING',
  'DELIVERY_COMPLETED',
  'DELIVERED',

  'PAYMENT_PENDING',
  'PAYMENT_COMPLETED',

  'COMPLETED',

  'CANCELLED',
  'REJECTED',
  'EXPIRED',
];

/* ============================================================
   STATUS TITLES
============================================================ */

const STATUS_TITLE: Record<string, string> = {
  PENDING: 'Post',

  DRIVER_ACCEPTED: 'Booking Accepted',

  DRIVER_STARTED: 'Departed to Pickup',

  DRIVER_NEAR_PICKUP: 'Near Pickup',

  DRIVER_ARRIVED_PICKUP: 'Arrived at Pickup',

  ARRIVED_PICKUP: 'Arrived at Pickup',

  LOADING_STARTED: 'Loading Started',

  LOADING_COMPLETED: 'Loading Completed',

  TRIP_STARTED: 'Trip Started',

  DRIVER_NEAR_DELIVERY: 'Near Delivery',

  NEAR_DELIVERY: 'Near Delivery',

  ARRIVED_DELIVERY: 'Arrived at Delivery',

  DELIVERY_OTP_PENDING: 'Delivery OTP',

  DELIVERY_COMPLETED: 'Delivery Completed',

  DELIVERED: 'Delivered',

  PAYMENT_PENDING: 'Payment Pending',

  PAYMENT_COMPLETED: 'Payment Completed',

  COMPLETED: 'Completed',

  CANCELLED: 'Cancelled',

  REJECTED: 'Rejected',

  EXPIRED: 'Expired',
};

/* ============================================================
   FORMAT TIME
============================================================ */

const formatTime = (dateString?: string | null) => {
  if (!dateString) {
    return '';
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

/* ============================================================
   FORMAT DATE
============================================================ */

const formatDate = (dateString?: string | null) => {
  if (!dateString) {
    return '';
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

/* ============================================================
   HOOK
============================================================ */

export const useTracking = (loadId?: string) => {
  const {
    data: response,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetTrackingdetailsQuery(loadId!, {
    skip: !loadId,
  });

  /*
   * IMPORTANT:
   *
   * API response:
   *
   * {
   *   status: "00",
   *   message: "...",
   *   data: {
   *      load: [],
   *      history: []
   *   }
   * }
   */

  const loadList: LoadData[] = response?.data?.load ?? [];

  const history: TrackingHistoryItem[] =
    response?.data?.history ?? [];

  /*
   * ==========================================================
   * LOAD INFORMATION
   * ==========================================================
   */

  const loadInfo = useMemo(() => {
    const load = loadList[0];

    if (!load) {
      return null;
    }

    return {
      loadId: load.LoadId,

      driverId: load.DriverProfileId,

      driverName: load.DriverName,

      vehicleNo: load.VehicleNo,

      vehicleType: load.VehicleType,

      weight: load.Weight,

      loadStatus: load.LoadStatus,

      currentStatus: load.CurrentStatus,

      freightAmount: load.FreightAmount,

      loadCreatedAt: load.LoadCreatedAt,

      date: formatDate(load.LoadCreatedAt),

      /*
       * Pickup
       */

      pickupPlaceName: load.PickupPlaceName,

      pickupAddress: load.PickupFullAddress,

      pickupLatitude: load.PickupLatitude,

      pickupLongitude: load.PickupLongitude,

      pickupContactName: load.PickupContactName,

      pickupContactMobile: load.PickupContactMobile,

      /*
       * Delivery
       */

      deliveryPlaceName: load.DeliveryPlaceName,

      deliveryAddress: load.DeliveryFullAddress,

      deliveryLatitude: load.DeliveryLatitude,

      deliveryLongitude: load.DeliveryLongitude,

      deliveryContactName: load.DeliveryContactName,

      deliveryContactMobile: load.DeliveryContactMobile,

      /*
       * Assignment
       */

      assignmentId: load.AssignmentId,

      vehicleId: load.VehicleId,

      vehicleAssignmentActive:
        load.VehicleAssignmentActive,

      /*
       * Tracking
       */

      trackingId: load.TrackingId,

      trackingDriverId: load.TrackingDriverId,

      /*
       * Current location
       */

      lastLatitude: load.LastLatitude,

      lastLongitude: load.LastLongitude,

      lastSpeed: load.LastSpeed,

      lastHeading: load.LastHeading,

      lastUpdated: load.LastUpdated,

      lastLocationAt: load.LastLocationAt,

      currentPackagesLoaded:
        load.CurrentPackagesLoaded,
    };
  }, [loadList]);

  /*
   * ==========================================================
   * TIMELINE
   * ==========================================================
   */

  const timelineData: TimelineItem[] = useMemo(() => {
    if (!history.length) {
      return [];
    }

    /*
     * Sort oldest -> newest
     */

    const sortedHistory = [...history].sort(
      (a, b) =>
        new Date(a.CreatedAt).getTime() -
        new Date(b.CreatedAt).getTime(),
    );

    /*
     * Current status comes from load object.
     *
     * Example:
     *
     * DRIVER_NEAR_PICKUP
     */

    const currentStatus =
      loadList[0]?.CurrentStatus ||
      sortedHistory[sortedHistory.length - 1]?.Status;

    const currentIndex =
      STATUS_ORDER.indexOf(currentStatus || '');

    /*
     * Create timeline
     */

    return sortedHistory.map(item => {
      const status = item.Status;

      const statusIndex =
        STATUS_ORDER.indexOf(status);

      let itemStatus:
        | 'done'
        | 'active'
        | 'pending' = 'pending';

      /*
       * If status exists in STATUS_ORDER
       */

      if (
        currentIndex >= 0 &&
        statusIndex >= 0
      ) {
        if (statusIndex < currentIndex) {
          itemStatus = 'done';
        } else if (
          statusIndex === currentIndex
        ) {
          itemStatus = 'active';
        }
      }

      /*
       * Fallback:
       *
       * If backend sends a status which isn't
       * present in STATUS_ORDER, compare the
       * last history record.
       */

      if (
        currentIndex < 0 &&
        item ===
          sortedHistory[sortedHistory.length - 1]
      ) {
        itemStatus = 'active';
      }

      return {
        id: String(item.HistoryId),

        title:
          STATUS_TITLE[status] ||
          status
            ?.replace(/_/g, ' ')
            ?.replace(/\b\w/g, char =>
              char.toUpperCase(),
            ) ||
          'Unknown Status',

        time: formatTime(item.CreatedAt),

        status: itemStatus,

        originalStatus: status,

        remarks: item.Remarks,

        latitude: item.Latitude,

        longitude: item.Longitude,

        distanceFromPickup:
          item.DistanceFromPickup,

        distanceFromDelivery:
          item.DistanceFromDelivery,

        packagesLoaded:
          item.PackagesLoaded,
      };
    });
  }, [history, loadList]);

  return {
    response,

    loadList,

    history,

    timelineData,

    loadInfo,

    isLoading,

    isFetching,

    isError,

    error,

    refetch,
  };
};

