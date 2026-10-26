"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  closeDay,
  closureFor,
  displayDate,
  openDayRange,
  reopenDay,
  saveSchedule,
  setRequestStatus,
  timeOptions,
  todayIso,
  updateRequestSlot,
  weekdayOf,
  type Schedule,
} from "@/lib/booking-store";
import { useBookingStore } from "@/components/use-booking-store";

const fieldClass = "mt-2 w-full border border-ink/15 bg-paper px-3 py-2.5 text-sm text-ink";
const quietButton =
  "inline-flex items-center justify-center border border-ink/20 px-3 py-2 text-sm font-medium text-ink hover:border-cider-deep disabled:opacity-40";
const primaryButton =
  "inline-flex items-center justify-center bg-cider px-3 py-2 text-sm font-medium text-white hover:bg-cider-deep disabled:opacity-40";

const weekdays = [
  { id: 4, label: "Thu" },
  { id: 5, label: "Fri" },
  { id: 6, label: "Sat" },
  { id: 0, label: "Sun" },
  { id: 1, label: "Mon" },
  { id: 2, label: "Tue" },
  { id: 3, label: "Wed" },
];

export function AdminDashboard() {
  const { store, ready } = useBookingStore();
  const [draft, setDraft] = useState<Schedule | null>(null);
  const [scheduleError, setScheduleError] = useState<string | null>(null);
  const [closeDate, setCloseDate] = useState("");
  const [closeReason, setCloseReason] = useState("");
  const [closeError, setCloseError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");
  const [editError, setEditError] = useState<string | null>(null);

  useEffect(() => {
    if (ready) setDraft((current) => current ?? store.schedule);
  }, [ready, store.schedule]);

  const today = ready ? todayIso() : "";
  const todays = store.requests.filter((request) => request.serviceDate === today);
  const requested = todays.filter((request) => request.status === "requested").length;
  const confirmed = todays.filter((request) => request.status === "confirmed").length;
  const covers = todays
    .filter((request) => request.status === "confirmed")
    .reduce((sum, request) => sum + request.partySize, 0);
  const closedToday = today ? closureFor(today, store.closures) : undefined;
  const houseClosedToday = today ? !store.schedule.openWeekdays.includes(weekdayOf(today)) : false;
  const requests = [...store.requests].sort(
    (a, b) => a.serviceDate.localeCompare(b.serviceDate) || a.serviceTime.localeCompare(b.serviceTime),
  );
  const times = timeOptions(store.schedule);

  function toggleDay(day: number) {
    setDraft((current) => {
      if (!current) return current;
      const open = current.openWeekdays.includes(day)
        ? current.openWeekdays.filter((item) => item !== day)
        : [...current.openWeekdays, day];
      return { ...current, openWeekdays: open };
    });
  }

  function onSaveSchedule(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft) return;
    const error = saveSchedule(draft);
    setScheduleError(error);
  }

  function onCloseDay(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const error = closeDay(closeDate, closeReason);
    setCloseError(error);
    if (!error) {
      setCloseDate("");
      setCloseReason("");
    }
  }

  function onSaveSlot(event: FormEvent<HTMLFormElement>, id: string) {
    event.preventDefault();
    const error = updateRequestSlot(id, editDate, editTime);
    setEditError(error);
    if (!error) setEditingId(null);
  }

  return (
    <>
      <header className="border-b border-ink/15 bg-cream">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-cider">Staff</p>
            <p className="mt-1 font-serif text-3xl leading-none text-ink">Iturrieta</p>
          </div>
          <a href="/" className="text-sm font-medium text-ink underline decoration-cider/40 underline-offset-4">
            Back to the house
          </a>
        </div>
      </header>

      <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-5 py-10 sm:px-8 sm:py-14">
        {!ready || !draft ? (
          <p className="text-base text-muted">Loading the service book…</p>
        ) : (
          <>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-cider">Today</p>
            <h1 className="mt-3 font-serif text-4xl leading-tight font-medium text-ink sm:text-5xl">
              {displayDate(today)}
            </h1>
            <p className="mt-3 text-base text-muted">
              Service {store.schedule.opensAt}–{store.schedule.closesAt}. Last request{" "}
              {store.schedule.lastBookingTime}. {openDayRange(store.schedule)}.
            </p>
            {houseClosedToday ? <p className="mt-2 text-base text-ink">The house is closed today.</p> : null}
            {closedToday ? <p className="mt-2 text-base text-ink">Closed today. {closedToday.reason}</p> : null}
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted">
              Saved in this browser. A table is real only after the house confirms it.
            </p>

            <dl className="mt-8 grid grid-cols-3 border-y border-ink/15">
              {[
                ["Requested", requested],
                ["Confirmed", confirmed],
                ["Covers", covers],
              ].map(([label, value]) => (
                <div key={label} className="py-5 pr-3">
                  <dt className="text-xs font-medium uppercase tracking-[0.16em] text-cider">{label}</dt>
                  <dd className="mt-2 font-serif text-4xl text-ink sm:text-5xl">{value}</dd>
                </div>
              ))}
            </dl>

            <h2 className="mt-14 font-serif text-3xl font-medium text-ink sm:text-4xl">Requests</h2>
            {requests.length === 0 ? (
              <p className="mt-5 text-base leading-7 text-muted">
                No requests yet. They appear here after someone asks for a table.
              </p>
            ) : (
              <ul className="mt-6 divide-y divide-ink/10 border border-ink/15 bg-paper">
                {requests.map((request) => {
                  const editing = editingId === request.id;
                  const slotTimes = times.includes(editTime) || !editTime ? times : [editTime, ...times];
                  return (
                    <li key={request.id} className="px-4 py-4 sm:px-5">
                      <div className="flex items-start justify-between gap-4">
                        <p className="font-medium text-ink">{request.guestName}</p>
                        <p className="text-xs font-medium uppercase tracking-[0.16em] text-cider">{request.status}</p>
                      </div>
                      <p className="mt-1 text-sm leading-6 text-muted">
                        {displayDate(request.serviceDate)} · {request.serviceTime} · {request.partySize}{" "}
                        {request.partySize === 1 ? "guest" : "guests"} · {request.phone} · {request.channel}
                      </p>
                      {request.note ? <p className="mt-2 text-sm leading-6 text-ink">{request.note}</p> : null}
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          type="button"
                          className={primaryButton}
                          disabled={request.status === "confirmed"}
                          onClick={() => setRequestStatus(request.id, "confirmed")}
                        >
                          Confirm
                        </button>
                        <button
                          type="button"
                          className={quietButton}
                          disabled={request.status === "declined"}
                          onClick={() => setRequestStatus(request.id, "declined")}
                        >
                          Decline
                        </button>
                        <button
                          type="button"
                          className={quietButton}
                          onClick={() => {
                            setEditingId(request.id);
                            setEditDate(request.serviceDate);
                            setEditTime(request.serviceTime);
                            setEditError(null);
                          }}
                        >
                          Change date
                        </button>
                      </div>
                      {editing ? (
                        <form
                          className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
                          onSubmit={(event) => onSaveSlot(event, request.id)}
                        >
                          <label className="block text-sm font-medium text-ink">
                            Date
                            <input
                              className={fieldClass}
                              type="date"
                              value={editDate}
                              onChange={(event) => setEditDate(event.target.value)}
                              required
                            />
                          </label>
                          <label className="block text-sm font-medium text-ink">
                            Time
                            <select
                              className={fieldClass}
                              value={editTime}
                              onChange={(event) => setEditTime(event.target.value)}
                              required
                            >
                              {slotTimes.map((time) => (
                                <option key={time} value={time}>
                                  {time}
                                </option>
                              ))}
                            </select>
                          </label>
                          <button type="submit" className={primaryButton}>
                            Save
                          </button>
                          {editError ? (
                            <p className="text-sm text-cider-deep sm:col-span-3" role="alert">
                              {editError}
                            </p>
                          ) : null}
                        </form>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            )}

            <h2 className="mt-14 font-serif text-3xl font-medium text-ink sm:text-4xl">Schedule</h2>
            <form onSubmit={onSaveSchedule} className="mt-6 max-w-3xl">
              <fieldset>
                <legend className="text-sm font-medium text-ink">Open days</legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {weekdays.map((day) => {
                    const pressed = draft.openWeekdays.includes(day.id);
                    return (
                      <button
                        key={day.id}
                        type="button"
                        aria-pressed={pressed}
                        className={pressed ? primaryButton : quietButton}
                        onClick={() => toggleDay(day.id)}
                      >
                        {day.label}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <label className="block text-sm font-medium text-ink">
                  Opens
                  <input
                    className={fieldClass}
                    type="time"
                    value={draft.opensAt}
                    onChange={(event) => setDraft({ ...draft, opensAt: event.target.value })}
                    required
                  />
                </label>
                <label className="block text-sm font-medium text-ink">
                  Closes
                  <input
                    className={fieldClass}
                    type="time"
                    value={draft.closesAt}
                    onChange={(event) => setDraft({ ...draft, closesAt: event.target.value })}
                    required
                  />
                </label>
                <label className="block text-sm font-medium text-ink">
                  Last booking
                  <input
                    className={fieldClass}
                    type="time"
                    value={draft.lastBookingTime}
                    onChange={(event) => setDraft({ ...draft, lastBookingTime: event.target.value })}
                    required
                  />
                </label>
              </div>
              {scheduleError ? (
                <p className="mt-3 text-sm text-cider-deep" role="alert">
                  {scheduleError}
                </p>
              ) : null}
              <button type="submit" className={`${primaryButton} mt-5`}>
                Save schedule
              </button>
            </form>

            <form onSubmit={onCloseDay} className="mt-10 max-w-3xl border-t border-ink/15 pt-8">
              <h3 className="font-serif text-2xl font-medium text-ink">Close a day</h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium text-ink">
                  Date
                  <input
                    className={fieldClass}
                    type="date"
                    value={closeDate}
                    onChange={(event) => setCloseDate(event.target.value)}
                    required
                  />
                </label>
                <label className="block text-sm font-medium text-ink">
                  Reason
                  <input
                    className={fieldClass}
                    value={closeReason}
                    onChange={(event) => setCloseReason(event.target.value)}
                  />
                </label>
              </div>
              {closeError ? (
                <p className="mt-3 text-sm text-cider-deep" role="alert">
                  {closeError}
                </p>
              ) : null}
              <button type="submit" className={`${primaryButton} mt-5`}>
                Close this day
              </button>
            </form>

            {store.closures.length > 0 ? (
              <ul className="mt-6 max-w-3xl divide-y divide-ink/10 border border-ink/15 bg-paper">
                {store.closures
                  .slice()
                  .sort((a, b) => a.serviceDate.localeCompare(b.serviceDate))
                  .map((closure) => (
                    <li key={closure.id} className="flex items-center justify-between gap-4 px-4 py-3">
                      <p className="text-sm text-ink">
                        {displayDate(closure.serviceDate)}
                        <span className="text-muted"> · {closure.reason}</span>
                      </p>
                      <button type="button" className={quietButton} onClick={() => reopenDay(closure.serviceDate)}>
                        Reopen
                      </button>
                    </li>
                  ))}
              </ul>
            ) : null}
          </>
        )}
      </main>
    </>
  );
}
