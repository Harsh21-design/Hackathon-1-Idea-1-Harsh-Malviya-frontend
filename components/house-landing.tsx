import Image from "next/image";
import { OpenHours } from "@/components/open-hours";

const facts = [
  { label: "Since", value: "1998" },
  { label: "Txotx season", value: "January to May" },
] as const;

const more = [
  { label: "Menu", value: "€45, children €16" },
  { label: "Also", value: "Concerts, visits, shop" },
  { label: "Website", value: "5 languages" },
] as const;

export function HouseLanding() {
  return (
    <section id="top" className="bg-cream pt-12 pb-8 sm:pt-16 sm:pb-12">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-cider">
          Hackathon 1 · Project A · Reservas Iturrieta
        </p>
        <h1 className="mt-4 max-w-3xl font-serif text-5xl leading-[1.05] font-medium tracking-tight text-ink sm:text-6xl">
          About Sidrería Iturrieta
        </h1>

        <div className="mt-10 grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
          <div id="house" className="lg:col-span-7">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="font-serif text-4xl leading-none text-ink">Iturrieta</p>
                <p className="mt-2 text-xs font-medium uppercase tracking-[0.18em] text-cider">
                  Sagardotegia · Aramaio
                </p>
              </div>
              <a
                href="https://www.iturrieta.eus/"
                className="shrink-0 text-sm text-cider underline decoration-cider/40 underline-offset-4"
                target="_blank"
                rel="noopener noreferrer"
              >
                iturrieta.eus
              </a>
            </div>

            <p className="mt-6 max-w-xl text-base leading-7 text-ink sm:text-lg sm:leading-8">
              A family farm and cider house in the Aramaio valley, 30 minutes from Vitoria. They grow their own organic apples and make their own natural cider.
            </p>

            <figure className="mt-8">
              <div className="relative aspect-[16/9] overflow-hidden bg-cream-deep">
                <Image
                  src="/images/caserio-verano.jpg"
                  alt="The Iturrieta stone farmhouse in summer, set against forested mountains in Aramaio"
                  fill
                  priority
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  className="object-cover object-[72%_58%]"
                />
              </div>
            </figure>

            <dl className="mt-8 grid gap-6 border-t border-ink/15 py-5 sm:grid-cols-3">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="text-xs font-medium uppercase tracking-[0.16em] text-cider">{fact.label}</dt>
                  <dd className="mt-2 text-lg text-ink">{fact.value}</dd>
                </div>
              ))}
              <div>
                <dt className="text-xs font-medium uppercase tracking-[0.16em] text-cider">Open</dt>
                <dd className="mt-2 text-lg text-ink">
                  <OpenHours />
                </dd>
              </div>
            </dl>
            <dl className="grid gap-6 border-t border-ink/15 py-5 sm:grid-cols-3">
              {more.map((fact) => (
                <div key={fact.label}>
                  <dt className="text-xs font-medium uppercase tracking-[0.16em] text-cider">{fact.label}</dt>
                  <dd className="mt-2 text-lg text-ink">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="flex flex-col gap-4 lg:col-span-5">
            <div className="bg-[#e4d3c0] px-6 py-10 sm:px-8">
              <p className="font-serif text-7xl leading-none font-medium text-cider sm:text-8xl">1,400</p>
              <p className="mt-4 max-w-xs text-base leading-7 text-ink">Organic apple trees in the Aramaio valley</p>
            </div>
            <div className="bg-ink px-6 py-8 text-cream sm:px-8">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#e4d3c0]">Bookings today</p>
              <p className="mt-3 text-base leading-7">By phone and WhatsApp, confirmed by the house.</p>
              <p className="mt-8 text-xs font-medium uppercase tracking-[0.18em] text-[#e4d3c0]">What we will build</p>
              <p className="mt-3 text-base leading-7">One booking flow for web, WhatsApp, and phone.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
