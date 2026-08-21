import {StyleSheet} from 'react-native';
import {colors} from '@utils/colors';

export const profileStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },

  flexInput: {
    flex: 1,
  },

  labelRow: {
    marginBottom: 10,
  },

  tableLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },

  iconWrapper: {
    width: 40,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    borderColor: colors.primary,
    borderWidth: 2,
    borderRadius: 8,
  },

  addIcon: {
    fontSize: 24,
    color: '#2563EB',
    fontWeight: '700',
  },

  deleteIcon: {
    fontSize: 20,
    color: 'red',
    fontWeight: '700',
  },

  updateButton: {
    width: 213,
    height: 56,
    backgroundColor: colors.primary,
    borderRadius: 14,
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 20,
  },

  updateButtonText: {
    alignSelf: 'center',
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});