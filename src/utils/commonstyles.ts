import { StyleSheet } from 'react-native';
import { colors } from './colors';

const commonstyles = StyleSheet.create({
  /* Layout */
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  flex1: {
    flex: 1,
  },

  fullWidth: {
    width: '100%',
  },

  fullHeight: {
    height: '100%',
  },

  /* Alignment */
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  alignCenter: {
    alignItems: 'center',
  },

  justifyCenter: {
    justifyContent: 'center',
  },

  /* Row / Column */
  row: {
    flexDirection: 'row',
  },

  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  spaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  column: {
    flexDirection: 'column',
  },

  /* Typography */
  bold: {
    fontWeight: 'bold',
  },

  semiBold: {
    fontWeight: '600',
  },

  textCenter: {
    textAlign: 'center',
  },

  textRight: {
    textAlign: 'right',
  },

  textLeft: {
    textAlign: 'left',
  },

  /* Margin */
  m5: {
    margin: 5,
  },
  m50: {
    margin: 50,
  },

  m10: {
    margin: 10,
  },
  m8: {
    margin: 8,
  },
  mt10: {
    marginTop: 10,
  },
  mt20: {
    marginTop: 20,
  },
  mt50: {
    marginTop: 50,
  },
  mb10: {
    marginBottom: 10,
  },

  ml10: {
    marginLeft: 10,
  },

  mr10: {
    marginRight: 10,
  },

  /* Padding */
  p5: {
    padding: 5,
  },

  p10: {
    padding: 10,
  },
  p20: {
    padding: 20,
  },

  pt10: {
    paddingTop: 10,
  },

  pb10: {
    paddingBottom: 10,
  },

  pl10: {
    paddingLeft: 10,
  },

  pr10: {
    paddingRight: 10,
  },

  /* Position */
  absolute: {
    position: 'absolute',
  },

  relative: {
    position: 'relative',
  },
  gap10: {
    gap: 10,
  },
});

export default commonstyles;
