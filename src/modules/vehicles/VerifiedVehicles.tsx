import React, { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import CustomCard from '@components/cards/CustomCard';
import spacing from '@utils/spacing';
import { colors } from '@utils/colors';
import { normalizeFont } from '@utils/responsive';
import AppHeader from '@components/custumcomponents/AppHeader';
import { useRoute } from '@react-navigation/native';
import CustomFlatList from '@components/custumcomponents/CustomFlatList';
import { useVehicledetailsQuery } from '@app/redux/query/queryApi';

type RouteParams = {
  vehicleno: string;
};

export default function VehicleDetailsCard() {
  const route = useRoute<any>();

  const vehicle = route.params?.vehicle;
// Extract VehicleId
const vehicleId = vehicle?.VehicleId;
  console.log('Vehicle Data:', vehicle);

const {
  data,
  isLoading,
  error,
} = useVehicledetailsQuery(vehicleId, {
  skip: !vehicleId,
});


  if (!vehicle) {
    return (
      <View style={styles.center}>
        <Text>Vehicle not found</Text>
      </View>
    );
  }

const details = data?.data?.[0];
if (isLoading) {
  return (
    <View style={styles.center}>
      <Text>Loading...</Text>
    </View>
  );
}
if (!details) {
  return (
    <View style={styles.center}>
      <Text>No vehicle details available</Text>
    </View>
  );
}
  console.log('vehicle details',details)
const dhalasize = `Length - ${details.DhalaLength} ft x Width - ${details.DhalaWidth} ft x Height - ${details.DhalaHeight} ft`;
  if (!details) {
    return (
      <View style={styles.center}>
        <Text>No vehicle details available</Text>
      </View>
    );
  }

 return (
  <>
    <AppHeader title="Validate Vehicles" />

    <View style={styles.container}>
      <Text style={styles.vehicleNo}>
        Vehicle No : {details.VehicleNo}
      </Text>

      {/* Details Card */}
      <View style={styles.card}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Loading Capacity</Text>
          <Text style={styles.value}>
            {details.LoadingCapacity} kg
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Make & Segment</Text>
          <Text style={styles.value}>
            {details.VehicleCategory || '-'}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Body Type</Text>
          <Text style={styles.value}>
            {details.BodyType}
          </Text>
        </View>

        {/* Dhala Size */}
        <View style={styles.dhalaContainer}>
          <View style={styles.dhalaLabel}>
            <Text style={styles.label}>
              Dhala Size
            </Text>
          </View>

          <View style={styles.dhalaTable}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeading}>
                Length
              </Text>
              <Text style={styles.tableHeading}>
                Width
              </Text>
              <Text style={styles.tableHeading}>
                Height
              </Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={styles.tableValue}>
                {details.DhalaLength} ft
              </Text>

              <Text style={styles.tableValue}>
                {details.DhalaWidth} ft
              </Text>

              <Text style={styles.tableValue}>
                {details.DhalaHeight} ft
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Images */}

      <Text style={styles.imageTitle}>
        Real Image Of Vehicle
      </Text>

      <View style={styles.imageGrid}>
        {[
          details.FrontImage,
          details.BackImage,
          details.LeftImage,
          details.RightImage,
        ]
          .filter(Boolean)
          .map((uri, index) => (
            <Image
              key={index}
              source={{ uri }}
              style={styles.image}
            />
          ))}
      </View>

      {!details.FrontImage &&
        !details.BackImage &&
        !details.LeftImage &&
        !details.RightImage && (
          <Text style={styles.noImage}>
            No vehicle images available
          </Text>
        )}
    </View>
  </>
);
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
  flex: 1,
  backgroundColor: '#fff',
  padding: 16,
},
center: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#fff',
},
vehicleNo: {
  fontSize: 18,
  fontWeight: '700',
  color: colors.text,
  alignSelf: 'center',
  marginBottom: 15,
},

card: {
  borderWidth: 1,
  borderColor: '#D8D8D8',
  borderRadius: 8,
  overflow: 'hidden',
},

infoRow: {
  flexDirection: 'row',
  borderBottomWidth: 1,
  borderBottomColor: '#D8D8D8',
},

label: {
  width: 140,
  padding: 12,
  fontSize: 14,
  fontWeight: '500',
  color: '#222',
},

value: {
  flex: 1,
  padding: 12,
  borderLeftWidth: 1,
  borderLeftColor: '#D8D8D8',
  fontSize: 14,
  color: '#222',
},

dhalaContainer: {
  flexDirection: 'row',
},

dhalaLabel: {
  width: 140,
  justifyContent: 'center',
},

dhalaTable: {
  flex: 1,
  borderLeftWidth: 1,
  borderLeftColor: '#D8D8D8',
},

tableHeader: {
  flexDirection: 'row',
  borderBottomWidth: 1,
  borderBottomColor: '#D8D8D8',
},

tableHeading: {
  flex: 1,
  textAlign: 'center',
  paddingVertical: 8,
  borderRightWidth: 1,
  borderRightColor: '#D8D8D8',
  fontSize: 13,
  fontWeight: '600',
},

tableRow: {
  flexDirection: 'row',
},

tableValue: {
  flex: 1,
  textAlign: 'center',
  paddingVertical: 10,
  borderRightWidth: 1,
  borderRightColor: '#D8D8D8',
  fontSize: 14,
},

imageTitle: {
  marginTop: 22,
  marginBottom: 12,
  color: colors.primary,
  fontWeight: '600',
  fontSize: 15,
},

imageGrid: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
},

image: {
  width: '48%',
  aspectRatio: 1.2,
  borderRadius: 6,
  marginBottom: 14,
  borderWidth: 1,
  borderColor: '#D8D8D8',
},

noImage: {
  marginTop: 20,
  textAlign: 'center',
  color: '#999',
},
});
