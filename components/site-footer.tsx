"use client";

import Link from "next/link";
import { useLang } from "@/lib/lang-context";

export function SiteFooter() {
  const { t } = useLang();

  const links = [
    { href: "#house", label: t.nav.story },
    { href: "#experience", label: t.nav.experience },
    { href: "#request", label: t.nav.bookTable },
    { href: "#visit", label: t.nav.location },
  ];

  return (
    <footer className="mt-auto border-t border-stone-200 bg-[#f7f4ed] py-14 text-stone-600">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 sm:px-8 md:grid-cols-3">
        {/* Brand */}
        <div>
          <span className="font-serif text-2xl font-bold tracking-tight text-stone-900">
            Iturrieta
          </span>
          <p className="mt-1 text-xs font-bold uppercase tracking-[0.25em] text-gold">
            Sagardotegia · Aramaio
          </p>
          <p className="mt-3 text-xs leading-relaxed text-stone-600 max-w-sm">
            {t.footer.description}
          </p>
        </div>

        {/* Channels */}
        <div className="text-xs space-y-2">
          <p className="font-bold uppercase tracking-wider text-stone-900 mb-3">
            {t.visit.channelsLabel}
          </p>
          <p className="text-stone-600">Arraga auzoa, 2 · 01169 Aramaio, Álava</p>
          <p>
            <a href="mailto:info@iturrieta.eus" className="hover:text-gold font-medium transition-colors">
              info@iturrieta.eus
            </a>
          </p>
          <p>
            <a
              href="https://t.me/IturrietaBookingBot"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold font-bold hover:underline"
            >
              Telegram: @IturrietaBookingBot
            </a>
          </p>
        </div>

        {/* Links */}
        <div className="text-xs md:text-right">
          <p className="font-bold uppercase tracking-wider text-stone-900 mb-3">
            {t.footer.navTitle}
          </p>
          <ul className="space-y-2">
            {links.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="hover:text-gold transition-colors font-medium">
                  {link.label}
                </a>
              </li>
            ))}
            <li className="pt-2">
              <Link href="/admin" className="text-gold font-bold hover:underline">
                {t.nav.staff} Portal →
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 sm:px-8 mt-10 pt-6 border-t border-stone-200/80 text-[11px] flex flex-col sm:flex-row items-center justify-between text-stone-500">
        <p>© 2026 {t.footer.rights}</p>
        <p>Reservas Iturrieta · Autonomous Table Management System</p>
      </div>
    </footer>
  );
}
