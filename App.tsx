import React, {useEffect} from 'react';
import {useColorScheme} from 'react-native';
import {Provider as ReduxProvider} from 'react-redux';
import {Provider as PaperProvider} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';
import {store, persistor} from '@app/redux';
import {darkTheme, lightTheme} from '@utils/colors';
import RootNavigator from '@navigation/RootNavigator';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {PersistGate} from 'redux-persist/integration/react';
import {useAppDispatch} from '@app/hooks/hooks';
import {resetMpinSession} from '@app/redux/slices/AuthSlice';

// FCM
import {
  requestNotificationPermission,
} from '@services/notification/notificationPermission';



import {
  getFCMToken,
} from '@services/notification/fcm';

import {
  initializeNotificationListeners,
} from '@services/notification/notificationHandler';

function AppContent() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(resetMpinSession());
  }, [dispatch]);

  // FCM initialization
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const setupFCM = async () => {
      try {
        // 1. Ask notification permission
        await requestNotificationPermission();


        // 3. Get FCM device token
        await getFCMToken();

        // 4. Listen for foreground notifications
        unsubscribe = initializeNotificationListeners();

        console.log('FCM SETUP SUCCESS');
      } catch (error) {
        console.error('FCM SETUP ERROR:', error);
      }
    };

    setupFCM();

    return () => {
      unsubscribe?.();
    };
  }, []);

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