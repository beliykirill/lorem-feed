import { createHydrationGate, isGateOpen } from './hydration-gate';

function createFakeTracker(done = false) {
  let isDone = done;
  const listeners = new Set<() => void>();
  return {
    isDone: () => isDone,
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    finish: () => {
      isDone = true;
      listeners.forEach(listener => listener());
    },
    listenerCount: () => listeners.size,
  };
}

describe('isGateOpen', () => {
  it('is open when every tracker is done', () => {
    expect(isGateOpen([createFakeTracker(true), createFakeTracker(true)])).toBe(
      true,
    );
  });

  it('is closed while at least one tracker is not done', () => {
    expect(
      isGateOpen([createFakeTracker(true), createFakeTracker(false)]),
    ).toBe(false);
  });

  it('treats a tracker recovered after a hydration error as done', () => {
    // A real tracker sets the same flag after recovery, see create-hydration-tracker.test.ts.
    const recovered = createFakeTracker();
    recovered.finish();
    expect(isGateOpen([createFakeTracker(true), recovered])).toBe(true);
  });
});

describe('createHydrationGate', () => {
  it('is open at once when trackers finished before subscribing', () => {
    const gate = createHydrationGate([
      createFakeTracker(true),
      createFakeTracker(true),
    ]);
    const listener = jest.fn();
    gate.subscribe(listener);

    expect(gate.getSnapshot()).toBe(true);
    expect(listener).not.toHaveBeenCalled();
  });

  it('notifies subscribers when trackers finish after subscribing', () => {
    const first = createFakeTracker();
    const second = createFakeTracker();
    const gate = createHydrationGate([first, second]);
    const listener = jest.fn();
    gate.subscribe(listener);

    first.finish();
    expect(listener).toHaveBeenCalledTimes(1);
    expect(gate.getSnapshot()).toBe(false);

    second.finish();
    expect(listener).toHaveBeenCalledTimes(2);
    expect(gate.getSnapshot()).toBe(true);
  });

  it('unsubscribes from every tracker', () => {
    const trackers = [createFakeTracker(), createFakeTracker()];
    const unsubscribe = createHydrationGate(trackers).subscribe(jest.fn());
    expect(trackers.map(tracker => tracker.listenerCount())).toEqual([1, 1]);

    unsubscribe();
    expect(trackers.map(tracker => tracker.listenerCount())).toEqual([0, 0]);
  });
});
