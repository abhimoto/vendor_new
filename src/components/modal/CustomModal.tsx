import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Text,
} from 'react-native';
import spacing from '@utils/spacing';
import { moderateScale } from '@utils/responsive';

type Props = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function CustomModal({ visible, onClose, children }: Props) {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    } else {
      scaleAnim.setValue(0);
    }
  }, [visible]);

  return (
    <Modal transparent visible={visible} animationType="fade">
      {/* Backdrop */}
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        {/* Prevent closing when clicking inside modal */}
        <TouchableOpacity activeOpacity={1}>
          <Animated.View
            style={[
              styles.modalContainer,
              { transform: [{ scale: scaleAnim }] },
            ]}
          >
            {/* 🔥 Close Button */}
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>

            {children}
          </Animated.View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // backdrop
    justifyContent: 'center',
    alignItems: 'center',
    // padding: spacing.lg,
  },

  modalContainer: {
    width: '92%', // 🔥 almost full width
    maxWidth: 600, // optional (for tablets)
    backgroundColor: '#fff',
    borderRadius: moderateScale(16),

    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg, // 👈 slightly less for clean look

    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 20,
  },

  closeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});
