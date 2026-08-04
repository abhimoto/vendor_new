module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@app': './src/app',
          '@store': './src/app/redux',
          '@components': './src/components',
          '@modules': './src/modules',
          '@navigation': './src/navigation',
          '@services': './src/services',
          '@utils': './src/utils',
          '@assets': './src/assets',
          '@translation': './src/translation',
          '@hooks': './src/hooks',
          '@socket': './src/sockets/sockets',
        },
      },
    ],

    'react-native-reanimated/plugin', // MUST BE LAST
  ],
};
