"use client";

import { FormEvent, useState } from "react";
import { createRequest, openDaySentence, timeOptions } from "@/lib/booking-store";
import { useBookingStore } from "@/components/use-booking-store";

const fieldClass = "mt-2 w-full border border-ink/15 bg-paper px-3 py-2.5 text-base text-ink";

export function TableRequestForm() {
  const { store, ready } = useBookingStore();
  const times = timeOptions(store.schedule);
  const [guestName, setGuestName] = useState("");
  const [phone, setPhone] = useState("");
  const [partySize, setPartySize] = useState("2");
  const [serviceDate, setServiceDate] = useState("");
  const [serviceTime, setServiceTime] = useState(times[0] ?? "");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = createRequest({
      guestName,
      phone,
      partySize: Number(partySize),
      serviceDate,
      serviceTime,
      note,
    });
    if (result) {
      setSent(false);
      setError(result);
      return;
    }
    setError(null);
    setSent(true);
    setGuestName("");
    setPhone("");
    setPartySize("2");
    setServiceDate("");
    setNote("");
  }

  return (
    <section id="request" aria-labelledby="request-heading" className="bg-cream pb-20 sm:pb-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="max-w-2xl border-t border-ink/15 pt-12">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-cider">Request a table</p>
          <h2 id="request-heading" className="mt-4 font-serif text-4xl leading-tight font-medium text-ink sm:text-5xl">
            Ask the house
          </h2>
          <p className="mt-5 text-base leading-7 text-muted sm:text-lg">
            Ask for lunch on {openDaySentence(store.schedule)}. Iturrieta confirms the table. This page does not book it.
          </p>
        </div>

        <form onSubmit={onSubmit} className="mt-10 max-w-3xl" noValidate>
          {sent ? (
            <p className="mb-6 border border-cider/40 bg-paper px-4 py-3 text-base leading-7 text-ink" role="status">
              Request sent. Iturrieta will confirm the table. Until then, it is only a request.
            </p>
          ) : null}
          {error ? (
            <p className="mb-6 text-sm text-cider-deep" role="alert">
              {error}
            </p>
          ) : null}

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-medium text-ink">
              Name
              <input
                className={fieldClass}
                name="name"
                autoComplete="name"
                value={guestName}
                onChange={(event) => setGuestName(event.target.value)}
                required
              />
            </label>
            <label className="block text-sm font-medium text-ink">
              Phone
              <input
                className={fieldClass}
                name="phone"
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                required
              />
            </label>
            <label className="block text-sm font-medium text-ink">
              Party size
              <input
                className={fieldClass}
                name="party"
                type="number"
                min={1}
                max={24}
                inputMode="numeric"
                value={partySize}
                onChange={(event) => setPartySize(event.target.value)}
                required
              />
            </label>
            <label className="block text-sm font-medium text-ink">
              Date
              <input
                className={fieldClass}
                name="date"
                type="date"
                value={serviceDate}
                onChange={(event) => setServiceDate(event.target.value)}
                required
              />
            </label>
            <label className="block text-sm font-medium text-ink">
              Time
              <select
                className={fieldClass}
                name="time"
                value={serviceTime}
                onChange={(event) => setServiceTime(event.target.value)}
                required
              >
                {times.length === 0 ? <option value="">No times</option> : null}
                {times.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-medium text-ink sm:col-span-2">
              Note
              <textarea
                className={fieldClass}
                name="note"
                rows={3}
                value={note}
                onChange={(event) => setNote(event.target.value)}
              />
            </label>
          </div>

          <button
            type="submit"
            className="mt-6 inline-flex items-center justify-center bg-cider px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-cider-deep disabled:opacity-60"
            disabled={!ready}
          >
            Ask for a table
          </button>
          <p className="mt-4 text-sm leading-6 text-muted">
            Or call{" "}
            <a className="text-ink underline decoration-cider/50 underline-offset-4" href="tel:+34685721593">
              685 72 15 93
            </a>{" "}
            or{" "}
            <a
              className="text-ink underline decoration-cider/50 underline-offset-4"
              href="https://wa.me/34685721593"
              target="_blank"
              rel="noopener noreferrer"
            >
              message on WhatsApp
            </a>
            .
          </p>
        </form>
      </div>
    </section>
  );
}
