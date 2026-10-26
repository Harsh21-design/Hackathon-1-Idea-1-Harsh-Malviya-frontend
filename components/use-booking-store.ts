"use client";

import { useEffect, useState } from "react";
import { defaultStore, readStore, STORAGE_KEY, STORE_EVENT, type Store } from "@/lib/booking-store";

export function useBookingStore(): { store: Store; ready: boolean } {
  const [store, setStore] = useState<Store>(defaultStore);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const read = () => setStore(readStore());
    read();
    setReady(true);

    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) read();
    };

    window.addEventListener(STORE_EVENT, read);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(STORE_EVENT, read);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return { store, ready };
}
