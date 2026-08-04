import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { colors } from '@utils/colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Image } from 'react-native';

export default function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  return (
    <View>
      <View style={styles.container}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;

          const onPress = () => {
            navigation.navigate(route.name);
          };

          if (route.name === 'Load') {
            return (
              <TouchableOpacity
                key={index}
                style={styles.centerTab}
                onPress={onPress}
              >
                <View style={styles.centerButton}>
                  <Image
                    source={require('@assets/icons/load.png')}
                    style={{ width: 31, height: 32, tintColor: '#ffffff' }}
                    resizeMode="contain"
                  />
                </View>

                <Text
                  style={{
                    marginTop: 6,
                    fontSize: 12,
                    color: isFocused ? colors.primary : colors.text,
                    fontWeight: '500',
                  }}
                >
                  New Load
                </Text>
              </TouchableOpacity>
            );
          }

          const iconMap: any = {
            Home: 'home-outline',
            Expense: 'file-document-outline',
            Payments: 'wallet-outline',
            Profile: 'account-outline',
          };

          return (
            <TouchableOpacity key={index} style={styles.tab} onPress={onPress}>

              <MaterialCommunityIcons
                name={iconMap[route.name]}
                size={22}
                color={isFocused ? colors.primary : colors.text}
              />
              <Text
                style={{
                  color: isFocused ? colors.primary : colors.text,
                  fontSize: 12,
                }}
              >
                {route.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 65,
    backgroundColor: colors.background,
    justifyContent: 'space-around',
    alignItems: 'center',
    elevation: 10,
  },

  tab: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  centerTab: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  centerButton: {
    backgroundColor: colors.primary,
    width: 60,
    height: 60,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
    transform: [{ rotate: '45deg' }],
    marginTop: -53, // lifts button but keeps label aligned
  },
});
