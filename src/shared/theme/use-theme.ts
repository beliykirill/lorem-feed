import { useColorScheme } from 'react-native';

import { darkColors, lightColors, type Colors } from './palette';
import { radius, spacing, typography } from './tokens';

export type Theme = {
  isDark: boolean;
  colors: Colors;
  spacing: typeof spacing;
  radius: typeof radius;
  typography: typeof typography;
};

const lightTheme: Theme = {
  isDark: false,
  colors: lightColors,
  spacing,
  radius,
  typography,
};

const darkTheme: Theme = { ...lightTheme, isDark: true, colors: darkColors };

export function useTheme(): Theme {
  return useColorScheme() === 'dark' ? darkTheme : lightTheme;
}
