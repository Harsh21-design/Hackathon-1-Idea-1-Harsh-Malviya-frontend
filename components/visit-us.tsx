import Image from "next/image";

const contacts = [
  {
    label: "Call",
    value: "685 72 15 93",
    href: "tel:+34685721593",
  },
  {
    label: "WhatsApp",
    value: "Message the house",
    href: "https://wa.me/34685721593",
  },
  {
    label: "Email",
    value: "info@iturrieta.eus",
    href: "mailto:info@iturrieta.eus",
  },
] as const;

export function VisitUs() {
  return (
    <section id="visit" aria-labelledby="visit-heading" className="bg-cream py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-[3/4] overflow-hidden bg-cream-deep sm:aspect-[4/5]">
          <Image
            src="/images/valle-aramaio.jpg"
            alt="Green hills and a mountain ridge above the valley of Aramaio"
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover object-[center_30%]"
          />
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-cider-deep">Visit Us</p>
          <h2
            id="visit-heading"
            className="mt-4 font-serif text-4xl leading-tight font-medium text-ink sm:text-5xl"
          >
            In the valley of Aramaio
          </h2>
          <div className="mt-6 h-px w-16 bg-cider" />

          <dl className="mt-8 space-y-6">
            <div>
              <dt className="text-xs font-medium uppercase tracking-[0.18em] text-cider-deep">Place</dt>
              <dd className="mt-2 text-lg leading-7 text-ink">
                Arraga auzoa, 2
                <br />
                01169 Aramaio, Álava
                <span className="mt-1 block text-base text-muted">Basque Country, Spain</span>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-[0.18em] text-cider-deep">Opening</dt>
              <dd className="mt-2 text-base leading-7 text-muted">
                The house follows a seasonal calendar. Txotx, cider from the kupela, runs from January to May. Lunch, dinners, and group days are confirmed by Iturrieta. This page does not list clock times or remaining seats.
              </dd>
            </div>
          </dl>

          <p className="mt-8 text-base leading-7 text-ink">
            Ask the cider house for a table. A reservation is real only after they confirm it.
          </p>

          <ul className="mt-6 divide-y divide-ink/10 border border-ink/15 bg-paper">
            {contacts.map((contact) => (
              <li key={contact.label}>
                <a
                  href={contact.href}
                  className="flex items-baseline justify-between gap-4 px-4 py-4 transition-colors hover:bg-cream-deep sm:px-5"
                  {...(contact.href.startsWith("http")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  <span className="text-xs font-medium uppercase tracking-[0.16em] text-cider-deep">
                    {contact.label}
                  </span>
                  <span className="text-right text-sm text-ink">{contact.value}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
