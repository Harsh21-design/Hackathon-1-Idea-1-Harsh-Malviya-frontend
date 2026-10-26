"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLang } from "@/lib/lang-context";
import { type Lang } from "@/lib/translations";

const LANGUAGES: { code: Lang; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "es", label: "ES" },
  { code: "eu", label: "EU" },
  { code: "fr", label: "FR" },
  { code: "ca", label: "CA" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { lang, setLang, t } = useLang();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#house", label: t.nav.story },
    { href: "#experience", label: t.nav.experience },
    { href: "#visit", label: t.nav.location },
  ];

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "border-b border-stone-200/90 bg-white/95 backdrop-blur-xl shadow-xs"
          : "border-b border-stone-200/50 bg-[#fbf9f5]/90 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3.5">
        
        {/* Brand identity */}
        <Link href="#top" className="group flex flex-col shrink-0">
          <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 transition-colors group-hover:text-gold">
            Iturrieta
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold">
            Sagardotegia · 1998
          </span>
        </Link>

        {/* Center navigation */}
        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-stone-600 transition-colors hover:text-gold"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right actions: 5 Languages switcher + Telegram button + Book CTA */}
        <div className="flex items-center gap-3">
          
          {/* Functional 5 Language Switcher */}
          <div className="flex items-center rounded-full border border-stone-200 bg-white p-1 text-xs font-bold shadow-xs">
            {LANGUAGES.map((item) => (
              <button
                key={item.code}
                type="button"
                onClick={() => setLang(item.code)}
                className={`rounded-full px-2.5 py-1 transition-all ${
                  lang === item.code
                    ? "bg-gold text-white shadow-xs"
                    : "text-stone-600 hover:text-gold"
                }`}
                title={`Switch to ${item.label}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Telegram booking CTA */}
          <a
            href="https://t.me/IturrietaBookingBot"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-full border border-stone-200 bg-white px-3.5 py-1.5 text-xs font-bold text-stone-700 shadow-xs transition-all hover:border-gold hover:text-gold sm:inline-flex"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>{t.nav.telegramBooking}</span>
          </a>

          {/* Main reservation button */}
          <a
            href="#request"
            className="inline-flex items-center justify-center rounded-full bg-gold px-5 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-all hover:bg-gold-bright hover:shadow-md"
          >
            {t.nav.bookTable}
          </a>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-stone-200 text-stone-800 lg:hidden"
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="border-t border-stone-200 bg-white px-6 py-5 lg:hidden shadow-lg">
          <nav className="flex flex-col gap-4 text-base font-semibold">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-stone-700 hover:text-gold"
              >
                {link.label}
              </a>
            ))}
            <a
              href="https://t.me/IturrietaBookingBot"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="text-gold"
            >
              Telegram: @IturrietaBookingBot
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
