import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import DashboardAppheader from '@components/custumcomponents/DashboardAppheader';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import spacing from '@utils/spacing';
import { moderateScale, hp, wp } from '@utils/responsive';
import { HOME_ROUTES } from '@navigation/routes';
import CustomBottomSheet from '@components/modal/CustomBottomSheet';
import AdvancedMap from '@components/maps/AdvancedMap';
import { useSocketDrivers } from './../../hooks/useSocketDrivers';
import { useAnimatedDrivers } from './../../hooks/useAnimatedDrivers';
import { useMapboxSearch } from './../../hooks/useMapboxSearch';
import { useRoute } from './../../hooks/useRoute';
import { Driver } from '@components/maps/types';
import { colors } from '@utils/colors';
import MapView, { Marker } from 'react-native-maps';

const dashboardCards = [
  {
    title: 'Operation',
    icon: (
      <Ionicons
        name="reload-circle-outline"
        size={moderateScale(26)}
        color="#385380"
      />
    ),
    route: 'Tracking',
  },
  {
    title: 'Billing',
    icon: (
      <Ionicons
        name="document-text-outline"
        size={moderateScale(26)}
        color="#385380"
      />
    ),
    route: 'Billing',
  },
  {
    title: 'Vehicle',
    icon: (
      <MaterialCommunityIcons
        name="truck-outline"
        size={moderateScale(26)}
        color="#385380"
      />
    ),
    route: 'Vehicle',
  },
  {
    title: 'Driver',
    icon: (
      <Ionicons
        name="person-outline"
        size={moderateScale(26)}
        color="#385380"
      />
    ),
    route: HOME_ROUTES.DRIVER_ONBOARDSCREEN,
  },
];

export default function Dashboard() {
  const navigation = useNavigation<any>();
  const socketDrivers = useSocketDrivers();
  const drivers = useAnimatedDrivers(socketDrivers);
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const searchHook = useMapboxSearch();
  const { route, eta, distance } = useRoute();
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [sheetConfig, setSheetConfig] = useState({
    visible: false,
    title: '',
    actions: [] as { label: string; value: string }[],
  });
  // console.log(drivers)

  return (
    <View style={styles.container}>
      {/* Header */}
      <DashboardAppheader
        title="Tracking"
        notificationCount={3}
        onMenuPress={() => navigation.openDrawer()}
        onNotificationPress={() => { }}
      />

      {/* Map (FULL SCREEN) */}
      <View style={styles.mapContainer}>
        {/* <AdvancedMap
          drivers={drivers}
          selectedDriver={selectedDriver}
          onMarkerPress={setSelectedDriver}
          searchHook={searchHook}
          route={route}
          eta={eta}
          distance={distance}
          showSearch={false}
        /> */}
        <MapView
          style={StyleSheet.absoluteFillObject}
          showsUserLocation
          showsMyLocationButton
          initialRegion={{
            latitude: 19.1458,
            longitude: 72.9306,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
        >
          <Marker
            coordinate={{
              latitude: 19.1458,
              longitude: 72.9306,
            }}
            title="Bhandup"
            description="Bhandup West, Mumbai"
          />
        </MapView>
      </View>

      {/* Bottom Overlay Cards */}
      <View style={styles.cardSectionOverlay}>
        <View style={styles.handle} />

        <View style={styles.cardRow}>
          {dashboardCards.map(item => (
            <TouchableOpacity
              key={item.title}
              style={styles.touchCard}
              activeOpacity={0.8}
              onPress={() => {
                setActiveCard(item.title);
                handleCardPress(item, navigation, setSheetConfig);
              }}
            >
              <View style={styles.card}>
                <View style={styles.iconWrapper}>
                  {React.cloneElement(item.icon, {
                    color:
                      activeCard === item.title
                        ? colors.primary // ✅ active color
                        : colors.primary, // ✅ default color (grey)
                  })}
                </View>

                <Text
                  style={[
                    styles.cardText,
                    {
                      color:
                        activeCard === item.title
                          ? colors.primary // ✅ active color
                          : colors.primary, // ✅ default color
                    },
                  ]}
                >
                  {item.title}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <CustomBottomSheet
        visible={sheetConfig.visible}
        title={sheetConfig.title}
        actions={sheetConfig.actions}
        onClose={() => setSheetConfig(prev => ({ ...prev, visible: false }))}
        onAction={value =>
          handleSheetAction(value, sheetConfig, navigation, setSheetConfig)
        }
      />
    </View>
  );
}

/* -------------------- HANDLERS -------------------- */

const handleCardPress = (item: any, navigation: any, setSheetConfig: any) => {
  if (item.title === 'Driver') {
    setSheetConfig({
      visible: true,
      title: 'Driver',
      actions: [
        { label: 'Onboard', value: 'onboard' },
        { label: 'Log Details', value: 'add' },
        { label: 'Payment', value: 'payment' },
        { label: 'Expense', value: 'expense' },
        { label: 'Information', value: 'info' },
        { label: 'Discontinue', value: 'discontinue' },
      ],
    });
  } else if (item.title === 'Vehicle') {
    setSheetConfig({
      visible: true,
      title: 'Vehicle',
      actions: [
        { label: 'Add / Verified', value: 'add' },
        { label: 'Assign', value: 'assign' },
        { label: 'Maintainence', value: 'details' },
        { label: 'Information', value: 'vehicleinfo' },
        { label: 'Expiry', value: 'Expiry' },
        { label: 'Discontinue', value: 'Discontinuevehicle' },
      ],
    });
  } else {
    navigation.navigate(item.route);
  }
};

const handleSheetAction = (
  value: string,
  sheetConfig: any,
  navigation: any,
  setSheetConfig: any,
) => {
  setSheetConfig((prev: any) => ({ ...prev, visible: false }));

  if (sheetConfig.title === 'Driver') {
    if (value === 'onboard')
      navigation.navigate(HOME_ROUTES.DRIVER_ONBOARDSCREEN);
    if (value === 'discontinue')
      navigation.navigate(HOME_ROUTES.DRIVERDISCONTINUELIST);
  }

  if (sheetConfig.title === 'Vehicle') {
    if (value === 'assign') navigation.navigate(HOME_ROUTES.ASSIGNVEHICLE);
    if (value === 'add') navigation.navigate(HOME_ROUTES.VEHICLE_SCREEN, {
    from: 'dashboard',
  },);
    if (value === 'Discontinuevehicle')
      navigation.navigate(HOME_ROUTES.DISCONTINUEVEHICLE);
    if (value === 'Expiry') navigation.navigate(HOME_ROUTES.VEHICLEEXPIRY);
  }
};

/* -------------------- STYLES -------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  mapContainer: {
    flex: 1,
  },

  /* Overlay Card */
  cardSectionOverlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: hp(14),
    backgroundColor: '#fff',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    borderTopLeftRadius: moderateScale(18),
    borderTopRightRadius: moderateScale(18),
    elevation: 20,
  },

  /* Drag Handle */
  handle: {
    width: wp(12),
    height: moderateScale(4),
    backgroundColor: colors.background,
    alignSelf: 'center',
    borderRadius: moderateScale(10),
    marginBottom: spacing.sm,
  },

  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  touchCard: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  card: {
    width: wp(18), // ✅ slightly smaller for perfect spacing
    height: hp(10),
    borderRadius: moderateScale(10),
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconWrapper: {
    marginBottom: spacing.xs,
    fontSize: 18,
    color: colors.text,
  },

  cardText: {
    fontSize: moderateScale(12),
    color: colors.primary,
    textAlign: 'center',
  },
  activeCard: {
    backgroundColor: colors.primary,
    elevation: 5,
  },

  activeText: {
    color: colors.background,
  },
});
