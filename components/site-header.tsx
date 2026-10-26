"use client";

import { useEffect, useState } from "react";

const links = [
  { href: "#house", label: "The House" },
  { href: "#request", label: "Request a Table" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-ink/15 bg-cream/95 backdrop-blur-md">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:bg-paper focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
        <a href="#top" className="group min-w-0 shrink-0">
          <span className="block font-serif text-[1.7rem] leading-none tracking-tight text-ink">
            Iturrieta
          </span>
          <span className="mt-1 block text-[0.68rem] font-medium uppercase tracking-[0.22em] text-muted">
            Sagardotegia
          </span>
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink/80 transition-colors hover:text-cider-deep"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <a
            href="tel:+34685721593"
            className="hidden items-center justify-center rounded-full bg-[#A8A29A] px-4 py-2.5 text-sm font-medium whitespace-nowrap text-white transition-colors hover:bg-[#7E7A72] lg:inline-flex"
          >
            685 72 15 93
          </a>
          <a
            href="#request"
            className="inline-flex items-center justify-center bg-cider px-3 py-2.5 text-sm font-medium whitespace-nowrap text-white transition-colors hover:bg-cider-deep sm:px-5"
          >
            Reserve a Table
          </a>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center border border-ink/20 text-ink lg:hidden"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span aria-hidden="true" className="flex flex-col gap-1.5">
              <span className="block h-px w-5 bg-ink" />
              <span className="block h-px w-5 bg-ink" />
              <span className="block h-px w-5 bg-ink" />
            </span>
          </button>
        </div>
      </div>

      {open ? (
        <nav id="site-menu" aria-label="Mobile" className="border-t border-ink/15 bg-paper lg:hidden">
          <ul className="mx-auto flex max-w-6xl flex-col px-5 py-2 sm:px-8">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="block py-3 text-base text-ink"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="tel:+34685721593"
                className="block py-3 text-base text-ink"
                onClick={() => setOpen(false)}
              >
                685 72 15 93
              </a>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
