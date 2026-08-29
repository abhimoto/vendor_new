import React, { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { Provider as ReduxProvider } from 'react-redux';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { store, persistor } from '@app/redux';
import { darkTheme, lightTheme } from '@utils/colors';
import RootNavigator from '@navigation/RootNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PersistGate } from 'redux-persist/integration/react';
import { useAppDispatch } from '@app/hooks/hooks';
import { resetMpinSession } from '@app/redux/slices/AuthSlice';

function AppContent() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(resetMpinSession());
  }, [dispatch]);

  return <RootNavigator />;
}
export default function App() {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? darkTheme : lightTheme;

  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PaperProvider theme={theme}>
          <SafeAreaProvider>
            <NavigationContainer>
                <AppContent />
            </NavigationContainer>
          </SafeAreaProvider>
        </PaperProvider>
      </PersistGate>
    </ReduxProvider>
  );
}
