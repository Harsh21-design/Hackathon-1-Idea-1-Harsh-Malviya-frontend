import Image from "next/image";

export function Hero() {
  return (
    <section id="top" className="relative min-h-[88svh] overflow-hidden bg-forest text-cream">
      <Image
        src="/images/caserio-verano.jpg"
        alt="The Iturrieta stone farmhouse in summer, set against forested mountains in Aramaio, with wildflowers in the foreground"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[72%_58%]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-forest/92 via-forest/55 to-forest/30 md:bg-gradient-to-r md:from-forest/90 md:via-forest/55 md:to-forest/15" />
      <div className="relative mx-auto flex min-h-[88svh] max-w-6xl flex-col justify-end px-5 py-16 sm:px-8 md:justify-center md:py-24">
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-copper-soft">
          Sagardotegia · Aramaio, Álava
        </p>
        <h1 className="mt-5 max-w-3xl font-serif text-5xl leading-[1.02] font-medium tracking-tight sm:text-6xl lg:text-7xl">
          From the apple tree to the txotx
        </h1>
        <p className="mt-4 font-serif text-xl text-cream/90 italic sm:text-2xl">
          Sagarretik txotxera
        </p>
        <p className="mt-6 max-w-xl text-base leading-7 text-cream/90 sm:text-lg sm:leading-8">
          A family cider house in the mountains of Aramaio. Natural cider from their own apples, the charcoal grill, and a long table in the Basque tradition.
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href="#visit"
            className="inline-flex items-center justify-center bg-copper px-6 py-3.5 text-sm font-medium tracking-wide text-cream transition-colors hover:bg-copper-soft hover:text-ink"
          >
            Reserve a Table
          </a>
          <a
            href="#story"
            className="inline-flex items-center justify-center border border-cream/50 px-6 py-3.5 text-sm font-medium text-cream transition-colors hover:border-cream hover:bg-cream/10"
          >
            Our Story
          </a>
        </div>
      </div>
    </section>
  );
}
