const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Disable package exports to fix Firebase dual-package hazard (Expo SDK 53+)
// See: https://github.com/expo/expo/issues/36496
config.resolver.unstable_enablePackageExports = false;

// Add path aliases
config.resolver.extraNodeModules = {
  '@': path.resolve(__dirname, 'src'),
  '@components': path.resolve(__dirname, 'src/components'),
  '@features': path.resolve(__dirname, 'src/features'),
  '@hooks': path.resolve(__dirname, 'src/hooks'),
  '@services': path.resolve(__dirname, 'src/services'),
  '@store': path.resolve(__dirname, 'src/store'),
  '@utils': path.resolve(__dirname, 'src/utils'),
  '@constants': path.resolve(__dirname, 'src/constants'),
  '@types': path.resolve(__dirname, 'src/types'),
};

module.exports = withNativeWind(config, { input: './global.css' });
