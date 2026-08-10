import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { colors } from '@utils/colors';
import {
  hp,
  wp,
  moderateScale,
  normalizeFont,
} from '@utils/responsive';

interface Props {
  onFindLoad?: () => void;
  onCommunication?: () => void;
}

export default function DashboardQuickActions({
  onFindLoad,
  onCommunication,
}: Props) {
  return (
    <View style={styles.container}>
      {/* Find Load */}

      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.item}
        onPress={onFindLoad}>
       <Text style={styles.title}>
          Vehicle No
        </Text>
      </TouchableOpacity>

      {/* <View style={styles.divider} /> */}

      {/* Communication */}

      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.item}
        onPress={onCommunication}>
   <MaterialCommunityIcons
          name="package-variant-closed"
          size={moderateScale(34)}
          color={colors.primary}
        />

        <Text style={styles.title}>
          Find Load
        </Text>

      
        {/* <Image
          source={require('@assets/icons/communication.png')}
          style={styles.logo}
          resizeMode="contain"
        /> */}
        {/* <MaterialIcons
          name="support-agent"
          size={moderateScale(34)}
          color={colors.primary}
        /> */}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(0.5),
    borderBottomWidth: 1,
    borderBottomColor: '#ECECEC',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  logo: {
    height: 40,
    width: 40
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp(3),
  },

  divider: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: '#E5E5E5',
  },

  title: {
    marginLeft: wp(2),
    color: colors.primary,
    fontSize: normalizeFont(16),
    fontWeight: '600',
  },
});