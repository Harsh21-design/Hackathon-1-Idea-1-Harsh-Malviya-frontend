"use client";

import { FormEvent, useState } from "react";
import { createRequest, openDaySentence, timeOptions } from "@/lib/booking-store";
import { useBookingStore } from "@/components/use-booking-store";
import { useLang } from "@/lib/lang-context";

const inputClass =
  "mt-2 w-full rounded-xl border border-stone-200 bg-stone-50/70 px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-gold focus:bg-white focus:ring-1 focus:ring-gold";

export function TableRequestForm() {
  const { store, ready } = useBookingStore();
  const { t } = useLang();
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
    <section id="request" aria-labelledby="request-heading" className="bg-[#fbf9f5] py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-6 sm:px-8">
        <div className="rounded-3xl border border-stone-200/90 bg-white p-8 sm:p-12 md:p-16 shadow-xl relative overflow-hidden">
          
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-[#faefe4] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-gold">
              <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
              {t.booking.badge}
            </span>
            <h2 id="request-heading" className="mt-4 font-serif text-4xl leading-tight font-semibold text-stone-900 sm:text-5xl">
              {t.booking.title}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-stone-600">
              {t.booking.subtitle}
            </p>
          </div>

          {/* Telegram Alternative Option Banner */}
          <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-stone-200 bg-stone-50 p-5">
            <div>
              <p className="text-sm font-semibold text-stone-900">{t.booking.telegramTitle}</p>
              <p className="text-xs text-stone-500">{t.booking.telegramSub}</p>
            </div>
            <a
              href="https://t.me/IturrietaBookingBot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white border border-stone-200 px-4 py-2 text-xs font-bold text-gold shadow-xs transition-all hover:border-gold hover:bg-gold hover:text-white whitespace-nowrap"
            >
              <span>{t.booking.telegramAction}</span>
            </a>
          </div>

          <form onSubmit={onSubmit} className="mt-10" noValidate>
            {sent && (
              <div className="mb-8 rounded-2xl border border-emerald-300 bg-emerald-50 p-5 text-emerald-900" role="status">
                <p className="font-serif text-lg font-bold">{t.booking.successTitle}</p>
                <p className="mt-1 text-xs text-emerald-700">
                  {t.booking.successDesc}
                </p>
              </div>
            )}
            {error && (
              <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800" role="alert">
                {error}
              </div>
            )}

            <div className="space-y-6">
              {/* Party size counter */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                  {t.booking.partyLabel}
                </label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {["1", "2", "3", "4", "5", "6", "8", "10", "12+"].map((size) => {
                    const isSelected = (size === "12+" && Number(partySize) >= 12) || partySize === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setPartySize(size === "12+" ? "12" : size)}
                        className={`flex h-11 w-12 items-center justify-center rounded-xl border text-sm font-bold transition-all ${
                          isSelected
                            ? "border-gold bg-gold text-white shadow-sm scale-105"
                            : "border-stone-200 bg-white text-stone-700 hover:border-gold/50"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-600">
                    {t.booking.nameLabel}
                  </label>
                  <input
                    className={inputClass}
                    placeholder="Mikel Arregi"
                    name="name"
                    autoComplete="name"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-600">
                    {t.booking.phoneLabel}
                  </label>
                  <input
                    className={inputClass}
                    placeholder="+34 600 000 000"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-600">
                    {t.booking.dateLabel}
                  </label>
                  <input
                    className={inputClass}
                    name="date"
                    type="date"
                    value={serviceDate}
                    onChange={(e) => setServiceDate(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-600">
                    {t.booking.timeLabel}
                  </label>
                  <select
                    className={inputClass}
                    name="time"
                    value={serviceTime}
                    onChange={(e) => setServiceTime(e.target.value)}
                    required
                  >
                    {times.length === 0 ? <option value="">No times available</option> : null}
                    {times.map((time) => (
                      <option key={time} value={time}>
                        {time} · Lunch Service
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-600">
                    {t.booking.notesLabel}
                  </label>
                  <textarea
                    className={inputClass}
                    name="note"
                    rows={3}
                    placeholder={t.booking.notesPlaceholder}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-xl bg-gold px-8 py-4 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all hover:bg-gold-bright disabled:opacity-50"
                disabled={!ready}
              >
                {t.booking.submitBtn}
              </button>
              <p className="text-xs text-stone-500">
                {t.booking.disclaimer}
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
