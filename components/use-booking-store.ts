"use client";

import { useCallback, useEffect, useState } from "react";
import {
  BOOKING_REFRESH_EVENT,
  fetchBookingStore,
  subscribeBookingRealtime,
} from "@/lib/booking-api";
import { defaultStore, type Store } from "@/lib/booking-store";

export function useBookingStore(): { store: Store; ready: boolean; error: string | null; refetch: () => void } {
  const [store, setStore] = useState<Store>(defaultStore);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const next = await fetchBookingStore();
      setStore(next);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load booking data.");
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void load();
    });
    const onRefresh = () => {
      void load();
    };
    window.addEventListener(BOOKING_REFRESH_EVENT, onRefresh);
    let unsubscribe: () => void = () => {};
    subscribeBookingRealtime(onRefresh).then((off) => {
      unsubscribe = off;
    });
    return () => {
      window.removeEventListener(BOOKING_REFRESH_EVENT, onRefresh);
      unsubscribe();
    };
  }, [load]);

  return { store, ready, error, refetch: load };
}
