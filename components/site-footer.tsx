const links = [
  { href: "#story", label: "Our Story" },
  { href: "#experience", label: "The Experience" },
  { href: "#visit", label: "Visit Us" },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-cider bg-ink text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto] md:items-start md:gap-12">
        <div>
          <p className="font-serif text-3xl leading-none">Iturrieta</p>
          <p className="mt-3 text-sm tracking-[0.16em] text-cream uppercase">Sagardotegia</p>
          <p className="mt-4 max-w-sm text-sm leading-6 text-cream/80">
            A family cider house in Aramaio, Álava. Photographs on this page are published by Iturrieta.
          </p>
        </div>
        <address className="not-italic">
          <p className="text-sm leading-6 text-cream/85">
            Arraga auzoa, 2
            <br />
            01169 Aramaio, Álava
          </p>
          <a href="tel:+34685721593" className="mt-3 inline-block text-sm text-cream/85 hover:text-cream">
            685 72 15 93
          </a>
        </address>
        <nav aria-label="Footer">
          <ul className="flex flex-col gap-2 md:items-end">
            {links.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="text-sm text-cream/85 hover:text-cream">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
