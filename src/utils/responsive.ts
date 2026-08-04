import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base size (design reference — usually from Figma)
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

// width percentage
export const wp = (percentage: number) => {
  return (SCREEN_WIDTH * percentage) / 100;
};

// height percentage
export const hp = (percentage: number) => {
  return (SCREEN_HEIGHT * percentage) / 100;
};

// scale based on width
export const scale = (size: number) => {
  return (SCREEN_WIDTH / BASE_WIDTH) * size;
};

// scale based on height
export const verticalScale = (size: number) => {
  return (SCREEN_HEIGHT / BASE_HEIGHT) * size;
};

// moderate scale (most used)
export const moderateScale = (size: number, factor = 0.5) => {
  return size + (scale(size) - size) * factor;
};

// normalize font size
export const normalizeFont = (size: number) => {
  const newSize = scale(size);
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

export { SCREEN_WIDTH, SCREEN_HEIGHT };
