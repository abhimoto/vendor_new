import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useMemo, useState} from 'react';
import commonstyles from '@utils/commonstyles';
import AppHeader from '@components/custumcomponents/AppHeader';
import SearchInput from '@components/custumcomponents/SearchInput';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  moderateScale,
  wp,
  hp,
  normalizeFont,
} from '@utils/responsive';
import CustomFlatList from '@components/custumcomponents/CustomFlatList';
import {colors} from '@utils/colors';
import {useGetvehicleExpiryDetailsQuery} from '@app/redux/query/queryApi';


// =============================
// API TYPE
// =============================

interface VehicleExpiryResponse {
  VehicleNumber: string;

  RegistrationStatus: string | null;

  PermitValidityDate: string | null;
  PermitIssueDate: string | null;
  PermitNumber: string | null;

  PucUpto: string | null;
  PucNumber: string | null;

  InsuranceUpto: string | null;
  InsurancePolicyNumber: string | null;
  InsuranceCompany: string | null;

  FitnessUpto: string | null;
}

interface ApiResponse {
  status: string;
  message: string;
  data: VehicleExpiryResponse[];
}


// =============================
// UI TYPE
// =============================

interface ExpiryAlertItem {
  VehicleNumber: string;
  expiryType: string;
  expiryDate: string;
  daysLeft: number;
  status: 'EXPIRED' | 'ACTIVE';
}


// =============================
// DATE FORMAT
// =============================

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-GB');
};


// =============================
// DAYS CALCULATION
// =============================

const getDaysLeft = (date: string) => {
  const expiryDate = new Date(date);

  const today = new Date();

  // Remove time portion
  today.setHours(0, 0, 0, 0);
  expiryDate.setHours(0, 0, 0, 0);

  const difference =
    expiryDate.getTime() - today.getTime();

  return Math.ceil(
    difference / (1000 * 60 * 60 * 24),
  );
};


// =============================
// COMPONENT
// =============================

export default function VehicleExpiry() {
  const [search, setSearch] = useState('');

  // =============================
  // API
  // =============================

  const {
    data: expiryData,
    isLoading,
    isError,
  } = useGetvehicleExpiryDetailsQuery();


  // =============================
  // TRANSFORM API DATA
  // =============================

  const expiryAlerts = useMemo<ExpiryAlertItem[]>(() => {
    if (!expiryData?.data) {
      return [];
    }

    const alerts: ExpiryAlertItem[] = [];

    expiryData.data.forEach(
      (vehicle: VehicleExpiryResponse) => {

        // -------------------------
        // Permit
        // -------------------------

        if (vehicle.PermitValidityDate) {
          const daysLeft = getDaysLeft(
            vehicle.PermitValidityDate,
          );

          alerts.push({
            VehicleNumber: vehicle.VehicleNumber,
            expiryType: 'Permit',
            expiryDate: vehicle.PermitValidityDate,
            daysLeft,
            status:
              daysLeft < 0
                ? 'EXPIRED'
                : 'ACTIVE',
          });
        }

        // -------------------------
        // PUC
        // -------------------------

        if (vehicle.PucUpto) {
          const daysLeft = getDaysLeft(
            vehicle.PucUpto,
          );

          alerts.push({
            VehicleNumber: vehicle.VehicleNumber,
            expiryType: 'PUC',
            expiryDate: vehicle.PucUpto,
            daysLeft,
            status:
              daysLeft < 0
                ? 'EXPIRED'
                : 'ACTIVE',
          });
        }

        // -------------------------
        // Insurance
        // -------------------------

        if (vehicle.InsuranceUpto) {
          const daysLeft = getDaysLeft(
            vehicle.InsuranceUpto,
          );

          alerts.push({
            VehicleNumber: vehicle.VehicleNumber,
            expiryType: 'Insurance',
            expiryDate: vehicle.InsuranceUpto,
            daysLeft,
            status:
              daysLeft < 0
                ? 'EXPIRED'
                : 'ACTIVE',
          });
        }

        // -------------------------
        // Fitness
        // -------------------------

        if (vehicle.FitnessUpto) {
          const daysLeft = getDaysLeft(
            vehicle.FitnessUpto,
          );

          alerts.push({
            VehicleNumber: vehicle.VehicleNumber,
            expiryType: 'Fitness',
            expiryDate: vehicle.FitnessUpto,
            daysLeft,
            status:
              daysLeft < 0
                ? 'EXPIRED'
                : 'ACTIVE',
          });
        }
      },
    );

    return alerts;
  }, [expiryData]);


  // =============================
  // SEARCH + SORT
  // =============================

  const filteredVehicles = useMemo(() => {
    return expiryAlerts
      .filter(item =>
        item.VehicleNumber
          ?.toLowerCase()
          .includes(search.toLowerCase()),
      )
      .sort(
        (a, b) =>
          a.daysLeft - b.daysLeft,
      );
  }, [expiryAlerts, search]);


  // =============================
  // RENDER ITEM
  // =============================

  const renderItem = ({
    item,
  }: {
    item: ExpiryAlertItem;
  }) => {

    const expired =
      item.status === 'EXPIRED';

    return (
      <View
        style={[
          styles.card,
          expired && styles.expiredCard,
        ]}
      >

        {/* =====================
            TOP ROW
        ===================== */}

        <View style={styles.topRow}>

          <Ionicons
            name="car-outline"
            size={18}
            color="#000"
          />

          <Text style={styles.vehicleNo}>
            {item.VehicleNumber}
          </Text>

          {/* =====================
              BADGE
          ===================== */}

          <View
            style={[
              styles.badge,
              {
                backgroundColor: expired
                  ? '#FFCDD2'
                  : '#E3F2FD',
              },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                {
                  color: expired
                    ? 'red'
                    : '#0D47A1',
                },
              ]}
            >
              {expired
                ? 'Expired'
                : `${item.daysLeft} days left`}
            </Text>
          </View>

        </View>


        {/* =====================
            EXPIRY TYPE
        ===================== */}

        <Text style={styles.expiryType}>
          {item.expiryType}
        </Text>


        {/* =====================
            EXPIRY DATE
        ===================== */}

        <Text
          style={[
            styles.expiryText,
            expired && styles.expiredText,
          ]}
        >
          Expiry Date :{' '}
          {formatDate(item.expiryDate)}
        </Text>

      </View>
    );
  };


  // =============================
  // UI
  // =============================

  return (
    <View style={commonstyles.container}>

      <AppHeader title="Vehicle Expiry" />

      <SearchInput
        value={search}
        onChangeText={setSearch}
      />

      <CustomFlatList
        data={filteredVehicles}
        renderItem={renderItem}
        loading={isLoading}
        emptyMessage={
          isError
            ? 'Failed to load expiry alerts'
            : 'No expiry alerts found 🚚'
        }
        contentContainerStyle={{
          padding: wp(4),
        }}
      />

    </View>
  );
}


// =============================
// STYLES
// =============================

const styles = StyleSheet.create({

  card: {
    backgroundColor: colors.background,
    borderRadius: moderateScale(10),
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(4),
    marginBottom: hp(1.5),
    borderWidth: 1,
    borderColor: colors.border,
  },

  expiredCard: {
    borderColor: 'red',
    borderWidth: 1,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1),
  },

  vehicleNo: {
    fontSize: normalizeFont(14),
    fontWeight: '600',
    color: '#000',
    marginLeft: wp(2),
  },

  badge: {
    marginLeft: 'auto',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },

  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },

  expiryType: {
    fontSize: normalizeFont(13),
    fontWeight: '500',
    color: colors.primary,
    marginBottom: hp(0.8),
  },

  expiryText: {
    fontSize: normalizeFont(12),
    color: '#666',
  },

  expiredText: {
    color: 'red',
    fontWeight: '600',
  },

});