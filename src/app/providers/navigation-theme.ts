import {
  DarkTheme,
  DefaultTheme,
  type Theme as NavigationTheme,
} from '@react-navigation/native';

import { type Colors, darkColors, lightColors } from '@/shared/theme';

function toNavigationTheme(base: NavigationTheme, colors: Colors) {
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: colors.primary,
      background: colors.background,
      card: colors.background,
      text: colors.text,
      border: colors.border,
      notification: colors.danger,
    },
  };
}

export const lightNavigationTheme = toNavigationTheme(
  DefaultTheme,
  lightColors,
);

export const darkNavigationTheme = toNavigationTheme(DarkTheme, darkColors);
