import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import commonstyles from '@utils/commonstyles';
import { colors } from '@utils/colors';
import { languages } from '@utils/constants';
import CustomRadioButton from '@components/buttons/Radiobutton';
import CustomButton from '@components/buttons/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { AUTH_ROUTES } from '@navigation/routes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@navigation/types';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;
export default function Splashscreen() {
  const navigation = useNavigation<NavigationProp>();
  const [selected, setSelected] = useState<string>('en');

  const handleNext = () => {
    navigation.navigate(AUTH_ROUTES.LOGIN);
  };

  return (
    <View
      style={[commonstyles.container, { backgroundColor: colors.background }]}
    >
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require('@assets/logo/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Language Section */}
      <View style={styles.languageContainer}>
        <Text style={styles.title}>choose your{'\n'}preferred language</Text>

        {languages.map(lang => (
          <CustomRadioButton
            key={lang.value}
            label={lang.label}
            selected={selected === lang.value}
            onPress={() => setSelected(lang.value)}
          />
        ))}
      </View>

      {/* Next Button */}
      <View style={styles.buttonContainer}>
        <CustomButton
          title="Next"
          onPress={handleNext}
          textStyle={styles.nextText}
          style={styles.nextBtn}
        />
        {/* <TouchableOpacity >
          <Text style={styles.nextText}></Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },

  logo: {
    width: 500,
    height: 400,
  },

  languageContainer: {
    marginLeft: 5,
    paddingHorizontal: 30,
  },

  title: {
    textAlign: 'left',
    fontSize: 24,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: 20,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextBtn: {
    backgroundColor: colors.primary,
    width: 213,
    height: 56,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 24,
  },
});
