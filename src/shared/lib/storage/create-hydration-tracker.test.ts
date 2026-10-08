import { create } from 'zustand';
import {
  createJSONStorage,
  persist,
  type StateStorage,
} from 'zustand/middleware';

import { createHydrationTracker } from './create-hydration-tracker';

const KEY = 'test-store';

type State = { items: string[] };

function createMemoryStorage(initial?: string) {
  const data = new Map<string, string>();

  if (initial !== undefined) {
    data.set(KEY, initial);
  }

  const storage: StateStorage = {
    getItem: key => data.get(key) ?? null,
    setItem: (key, value) => {
      data.set(key, value);
    },
    removeItem: key => {
      data.delete(key);
    },
  };

  return { storage, data };
}

function createStore(storage: StateStorage, migrate?: () => State) {
  const tracker = createHydrationTracker(storage, KEY);

  const store = create<State>()(
    persist((): State => ({ items: [] }), {
      name: KEY,
      version: 2,
      storage: createJSONStorage(() => storage),
      migrate,
      onRehydrateStorage: tracker.onRehydrateStorage,
    }),
  );

  return { store, tracker };
}

describe('createHydrationTracker on real zustand persist', () => {
  let warn: jest.SpyInstance;

  beforeEach(() => {
    warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => warn.mockRestore());

  it('recovers from corrupt JSON: key removed, initial state, done', () => {
    const { storage, data } = createMemoryStorage('{not json');
    const { store, tracker } = createStore(storage);

    expect(data.has(KEY)).toBe(false);
    expect(store.getState().items).toEqual([]);
    expect(tracker.isDone()).toBe(true);
    expect(warn).toHaveBeenCalled();
  });

  it('recovers when migrate throws: key removed, initial state, done', () => {
    const stored = JSON.stringify({ state: { items: ['old'] }, version: 1 });
    const { storage, data } = createMemoryStorage(stored);

    const { store, tracker } = createStore(storage, () => {
      throw new Error('migration failed');
    });

    expect(data.has(KEY)).toBe(false);
    expect(store.getState().items).toEqual([]);
    expect(tracker.isDone()).toBe(true);
  });

  it('applies valid JSON and keeps the key', () => {
    const stored = JSON.stringify({ state: { items: ['saved'] }, version: 2 });
    const { storage, data } = createMemoryStorage(stored);
    const { store, tracker } = createStore(storage);

    expect(store.getState().items).toEqual(['saved']);
    expect(data.get(KEY)).toBe(stored);
    expect(tracker.isDone()).toBe(true);
    expect(warn).not.toHaveBeenCalled();
  });

  it('finishes with the initial state when storage is empty', () => {
    const { storage, data } = createMemoryStorage();
    const { store, tracker } = createStore(storage);

    expect(store.getState().items).toEqual([]);
    expect(data.has(KEY)).toBe(false);
    expect(tracker.isDone()).toBe(true);
  });

  it('notifies subscribers when hydration finishes', () => {
    const { storage } = createMemoryStorage();
    const tracker = createHydrationTracker(storage, KEY);
    const listener = jest.fn();

    tracker.subscribe(listener);

    expect(tracker.isDone()).toBe(false);
    tracker.onRehydrateStorage()(undefined, undefined);
    expect(tracker.isDone()).toBe(true);
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
