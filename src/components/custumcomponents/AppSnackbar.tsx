import React from 'react';
import { StyleSheet } from 'react-native';
import { Snackbar } from 'react-native-paper';

type SnackbarType = 'default' | 'success' | 'error' | 'warning';

interface AppSnackbarProps {
  visible: boolean;
  message: string;
  onDismiss: () => void;
  type?: SnackbarType;
  actionLabel?: string;
  onAction?: () => void;
  duration?: number;
}

const AppSnackbar: React.FC<AppSnackbarProps> = ({
  visible,
  message,
  onDismiss,
  type = 'default',
  actionLabel,
  onAction,
  duration = 3000,
}) => {
  const getBackgroundColor = (): string => {
    switch (type) {
      case 'success':
        return '#2e7d32';
      case 'error':
        return '#d32f2f';
      case 'warning':
        return '#ed6c02';
      default:
        return '#323232';
    }
  };

  return (
    <Snackbar
      visible={visible}
      onDismiss={onDismiss}
      duration={duration}
      style={[styles.snackbar, { backgroundColor: getBackgroundColor() }]}
      wrapperStyle={styles.wrapper}
      action={
        actionLabel
          ? {
              label: actionLabel,
              onPress: onAction,
              textColor: '#fff',
            }
          : undefined
      }
    >
      {message}
    </Snackbar>
  );
};

const styles = StyleSheet.create({
  snackbar: {
    borderRadius: 8,
  },
  wrapper: {
    bottom: 20,
    paddingHorizontal: 16,
  },
});

export default AppSnackbar;
