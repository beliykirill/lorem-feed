import { createMMKV } from 'react-native-mmkv';
import type { StateStorage } from 'zustand/middleware';

const mmkv = createMMKV();

// StateStorage adapter for zustand persist. MMKV is synchronous.
export const mmkvStorage: StateStorage = {
  getItem: key => mmkv.getString(key) ?? null,
  setItem: (key, value) => mmkv.set(key, value),
  removeItem: key => {
    mmkv.remove(key);
  },
};
