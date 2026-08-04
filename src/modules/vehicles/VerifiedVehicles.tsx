import React, { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import CustomCard from '@components/cards/CustomCard';
import spacing from '@utils/spacing';
import { colors } from '@utils/colors';
import { normalizeFont } from '@utils/responsive';
import AppHeader from '@components/custumcomponents/AppHeader';
import { useRoute } from '@react-navigation/native';
import { verifiedvehicles } from '@utils/constants';
import CustomFlatList from '@components/custumcomponents/CustomFlatList';

type RouteParams = {
  vehicleno: string;
};

export default function VehicleDetailsCard() {
  const route = useRoute<any>();
  const vehicle = route.params?.vehicle;

  console.log('Vehicle Data:', vehicle);
  useEffect(() => {
  console.log('Route Params:', route.params);
}, [route.params]);

  if (!vehicle) {
    return (
      <View style={styles.center}>
        <Text>Vehicle not found</Text>
      </View>
    );
  }

  const details = vehicle?.fullData?.vehicleDetails;
  console.log('vehicle details',details)
  const dhalasize = `Length -${details?.length} ft x Width ${details?.width} ft x Height ${details?.height} ft`;
  if (!details) {
    return (
      <View style={styles.center}>
        <Text>No vehicle details available</Text>
      </View>
    );
  }

  return (
    <>
      <AppHeader title="Vehicle Details" />

      <CustomFlatList
        data={[details]} // ✅ use details
        contentContainerStyle={styles.container}
        renderItem={() => (
       <>
            {/* Vehicle Number */}
            <Text style={styles.vehicleNo}>
              Vehicle No : {details.registration_no}
            </Text>

            {/* Owner */}
            <View style={styles.row}>
              <Text style={styles.label}>Loading Capacity ( Wt ) :</Text>
              <Text style={styles.value}>{details?.vehicle_weight}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Segment :</Text>
              <Text style={styles.value}>{details?.vehiclecategory}</Text>
            </View>

            {/* Body Type */}
            <View style={styles.row}>
              <Text style={styles.label}>Body Type :</Text>
              <Text style={styles.value}>{details.body_type}</Text>
            </View>

            {/* Manufacturer */}
            <View style={styles.row}>
              <Text style={styles.label}>Dhala Size :</Text>
              <Text style={styles.value}>{dhalasize}</Text>
            </View>

            {/* Vehicle Images */}
            <Text style={styles.imageTitle}>Real Image Of Vehicle</Text>

            {vehicle?.fullData?.vehiclePhotos?.length > 0 ? (
              <View style={styles.imageColumn}>
                {vehicle.fullData.vehiclePhotos.map(
                  (item: any, index: number) => (
                    <View key={index} style={styles.imageWrapper}>
                      <Text style={styles.imageLabel}>
                        {item.photo_type
                          ?.replace('_', ' ')
                          ?.toUpperCase()}
                      </Text>

                      <Image
                        source={{ uri: item.photo_url }}
                        style={styles.image}
                      />
                    </View>
                  ),
                )}
              </View>
            ) : (
              <Text style={styles.noImage}>
                No vehicle images available
              </Text>
            )}
        </>
        )}
      />
    </>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    paddingBottom: spacing.lg,
    backgroundColor:'#ffff'
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },



  vehicleNo: {
    flex:1,
    justifyContent:'center',
    alignSelf:'center',
    fontSize: normalizeFont(16),
    fontWeight: '600',
    color: colors.primary,
    marginBottom: spacing.lg,
  },

  row: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },

  label: {
    width: 'auto',
    color:'#2A2A2A',
    fontSize: normalizeFont(16),
    fontWeight: 'semibold',
  },

  value: {
    flex: 1,
    fontSize: normalizeFont(16),
    color: '#333',
  },



  imageTitle: {
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    color: colors.primary,
    fontWeight: 'semibold',
    fontSize: normalizeFont(14),

  },

  imageColumn: {
    width: '100%',
  },
  imageWrapper: {
    marginBottom: spacing.md,
    alignItems: 'center',
    padding:5
  },

  imageLabel: {
    marginBottom: spacing.xs,
    fontSize: normalizeFont(13),
    fontWeight: '500',
    color: '#555',
    alignSelf: 'flex-start',
  },

  image: {
    width:396,
    height: 146,
    borderRadius: spacing.sm,
    resizeMode: 'cover',
    backgroundColor: '#eee',
  },

  noImage: {
    textAlign: 'center',
    color: '#999',
    marginTop: 10,
  },
});
