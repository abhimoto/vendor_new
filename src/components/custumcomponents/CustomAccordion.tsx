import React from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

interface AccordionProps {
  title: string;
  children?: React.ReactNode;
  expanded?: boolean;
  onPress?: () => void;
  icon?: React.ReactNode;
}

const CustomAccordion: React.FC<AccordionProps> = ({
  title,
  children,
  expanded = false,
  onPress,
  icon
}) => {

  return (
    <View style={styles.container}>

<Pressable style={styles.header} onPress={onPress}>

  <View style={styles.left}>
    {icon}
    <Text style={styles.title}>{title}</Text>
  </View>

  <Text style={styles.icon}>
    {expanded ? '▼' : '▶'}
  </Text>

</Pressable>

      {expanded && children && (
        <View style={styles.content}>
          {children}
        </View>
      )}

    </View>
  );
};

export default CustomAccordion;

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    borderRadius: 12,
    backgroundColor: '#fff',
    overflow: 'hidden',
    // elevation: 3,

    // shadowColor: '#000',
    // shadowOpacity: 0.1,
    // shadowRadius: 4,

    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },

  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },

  icon: {
    fontSize: 16,
    color: '#333',
  },

  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  left: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
},
});