"use client";

import { openDayRange } from "@/lib/booking-store";
import { useBookingStore } from "@/components/use-booking-store";

export function OpenHours() {
  const { store } = useBookingStore();
  const { schedule } = store;

  return (
    <>
      {openDayRange(schedule)}, {schedule.opensAt}–{schedule.closesAt}
    </>
  );
}
