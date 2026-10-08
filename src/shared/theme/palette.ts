export type Colors = {
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  primary: string;
  onPrimary: string;
  favoriteTint: string;
  pressed: string;
  star: string;
  danger: string;
};

export const lightColors: Colors = {
  background: '#FFFFFF',
  surface: '#EEF0F3',
  text: '#111418',
  textSecondary: '#5B6470',
  border: '#E1E4E8',
  primary: '#2F6FEB',
  onPrimary: '#FFFFFF',
  favoriteTint: 'rgba(217, 154, 0, 0.08)',
  pressed: 'rgba(0, 0, 0, 0.06)',
  star: '#D99A00',
  danger: '#C62828',
};

export const darkColors: Colors = {
  background: '#0F1115',
  surface: '#1E2228',
  text: '#ECEFF3',
  textSecondary: '#9AA3AE',
  border: '#262B32',
  primary: '#5B8FF2',
  onPrimary: '#FFFFFF',
  favoriteTint: 'rgba(242, 193, 78, 0.08)',
  pressed: 'rgba(255, 255, 255, 0.08)',
  star: '#F2C14E',
  danger: '#EF5350',
};
