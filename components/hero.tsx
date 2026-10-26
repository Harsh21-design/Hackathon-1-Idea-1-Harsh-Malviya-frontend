"use client";

import Image from "next/image";
import { useLang } from "@/lib/lang-context";

export function Hero() {
  const { t } = useLang();

  return (
    <section id="top" className="relative min-h-[88svh] overflow-hidden bg-stone-900 text-white flex items-center">
      {/* Background Caserío Image */}
      <Image
        src="/images/caserio-verano.jpg"
        alt="The Iturrieta stone farmhouse nestled in Aramaio mountains"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[70%_55%] brightness-90 scale-100"
      />
      
      {/* Warm cinematic gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/45 to-stone-950/25" />
      <div className="absolute inset-0 bg-gradient-to-r from-stone-950/85 via-stone-950/40 to-transparent" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col justify-center px-6 py-20 sm:px-8">
        <div className="max-w-3xl">
          {/* Basque badge */}
          <div className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-black/30 px-4 py-1.5 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-semibold tracking-[0.22em] text-stone-200 uppercase">
              {t.hero.badge}
            </span>
          </div>

          <h1 className="mt-6 font-serif text-5xl leading-[1.05] font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
            {t.hero.title}
          </h1>
          <p className="mt-3 font-serif text-2xl font-light text-amber-200 italic sm:text-3xl">
            {t.hero.subtitle}
          </p>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-stone-200 sm:text-lg sm:leading-8">
            {t.hero.description}
          </p>

          {/* Quick Stats Grid */}
          <div className="mt-10 grid grid-cols-3 gap-4 border-y border-white/15 py-5 sm:max-w-xl">
            <div>
              <p className="font-serif text-2xl font-bold text-amber-300 sm:text-3xl">Jan–May</p>
              <p className="text-xs text-stone-300">{t.hero.statSeason}</p>
            </div>
            <div>
              <p className="font-serif text-2xl font-bold text-amber-300 sm:text-3xl">Thu–Sun</p>
              <p className="text-xs text-stone-300">{t.hero.statHours}</p>
            </div>
            <div>
              <p className="font-serif text-2xl font-bold text-amber-300 sm:text-3xl">Álava</p>
              <p className="text-xs text-stone-300">{t.hero.statRegion}</p>
            </div>
          </div>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#request"
              className="inline-flex items-center justify-center rounded-xl bg-gold px-8 py-4 text-sm font-bold uppercase tracking-wider text-white shadow-xl transition-all duration-300 hover:bg-gold-bright hover:scale-[1.02]"
            >
              {t.hero.ctaBook}
            </a>
            <a
              href="#house"
              className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/10 px-6 py-4 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20"
            >
              {t.hero.ctaMenu}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
