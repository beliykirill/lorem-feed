module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        // Keep in sync with "paths" in tsconfig.json.
        alias: { '@': './src' },
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
      },
    ],
  ],
};
