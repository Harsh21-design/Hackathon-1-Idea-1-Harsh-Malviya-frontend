const links = [
  { href: "#story", label: "Our Story" },
  { href: "#experience", label: "The Experience" },
  { href: "#visit", label: "Visit Us" },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-forest text-cream">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-12 sm:px-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-serif text-3xl leading-none">Iturrieta</p>
          <p className="mt-3 text-sm tracking-[0.16em] uppercase text-copper-soft">Sagardotegia</p>
          <p className="mt-4 max-w-sm text-sm leading-6 text-cream/80">
            A family cider house in Aramaio, Álava. Photographs on this page are published by Iturrieta.
          </p>
        </div>
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
