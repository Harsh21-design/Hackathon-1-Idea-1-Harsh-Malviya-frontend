"use client";

import Image from "next/image";
import { useLang } from "@/lib/lang-context";

export function VisitUs() {
  const { t } = useLang();

  const contacts = [
    {
      label: t.visit.telLabel,
      value: "+34 685 721 593",
      href: "tel:+34685721593",
    },
    {
      label: t.visit.telegramLabel,
      value: "@IturrietaBookingBot",
      href: "https://t.me/IturrietaBookingBot",
    },
    {
      label: t.visit.emailLabel,
      value: "info@iturrieta.eus",
      href: "mailto:info@iturrieta.eus",
    },
  ] as const;

  return (
    <section id="visit" aria-labelledby="visit-heading" className="bg-[#f4eee4]/40 py-24 sm:py-32 border-t border-stone-200">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 sm:px-8 lg:grid-cols-2 lg:gap-16">
        
        {/* Landscape photo */}
        <div className="relative aspect-[4/3] sm:aspect-[4/5] overflow-hidden rounded-3xl border border-stone-200 shadow-xl">
          <Image
            src="/images/valle-aramaio.jpg"
            alt="Valley of Aramaio surrounded by mountains in Álava"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover object-[center_30%]"
          />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-gold">
            {t.visit.badge}
          </span>
          <h2
            id="visit-heading"
            className="mt-3 font-serif text-4xl leading-tight font-semibold text-stone-900 sm:text-5xl"
          >
            {t.visit.title}
          </h2>

          <div className="mt-8 space-y-6 text-sm">
            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-gold">
                {t.visit.addressLabel}
              </span>
              <p className="mt-2 text-base text-stone-900 font-semibold">
                {t.visit.addressLine1}<br />
                {t.visit.addressLine2}
              </p>
              <p className="mt-1 text-xs text-stone-500">
                {t.visit.addressSub}
              </p>
            </div>

            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-gold">
                {t.visit.channelsLabel}
              </span>
              <ul className="mt-4 divide-y divide-stone-100">
                {contacts.map((c) => (
                  <li key={c.label} className="py-2.5 flex items-center justify-between text-xs">
                    <span className="text-stone-500">{c.label}</span>
                    <a
                      href={c.href}
                      target={c.href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="font-semibold text-stone-800 hover:text-gold transition-colors"
                    >
                      {c.value}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
