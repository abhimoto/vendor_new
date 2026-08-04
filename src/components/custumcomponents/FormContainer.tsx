import React from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Props {
  children: React.ReactNode;
  containerStyle?: ViewStyle;
  scrollStyle?: ViewStyle;
  keyboardOffset?: number;
  disableTopSafeArea?: boolean;
}

export default function FormContainer({
  children,
  containerStyle,
  scrollStyle,
  keyboardOffset = 20,
  disableTopSafeArea,
}: Props) {
  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={disableTopSafeArea ? ['bottom'] : ['top', 'bottom']}
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={keyboardOffset}
      >
        <ScrollView
          contentContainerStyle={[styles.scrollContainer, scrollStyle]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          <View style={[styles.container, containerStyle]}>{children}</View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  flex: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40, // prevent bottom cut
  },
  container: {
    flex: 1,
  },
});
