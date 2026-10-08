import type { HydrationTracker } from '@/shared/lib/storage';

type Tracker = Pick<HydrationTracker, 'isDone' | 'subscribe'>;

export function isGateOpen(trackers: readonly Tracker[]): boolean {
  return trackers.every(tracker => tracker.isDone());
}

// Trackers keep a flag, not just an event, so hydration finished before
// subscribing is not lost: getSnapshot reads the flags.
export function createHydrationGate(trackers: readonly Tracker[]) {
  return {
    getSnapshot: () => isGateOpen(trackers),
    subscribe: (listener: () => void) => {
      const unsubscribers = trackers.map(tracker =>
        tracker.subscribe(listener),
      );

      return () => unsubscribers.forEach(unsubscribe => unsubscribe());
    },
  };
}
