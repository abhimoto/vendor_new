import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  FlatList,
  Text,
  Pressable,
} from 'react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
  data: any[];
  onSelect: (item: any) => void;
};

export default function BottomModal({
  visible,
  onClose,
  data,
  onSelect,
}: Props) {
  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal transparent visible={visible} animationType="none">
      {/* Background Overlay */}
      <TouchableOpacity style={styles.overlay} onPress={onClose} />

      {/* Bottom Sheet */}
      <Animated.View
        style={[styles.container, { transform: [{ translateY: slideAnim }] }]}
      >
        <View style={styles.handle} />

        <FlatList
          data={data}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item }) => (
            <Pressable
              style={styles.item}
              onPress={() => {
                onSelect(item);
                onClose();
              }}
            >
              <Text style={styles.text}>{item.label}</Text>
            </Pressable>
          )}
        />
      </Animated.View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    maxHeight: '50%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    elevation: 10,
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    alignSelf: 'center',
    borderRadius: 10,
    marginVertical: 10,
  },
  item: {
    padding: 15,
    borderBottomWidth: 0.5,
    borderColor: '#eee',
  },
  text: {
    fontSize: 16,
  },
});
