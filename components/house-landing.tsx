"use client";

import Image from "next/image";
import { OpenHours } from "@/components/open-hours";
import { useLang } from "@/lib/lang-context";

export function HouseLanding() {
  const { t } = useLang();

  return (
    <section id="house" className="relative bg-[#fbf9f5] py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          
          {/* Left Column: Caserío Narrative */}
          <div className="lg:col-span-7">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-gold">
              {t.house.badge}
            </span>
            
            <h2 className="mt-3 font-serif text-4xl leading-tight font-semibold text-stone-900 sm:text-5xl">
              {t.house.title}
            </h2>

            <p className="mt-6 text-base leading-relaxed text-stone-600 sm:text-lg sm:leading-8">
              {t.house.description}
            </p>

            <div className="mt-8 overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-md">
              <div className="relative aspect-[16/9]">
                <Image
                  src="/images/prensa.jpg"
                  alt="Traditional cider press at Iturrieta farmhouse"
                  fill
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  className="object-cover object-[center_40%] transition-transform duration-700 hover:scale-105"
                />
              </div>
              <div className="p-4 border-t border-stone-100 text-xs text-stone-500 flex items-center justify-between bg-stone-50/50">
                <span>{t.house.caption}</span>
                <span className="text-gold font-medium">Aramaio · Álava</span>
              </div>
            </div>
          </div>

          {/* Right Column: Key Visitor Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl border border-stone-200/90 bg-white p-8 sm:p-10 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 h-40 w-40 bg-amber-50 rounded-full blur-2xl pointer-events-none" />

              <h3 className="font-serif text-2xl font-semibold text-stone-900">
                {t.house.infoTitle}
              </h3>
              <p className="mt-1 text-sm text-stone-500">
                {t.house.infoSubtitle}
              </p>

              <div className="mt-8 space-y-6 divide-y divide-stone-100">
                {/* Schedule */}
                <div className="pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gold">
                    {t.house.scheduleLabel}
                  </span>
                  <div className="mt-1.5 text-base font-semibold text-stone-800">
                    <OpenHours />
                  </div>
                  <p className="mt-1 text-xs text-stone-500">{t.house.scheduleSub}</p>
                </div>

                {/* Season */}
                <div className="pt-5">
                  <span className="text-xs font-bold uppercase tracking-wider text-gold">
                    {t.house.seasonLabel}
                  </span>
                  <p className="mt-1.5 text-base font-semibold text-stone-800">{t.house.seasonVal}</p>
                  <p className="mt-1 text-xs text-stone-500">{t.house.seasonSub}</p>
                </div>

                {/* Pricing & Menu */}
                <div className="pt-5">
                  <span className="text-xs font-bold uppercase tracking-wider text-gold">
                    {t.house.menuLabel}
                  </span>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm font-semibold text-stone-800">{t.house.menuTraditional}</span>
                    <span className="font-serif text-xl font-bold text-gold">€45</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-xs text-stone-500">
                    <span>{t.house.menuKids}</span>
                    <span className="font-semibold text-stone-700">€16</span>
                  </div>
                  <p className="mt-2 text-xs text-stone-500">
                    {t.house.menuSub}
                  </p>
                </div>

                {/* Policy */}
                <div className="pt-5">
                  <span className="text-xs font-bold uppercase tracking-wider text-gold">
                    {t.house.policyLabel}
                  </span>
                  <p className="mt-1.5 text-xs leading-relaxed text-stone-600">
                    {t.house.policyText}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
