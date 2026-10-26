import Image from "next/image";

export function OurStory() {
  return (
    <section id="story" aria-labelledby="story-heading" className="bg-cream py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-cider-deep">Our Story</p>
          <h2
            id="story-heading"
            className="mt-4 font-serif text-4xl leading-tight font-medium text-ink sm:text-5xl"
          >
            A farmhouse that still presses its own apples
          </h2>
          <div className="mt-6 h-px w-16 bg-cider" />
          <div className="mt-6 space-y-5 text-base leading-7 text-muted sm:text-lg sm:leading-8">
            <p>
              Iturrieta is a family farm in Aramaio. In 1998 the stables of the caserío opened as a sagardotegia, and the house still makes natural organic cider from apples grown on the land.
            </p>
            <p>
              About 1,400 apple trees surround the farmhouse. In txotx season, January to May, the cider is poured from the kupela. The rest of the year it is served from the bottle.
            </p>
          </div>
          <p className="mt-8 flex items-start gap-4 font-serif text-2xl leading-snug text-ink italic sm:text-3xl">
            <span aria-hidden="true" className="mt-[0.7em] h-px w-10 shrink-0 bg-cider" />
            <span>From the orchard, to the press, to the table.</span>
          </p>
        </div>

        <figure className="lg:col-span-7">
          <div className="relative aspect-[4/5] overflow-hidden bg-cream-deep">
            <Image
              src="/images/prensa.jpg"
              alt="A traditional wooden apple press on the lawn of the Iturrieta farmhouse, with the mountains of Álava behind it"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover object-[center_40%]"
            />
          </div>
          <figcaption className="mt-3 text-sm leading-6 text-muted">
            The wooden apple press on the lawn of the caserío.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
