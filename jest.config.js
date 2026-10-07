// Packages shipped as ESM or untranspiled source that Jest must run through Babel.
// The first two entries repeat the default of @react-native/jest-preset.
const transpiledPackages = [
  '(jest-)?react-native',
  '@react-native(-community)?',
  '@react-navigation',
  'react-native-screens',
  'react-native-safe-area-context',
  'react-native-mmkv',
  'react-native-nitro-modules',
  '@faker-js',
];

module.exports = {
  preset: '@react-native/jest-preset',
  transformIgnorePatterns: [
    `node_modules/(?!(${transpiledPackages.join('|')})/)`,
  ],
};
