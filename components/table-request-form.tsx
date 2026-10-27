"use client";

import { FormEvent, useState, useMemo, useEffect } from "react";
import { createBookingRequest } from "@/lib/booking-api";
import { timeOptions, todayIso, weekdayOf, displayDate } from "@/lib/booking-store";
import { useBookingStore } from "@/components/use-booking-store";
import { useLang } from "@/lib/lang-context";

const QUICK_TAGS = [
  { id: "txotx", label: "Txotx Tasting Experience", icon: "🍏" },
  { id: "birthday", label: "Celebration / Birthday", icon: "🎂" },
  { id: "highchair", label: "High Chair Needed", icon: "👶" },
  { id: "fish", label: "Pescatarian / Fish Option", icon: "🐟" },
  { id: "wheelchair", label: "Accessible Seating", icon: "♿" },
  { id: "quiet", label: "Window / Garden View", icon: "🌿" },
];

const ADULT_PRICE = 45;
const CHILD_PRICE = 22;

export function TableRequestForm() {
  const { store, ready } = useBookingStore();
  const { t } = useLang();
  const times = useMemo(() => timeOptions(store.schedule), [store.schedule]);

  // Guest counters
  const [adults, setAdults] = useState<number>(2);
  const [childrenCount, setChildrenCount] = useState<number>(0);

  // Form fields
  const [guestName, setGuestName] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceDate, setServiceDate] = useState("");
  const [serviceTime, setServiceTime] = useState(times[0] ?? "13:30");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [note, setNote] = useState("");

  // UI state
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<{
    guestName: string;
    phone: string;
    adults: number;
    childrenCount: number;
    serviceDate: string;
    serviceTime: string;
    totalPrice: number;
    reference: string;
  } | null>(null);

  const totalGuests = adults + childrenCount;
  const totalPrice = adults * ADULT_PRICE + childrenCount * CHILD_PRICE;
  const [minDate, setMinDate] = useState<string>("");

  useEffect(() => {
    setMinDate(todayIso());
  }, []);

  // Check date validity in real-time
  const dateWarning = useMemo(() => {
    if (!serviceDate) return null;
    const day = weekdayOf(serviceDate);
    const openDays = store.schedule.openWeekdays ?? [4, 5, 6, 0];
    if (!openDays.includes(day)) {
      return "Sidrería Iturrieta is open for lunch Thursday through Sunday (13:00 - 16:00). Please select an open day.";
    }
    const closure = store.closures.find((c) => c.serviceDate === serviceDate);
    if (closure) {
      return `The cider house is closed on this date (${closure.reason || "Special closure"}). Please select another date.`;
    }
    return null;
  }, [serviceDate, store.schedule.openWeekdays, store.closures]);

  const toggleTag = (label: string) => {
    setSelectedTags((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    );
  };

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (totalGuests < 1 || totalGuests > 35) {
      setError("Party size must be between 1 and 35 guests.");
      return;
    }

    if (dateWarning) {
      setError(dateWarning);
      return;
    }

    setSubmitting(true);

    // Build rich notes string
    const tagsPart = selectedTags.length > 0 ? `Preferences: [${selectedTags.join(", ")}]` : "";
    const customNotesPart = note.trim() ? `Notes: ${note.trim()}` : "";
    const breakdownPart = `Composition: ${adults} Adult${adults > 1 ? "s" : ""}${
      childrenCount > 0 ? `, ${childrenCount} Child${childrenCount > 1 ? "ren" : ""}` : ""
    } · Estimated Total: €${totalPrice}`;
    
    const combinedNotes = [breakdownPart, tagsPart, customNotesPart]
      .filter(Boolean)
      .join(" | ");

    const result = await createBookingRequest({
      guestName,
      phone,
      partySize: totalGuests,
      serviceDate,
      serviceTime,
      note: combinedNotes,
    });

    setSubmitting(false);

    if (result) {
      setSent(false);
      setError(result);
      return;
    }

    // Success
    const refCode = `ITU-${Math.floor(1000 + Math.random() * 9000)}`;
    setSubmittedData({
      guestName,
      phone,
      adults,
      childrenCount,
      serviceDate,
      serviceTime,
      totalPrice,
      reference: refCode,
    });

    setSent(true);
  }

  const handleReset = () => {
    setSent(false);
    setGuestName("");
    setPhone("");
    setAdults(2);
    setChildrenCount(0);
    setServiceDate("");
    setServiceTime(times[0] ?? "13:30");
    setSelectedTags([]);
    setNote("");
    setError(null);
    setSubmittedData(null);
  };

  return (
    <section id="request" aria-labelledby="request-heading" className="bg-[#fbf9f5] py-20 sm:py-28 relative">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-[#faefe4] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-gold shadow-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
            {t.booking.badge || "Live Reservations · Txotx Season"}
          </span>
          <h2 id="request-heading" className="mt-4 font-serif text-3xl leading-tight font-semibold text-stone-900 sm:text-5xl">
            {t.booking.title || "Reserve Your Table at Iturrieta"}
          </h2>
          <p className="mt-3 text-sm sm:text-base leading-relaxed text-stone-600">
            {t.booking.subtitle || "Reserve directly with the farmhouse. Traditional charcoal grill menu, unlimited txotx straight from oak barrels, and warm Basque hospitality."}
          </p>

          {/* Telegram Alternative Banner */}
          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-stone-200/80 bg-white px-5 py-3 shadow-xs text-xs">
            <span className="text-stone-600">
              Prefer instant booking via messaging?
            </span>
            <a
              href="https://t.me/IturrietaBookingBot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-bold text-gold hover:text-gold-bright transition-colors"
            >
              <span>Open Telegram Bot (@IturrietaBookingBot)</span>
              <span>→</span>
            </a>
          </div>
        </div>

        {/* ============================================================== */}
        {/* SUCCESS CONFIRMATION VOUCHER (Shown after successful booking) */}
        {/* ============================================================== */}
        {sent && submittedData ? (
          <div className="mx-auto max-w-2xl rounded-3xl border-2 border-emerald-300 bg-white p-8 sm:p-12 shadow-2xl animate-in fade-in duration-300">
            <div className="flex items-center justify-between border-b border-stone-100 pb-6">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-800">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  Reservation Request Received
                </span>
                <h3 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                  On Egin, {submittedData.guestName}!
                </h3>
              </div>
              <div className="text-right font-mono">
                <span className="text-[10px] uppercase font-bold text-stone-400">Reference</span>
                <p className="text-base font-bold text-gold">{submittedData.reference}</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="rounded-2xl border border-stone-100 bg-[#fbf9f5] p-3.5">
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Date</span>
                <span className="mt-1 font-bold text-stone-900 block text-sm">
                  {displayDate(submittedData.serviceDate)}
                </span>
              </div>
              <div className="rounded-2xl border border-stone-100 bg-[#fbf9f5] p-3.5">
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Service Slot</span>
                <span className="mt-1 font-bold text-stone-900 block text-sm">
                  {submittedData.serviceTime} · Lunch
                </span>
              </div>
              <div className="rounded-2xl border border-stone-100 bg-[#fbf9f5] p-3.5">
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Party Size</span>
                <span className="mt-1 font-bold text-stone-900 block text-sm">
                  {submittedData.adults + submittedData.childrenCount} Guests
                </span>
              </div>
              <div className="rounded-2xl border border-stone-100 bg-[#fbf9f5] p-3.5">
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Estimated</span>
                <span className="mt-1 font-bold text-gold block text-sm">
                  €{submittedData.totalPrice}
                </span>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-[#faefe4]/60 border border-amber-200/70 p-4 text-xs text-stone-700 space-y-2">
              <p className="font-semibold text-stone-900 flex items-center gap-1.5">
                <span>🍏</span>
                <span>Next Steps & Arrival Information</span>
              </p>
              <p>
                Our cider-house team has logged your booking into the floor system. We will contact you at{" "}
                <strong className="text-stone-900">{submittedData.phone}</strong> if we need to adjust your table allocation.
              </p>
              <p className="text-[11px] text-stone-500">
                • No advance deposit required. Pay at the table after your lunch and txotx tasting.
                <br />
                • Directions: Arraga auzoa, 2 · Aramaio, Álava (30 mins from Vitoria-Gasteiz).
              </p>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 rounded-xl bg-gold px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-gold-bright transition-all"
              >
                Submit Another Reservation
              </button>
              <a
                href="#main"
                className="inline-flex items-center justify-center rounded-xl border border-stone-200 px-6 py-3.5 text-xs font-bold text-stone-700 hover:bg-stone-50 transition-colors"
              >
                Back to Farmhouse Story
              </a>
            </div>
          </div>
        ) : (
          /* ============================================================== */
          /* MAIN BOOKING FORM GRID (Interactive 2-Column Experience)        */
          /* ============================================================== */
          <div className="rounded-3xl border border-stone-200/90 bg-white p-6 sm:p-10 md:p-12 shadow-xl">
            <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12" noValidate>
              
              {/* LEFT COLUMN: Inputs & Interactive Selectors (7 Cols) */}
              <div className="lg:col-span-7 space-y-8">
                
                {/* 1. GUEST COUNT SELECTOR (Adults & Children) */}
                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                      1. Select Guests & Menus
                    </label>
                    <span className="text-xs font-bold text-stone-500">
                      Total: {totalGuests} {totalGuests === 1 ? "Guest" : "Guests"}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    
                    {/* Adults counter */}
                    <div className="rounded-2xl border border-stone-200 bg-stone-50/70 p-4 transition-all hover:bg-white hover:border-gold/60">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-stone-900">Adults</p>
                          <p className="text-[11px] text-stone-500">€45 · Txotx & Menu</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setAdults((prev) => Math.max(1, prev - 1))}
                            className="h-8 w-8 rounded-lg border border-stone-300 bg-white font-bold text-stone-700 hover:bg-stone-100 flex items-center justify-center text-sm shadow-2xs"
                          >
                            –
                          </button>
                          <span className="font-mono text-base font-bold text-stone-900 w-6 text-center">
                            {adults}
                          </span>
                          <button
                            type="button"
                            onClick={() => setAdults((prev) => Math.min(25, prev + 1))}
                            className="h-8 w-8 rounded-lg border border-stone-300 bg-white font-bold text-stone-700 hover:bg-stone-100 flex items-center justify-center text-sm shadow-2xs"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Children counter */}
                    <div className="rounded-2xl border border-stone-200 bg-stone-50/70 p-4 transition-all hover:bg-white hover:border-gold/60">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-stone-900">Children</p>
                          <p className="text-[11px] text-stone-500">€22 · Juice & Kids Menu</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setChildrenCount((prev) => Math.max(0, prev - 1))}
                            className="h-8 w-8 rounded-lg border border-stone-300 bg-white font-bold text-stone-700 hover:bg-stone-100 flex items-center justify-center text-sm shadow-2xs"
                          >
                            –
                          </button>
                          <span className="font-mono text-base font-bold text-stone-900 w-6 text-center">
                            {childrenCount}
                          </span>
                          <button
                            type="button"
                            onClick={() => setChildrenCount((prev) => Math.min(10, prev + 1))}
                            className="h-8 w-8 rounded-lg border border-stone-300 bg-white font-bold text-stone-700 hover:bg-stone-100 flex items-center justify-center text-sm shadow-2xs"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* 2. DATE & SERVICE TIME SLOTS */}
                <div className="space-y-4">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                    2. Date of Visit & Lunch Slot
                  </label>

                  {/* Date Input */}
                  <div>
                    <input
                      type="date"
                      min={minDate}
                      value={serviceDate}
                      onChange={(e) => setServiceDate(e.target.value)}
                      required
                      className="w-full rounded-xl border border-stone-200 bg-stone-50/80 px-4 py-3 text-sm font-medium text-stone-900 outline-none transition focus:border-gold focus:bg-white focus:ring-1 focus:ring-gold"
                    />
                    <p className="mt-1.5 text-[11px] text-stone-500">
                      Open lunch shifts: <strong>Thursday, Friday, Saturday & Sunday</strong> (13:00 - 16:00).
                    </p>
                  </div>

                  {/* Real-time date warning */}
                  {dateWarning && (
                    <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900 flex items-start gap-2">
                      <span className="text-amber-600 font-bold">⚠️</span>
                      <span>{dateWarning}</span>
                    </div>
                  )}

                  {/* Time slot pills */}
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block mb-2">
                      Lunch Arrival Time
                    </span>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {(times.length > 0 ? times : ["13:00", "13:30", "14:00", "14:30", "15:00", "15:30"]).map(
                        (slot) => {
                          const isSelected = serviceTime === slot;
                          return (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setServiceTime(slot)}
                              className={`py-2.5 px-2 rounded-xl border text-xs font-bold transition-all text-center ${
                                isSelected
                                  ? "border-gold bg-gold text-white shadow-sm scale-102"
                                  : "border-stone-200 bg-stone-50/80 text-stone-700 hover:border-gold/50 hover:bg-white"
                              }`}
                            >
                              {slot}
                            </button>
                          );
                        }
                      )}
                    </div>
                  </div>
                </div>

                {/* 3. CONTACT DETAILS */}
                <div className="space-y-4">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                    3. Contact Person
                  </label>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <input
                        type="text"
                        placeholder="Full Name (e.g. Mikel Arregi)"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        required
                        className="w-full rounded-xl border border-stone-200 bg-stone-50/80 px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-gold focus:bg-white focus:ring-1 focus:ring-gold"
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        placeholder="Phone Number (+34 600...)"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="w-full rounded-xl border border-stone-200 bg-stone-50/80 px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-gold focus:bg-white focus:ring-1 focus:ring-gold"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. OCCASION & DIETARY QUICK-TAGS */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                    4. Preferences & Occasion (Optional)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {QUICK_TAGS.map((tag) => {
                      const active = selectedTags.includes(tag.label);
                      return (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => toggleTag(tag.label)}
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
                            active
                              ? "border-gold bg-[#faefe4] text-gold-dark shadow-2xs font-bold"
                              : "border-stone-200 bg-stone-50/60 text-stone-600 hover:border-stone-300 hover:bg-stone-100"
                          }`}
                        >
                          <span>{tag.icon}</span>
                          <span>{tag.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-3">
                    <textarea
                      rows={2}
                      placeholder="Any allergies, celebrating an anniversary, or special notes for Jon and the kitchen..."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="w-full rounded-xl border border-stone-200 bg-stone-50/80 px-4 py-2.5 text-xs text-stone-900 outline-none transition focus:border-gold focus:bg-white focus:ring-1 focus:ring-gold"
                    />
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: Live Pricing Breakdown & Instant Reservation Card (5 Cols) */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                
                {/* Reservation Summary Card */}
                <div className="rounded-3xl border border-amber-200/80 bg-[#fbf9f5] p-6 sm:p-7 shadow-sm space-y-5">
                  <div className="flex items-center justify-between border-b border-amber-200/60 pb-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gold">
                        Reservation Summary
                      </span>
                      <h3 className="font-serif text-xl font-bold text-stone-900">
                        {serviceDate ? displayDate(serviceDate) : "Select a date"}
                      </h3>
                    </div>
                    <span className="font-mono text-sm font-bold bg-white px-3 py-1 rounded-xl border border-amber-200 text-stone-800">
                      {serviceTime}
                    </span>
                  </div>

                  {/* Pricing Breakdown Lines */}
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between text-stone-600">
                      <span>{adults} × Traditional Txotx Menu (€45)</span>
                      <span className="font-mono font-bold text-stone-900">€{adults * ADULT_PRICE}</span>
                    </div>

                    {childrenCount > 0 && (
                      <div className="flex items-center justify-between text-stone-600">
                        <span>{childrenCount} × Children Menu (€22)</span>
                        <span className="font-mono font-bold text-stone-900">€{childrenCount * CHILD_PRICE}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-stone-500 pt-1">
                      <span>Unlimited Barrel Txotx Tasting</span>
                      <span className="text-emerald-700 font-bold uppercase text-[10px]">Included</span>
                    </div>

                    <div className="border-t border-amber-200/70 pt-3 flex items-baseline justify-between">
                      <div>
                        <span className="text-xs uppercase font-bold tracking-wider text-stone-800">
                          Estimated Total
                        </span>
                        <p className="text-[10px] text-stone-400">Pay on arrival · No deposit</p>
                      </div>
                      <span className="font-serif text-3xl font-bold text-gold">
                        €{totalPrice}
                      </span>
                    </div>
                  </div>

                  {/* Highlights list */}
                  <div className="rounded-2xl bg-white border border-stone-200/70 p-4 space-y-2 text-[11px] text-stone-600">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>Zero upfront fee — cancellation is completely free.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>Authentic Basque charcoal grill dining in Aramaio.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>Live floor assignment synced with staff dashboard.</span>
                    </div>
                  </div>
                </div>

                {/* Error message */}
                {error && (
                  <div className="rounded-2xl border border-rose-300 bg-rose-50 p-4 text-xs text-rose-800" role="alert">
                    <p className="font-bold">Please check your details:</p>
                    <p className="mt-0.5">{error}</p>
                  </div>
                )}

                {/* Submit Button & Assurance */}
                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={!ready || submitting}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gold py-4 px-6 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-all hover:bg-gold-bright disabled:opacity-50 hover:shadow-xl active:scale-[0.99]"
                  >
                    {submitting ? (
                      <>
                        <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        <span>Securing Table Request...</span>
                      </>
                    ) : (
                      <span>Request Reservation for {totalGuests} Guests · €{totalPrice}</span>
                    )}
                  </button>

                  <p className="text-center text-[11px] text-stone-500">
                    Instant confirmation logged in Iturrieta OS. No card details required.
                  </p>
                </div>

              </div>

            </form>
          </div>
        )}

      </div>
    </section>
  );
}
