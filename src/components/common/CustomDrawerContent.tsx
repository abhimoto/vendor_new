// components/drawer/CustomDrawerContent.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
  ScrollView,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { Avatar, Divider, Badge, IconButton } from 'react-native-paper';
import { colors } from '@utils/colors';
import { moderateScale, wp, hp } from '@utils/responsive';
import { useAppSelector, useAppDispatch } from '@app/hooks/hooks';
import { logout } from '@app/redux/slices/AuthSlice';
import { useNavigation } from '@react-navigation/native';
import { AUTH_ROUTES } from '@navigation/routes';

interface CustomDrawerContentProps {
  props: any;
}

export default function CustomDrawerContent({ props }: CustomDrawerContentProps) {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();
  const { user, isAuthenticated, vendor_onboarded, kyc_verified, vehicle_verified } = 
    useAppSelector(state => state.auth);

  const [notifications, setNotifications] = React.useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            dispatch(logout());
            navigation.reset({
              index: 0,
              routes: [{ name: AUTH_ROUTES.LOGIN }],
            });
          },
        },
      ],
      { cancelable: true }
    );
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getVerificationStatus = () => {
    const statuses = [];
    if (kyc_verified) statuses.push('KYC Verified');
    if (vehicle_verified) statuses.push('Vehicle Verified');
    if (vendor_onboarded) statuses.push('Vendor Onboarded');
    return statuses;
  };

  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContent}>
        {/* Header Section */}
        <View style={styles.drawerHeader}>
          <View style={styles.headerContent}>
            <Avatar.Text
              size={moderateScale(60)}
              label={getInitials(user?.companyName || user?.name || 'User')}
              style={styles.avatar}
              labelStyle={styles.avatarLabel}
            />
            
            <View style={styles.userInfo}>
              <Text style={styles.userName} numberOfLines={1}>
                {user?.companyName || user?.name || 'Guest User'}
              </Text>
              <Text style={styles.userMobile} numberOfLines={1}>
                {user?.mobile || 'Not provided'}
              </Text>
            </View>
          </View>

          <View style={styles.verificationContainer}>
            {kyc_verified && (
              <View style={styles.verificationBadge}>
                <IconButton icon="check-circle" size={14} iconColor="#4CAF50" style={styles.badgeIcon} />
                <Text style={styles.verificationText}>KYC</Text>
              </View>
            )}
            {vehicle_verified && (
              <View style={styles.verificationBadge}>
                <IconButton icon="car" size={14} iconColor="#4CAF50" style={styles.badgeIcon} />
                <Text style={styles.verificationText}>Vehicle</Text>
              </View>
            )}
            {vendor_onboarded && (
              <View style={styles.verificationBadge}>
                <IconButton icon="store" size={14} iconColor="#4CAF50" style={styles.badgeIcon} />
                <Text style={styles.verificationText}>Vendor</Text>
              </View>
            )}
          </View>
        </View>

        <Divider style={styles.divider} />

        {/* Drawer Items */}
        <View style={styles.drawerItems}>
          <DrawerItem
            label="Dashboard"
            icon={({ color, size }) => (
              <IconButton icon="view-dashboard" size={size} iconColor={color} style={styles.drawerIcon} />
            )}
            labelStyle={styles.drawerLabel}
            onPress={() => props.navigation.navigate('Dashboard')}
          />

          <DrawerItem
            label="Trips"
            icon={({ color, size }) => (
              <IconButton icon="truck-fast" size={size} iconColor={color} style={styles.drawerIcon} />
            )}
            labelStyle={styles.drawerLabel}
            onPress={() => props.navigation.navigate('Trips')}
          />

          <DrawerItem
            label="Drivers"
            icon={({ color, size }) => (
              <IconButton icon="account-group" size={size} iconColor={color} style={styles.drawerIcon} />
            )}
            labelStyle={styles.drawerLabel}
            onPress={() => props.navigation.navigate('Drivers')}
          />

          <DrawerItem
            label="Vehicles"
            icon={({ color, size }) => (
              <IconButton icon="car-multiple" size={size} iconColor={color} style={styles.drawerIcon} />
            )}
            labelStyle={styles.drawerLabel}
            onPress={() => props.navigation.navigate('Vehicles')}
          />

          <DrawerItem
            label="Reports"
            icon={({ color, size }) => (
              <IconButton icon="file-chart" size={size} iconColor={color} style={styles.drawerIcon} />
            )}
            labelStyle={styles.drawerLabel}
            onPress={() => props.navigation.navigate('Reports')}
          />

          <Divider style={styles.divider} />

          <DrawerItem
            label="Profile"
            icon={({ color, size }) => (
              <IconButton icon="account-circle" size={size} iconColor={color} style={styles.drawerIcon} />
            )}
            labelStyle={styles.drawerLabel}
            onPress={() => props.navigation.navigate('Profile')}
          />

          <DrawerItem
            label="Settings"
            icon={({ color, size }) => (
              <IconButton icon="cog" size={size} iconColor={color} style={styles.drawerIcon} />
            )}
            labelStyle={styles.drawerLabel}
            onPress={() => props.navigation.navigate('Settings')}
          />

          <DrawerItem
            label="Help & Support"
            icon={({ color, size }) => (
              <IconButton icon="help-circle" size={size} iconColor={color} style={styles.drawerIcon} />
            )}
            labelStyle={styles.drawerLabel}
            onPress={() => props.navigation.navigate('Help')}
          />
        </View>
      </DrawerContentScrollView>

      {/* Footer Section */}
      <View style={styles.drawerFooter}>
        <Divider style={styles.divider} />
        
        {/* Notifications Toggle */}
        <View style={styles.footerItem}>
          <View style={styles.footerItemLeft}>
            <IconButton icon="bell" size={22} iconColor={colors.text} style={styles.footerIcon} />
            <Text style={styles.footerText}>Notifications</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: '#767577', true: colors.primary }}
            thumbColor={notifications ? '#fff' : '#f4f3f4'}
          />
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <IconButton icon="logout" size={22} iconColor="#D32F2F" style={styles.footerIcon} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* Version Info */}
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  drawerHeader: {
    paddingVertical: hp(2),
    paddingHorizontal: wp(4),
    backgroundColor: colors.primary + '08',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1.5),
  },
  avatar: {
    backgroundColor: colors.primary,
    marginRight: wp(4),
  },
  avatarLabel: {
    fontSize: moderateScale(20),
    fontWeight: '600',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: colors.text,
    marginBottom: hp(0.5),
  },
  userMobile: {
    fontSize: moderateScale(12),
    color: '#666',
  },
  verificationContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  verificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.3),
    borderRadius: moderateScale(12),
    marginRight: wp(2),
    marginBottom: hp(0.5),
  },
  badgeIcon: {
    margin: 0,
    padding: 0,
  },
  verificationText: {
    fontSize: moderateScale(10),
    color: '#4CAF50',
    fontWeight: '600',
    marginRight: wp(1),
  },
  divider: {
    backgroundColor: '#E0E0E0',
    height: 1,
  },
  drawerItems: {
    flex: 1,
    paddingTop: hp(1),
  },
  drawerIcon: {
    margin: 0,
  },
  drawerLabel: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    color: colors.text,
    marginLeft: -wp(2),
  },
  drawerFooter: {
    paddingBottom: hp(2),
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
  },
  footerItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerIcon: {
    margin: 0,
    marginRight: wp(4),
  },
  footerText: {
    fontSize: moderateScale(14),
    color: colors.text,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    marginTop: hp(1),
  },
  logoutText: {
    fontSize: moderateScale(14),
    color: '#D32F2F',
    fontWeight: '600',
    marginLeft: wp(2),
  },
  versionText: {
    textAlign: 'center',
    fontSize: moderateScale(10),
    color: '#999',
    marginTop: hp(2),
  },
});