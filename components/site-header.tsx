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
          ? "border-b border-stone-200/80 bg-white/95 backdrop-blur-md shadow-xs"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-3.5">
        
        {/* Left: Brand identity */}
        <Link href="#top" className="group flex flex-col shrink-0">
          <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 transition-colors group-hover:text-gold">
            Iturrieta
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold">
            Sagardotegia · 1998
          </span>
        </Link>

        {/* Center: Clean anchor navigation */}
        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-stone-600 transition-colors hover:text-stone-950"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right: Actions lineup with modern hierarchy */}
        <div className="flex items-center gap-3">
          
          {/* Subtle segmented language pills */}
          <div className="hidden sm:flex items-center rounded-full bg-stone-100 p-0.5 text-xs font-semibold">
            {LANGUAGES.map((item) => (
              <button
                key={item.code}
                type="button"
                onClick={() => setLang(item.code)}
                className={`rounded-full px-2.5 py-1 text-[11px] transition-all ${lang === item.code ? "bg-white text-stone-900 shadow-xs" : "text-stone-500 hover:text-stone-800"}`}
                title={`Switch to ${item.label}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="hidden sm:block h-4 w-[1px] bg-stone-200" />

          {/* Telegram booking link */}
          <a
            href="https://t.me/IturrietaBookingBot"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-sky-600 transition-colors md:inline-flex"
            title="Book via Telegram Bot"
          >
            <svg className="h-4 w-4 fill-sky-500" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.458c.538-.196 1.006.128.832.945z"/>
            </svg>
            <span>Telegram</span>
          </a>

          {/* Clean Staff Login text/pill */}
          <Link
            href="/admin/login"
            className="text-xs font-bold uppercase tracking-wider text-stone-600 hover:text-stone-900 px-3 py-1.5 rounded-lg hover:bg-stone-100 transition-colors"
          >
            Login
          </Link>

          {/* Main Primary CTA Button */}
          <a
            href="#request"
            className="inline-flex items-center justify-center rounded-full bg-gold px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition-all hover:bg-gold-bright hover:shadow-md active:scale-95"
          >
            {t.nav.bookTable}
          </a>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-stone-200 text-stone-800 md:hidden"
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
        <div className="border-t border-stone-200 bg-white px-6 py-5 md:hidden shadow-lg">
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

            {/* Language Switcher in Mobile Drawer */}
            <div className="flex items-center gap-1 pt-2 border-t border-stone-100">
              <span className="text-xs text-stone-400 mr-2">Language:</span>
              {LANGUAGES.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => {
                    setLang(item.code);
                    setOpen(false);
                  }}
                  className={`px-2 py-1 text-xs rounded-md font-bold ${
                    lang === item.code
                      ? "bg-stone-900 text-white"
                      : "text-stone-500 hover:text-stone-800"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <a
              href="https://t.me/IturrietaBookingBot"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="text-sky-600 flex items-center gap-2 pt-2 border-t border-stone-100"
            >
              <span>Telegram Bot: @IturrietaBookingBot</span>
            </a>

            <Link
              href="/admin/login"
              onClick={() => setOpen(false)}
              className="text-stone-700 hover:text-gold"
            >
              Staff Portal Login →
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
