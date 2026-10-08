import { createMMKV } from 'react-native-mmkv';
import type { StateStorage } from 'zustand/middleware';

const mmkv = createMMKV();

// MMKV is synchronous, so persist hydrates inside create().
export const mmkvStorage: StateStorage = {
  getItem: key => mmkv.getString(key) ?? null,
  setItem: (key, value) => mmkv.set(key, value),
  removeItem: key => {
    mmkv.remove(key);
  },
};
