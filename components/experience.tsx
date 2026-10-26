import Image from "next/image";

const experiences = [
  {
    title: "Traditional dining",
    image: "/images/comedor.jpg",
    alt: "The Iturrieta dining room, with long wooden tables, benches, and a stone fireplace",
    imageClass: "object-cover object-[center_60%]",
    text: "Lunch at the sagardotegia is the classic cider-house table: the grill, cod, Idiazabal cheese, and cider from the house, served in the stone dining room.",
  },
  {
    title: "Cider tasting",
    image: "/images/kupelas.jpg",
    alt: "A long wooden table set with glasses beneath two large cider barrels at Iturrieta",
    imageClass: "object-cover object-center",
    text: "Txotx is the tasting poured straight from the kupela. From January to May that is how the new cider is served. Afterwards, the same house cider comes to the table in the bottle.",
  },
  {
    title: "Groups and visits",
    image: "/images/manzano-nieve.jpg",
    alt: "A snow-covered apple tree in the orchard at Iturrieta",
    imageClass: "object-cover object-center",
    text: "Families, cuadrillas, and groups come for the table, a look at the orchard and the press, or a gathering in the valley. The house arranges the details of each visit.",
  },
] as const;

function ExperienceCard({
  item,
  featured = false,
}: {
  item: (typeof experiences)[number];
  featured?: boolean;
}) {
  return (
    <article className={featured ? "flex h-full flex-col lg:col-span-2 lg:row-span-2" : undefined}>
      <div
        className={`relative overflow-hidden bg-cream-deep ${featured ? "aspect-[4/5] flex-1 sm:aspect-[4/3] lg:aspect-auto lg:min-h-[28rem]" : "aspect-[4/3]"}`}
      >
        <Image
          src={item.image}
          alt={item.alt}
          fill
          sizes={featured ? "(min-width: 1024px) 60vw, 100vw" : "(min-width: 1024px) 30vw, 100vw"}
          className={item.imageClass}
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-overlay/90 via-overlay/45 to-transparent px-5 pt-16 pb-5">
          <h3 className={`font-serif font-medium text-cream ${featured ? "text-4xl" : "text-3xl"}`}>
            {item.title}
          </h3>
        </div>
      </div>
      <p className="mt-4 text-base leading-7 text-muted">{item.text}</p>
    </article>
  );
}

export function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-heading" className="bg-paper py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-cider-deep">The Experience</p>
          <h2
            id="experience-heading"
            className="mt-4 font-serif text-4xl leading-tight font-medium text-ink sm:text-5xl"
          >
            Cider, the grill, and the company of the table
          </h2>
          <p className="mt-5 text-base leading-7 text-muted sm:text-lg">
            The day at Iturrieta is the Basque cider-house rhythm: a shared menu, cider from the house, and time enough to stay.
          </p>
        </div>

        <div className="mt-14 grid gap-12 lg:grid-cols-3 lg:grid-rows-2 lg:gap-8">
          <ExperienceCard item={experiences[0]} featured />
          <ExperienceCard item={experiences[1]} />
          <ExperienceCard item={experiences[2]} />
        </div>
      </div>
    </section>
  );
}
