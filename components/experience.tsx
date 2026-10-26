import Image from "next/image";

const experiences = [
  {
    index: "01",
    title: "Traditional dining",
    image: "/images/comedor.jpg",
    alt: "The Iturrieta dining room, with long wooden tables, benches, and a stone fireplace",
    imageClass: "object-cover object-[center_60%]",
    text: "Lunch at the sagardotegia is the classic cider-house table: the grill, cod, Idiazabal cheese, and cider from the house, served in the stone dining room.",
  },
  {
    index: "02",
    title: "Cider tasting",
    image: "/images/kupelas.jpg",
    alt: "A long wooden table set with glasses beneath two large cider barrels at Iturrieta",
    imageClass: "object-cover object-center",
    text: "Txotx is the tasting poured straight from the kupela. From January to May that is how the new cider is served. Afterwards, the same house cider comes to the table in the bottle.",
  },
  {
    index: "03",
    title: "Groups and visits",
    image: "/images/manzano-nieve.jpg",
    alt: "A snow-covered apple tree in the orchard at Iturrieta",
    imageClass: "object-cover object-center",
    text: "Families, cuadrillas, and groups come for the table, a look at the orchard and the press, or a gathering in the valley. The house arranges the details of each visit.",
  },
] as const;

export function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-heading" className="bg-paper py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-forest-mid">The Experience</p>
          <h2
            id="experience-heading"
            className="mt-4 font-serif text-4xl leading-tight font-medium text-forest sm:text-5xl"
          >
            Cider, the grill, and the company of the table
          </h2>
          <p className="mt-5 text-base leading-7 text-muted sm:text-lg">
            The day at Iturrieta is the Basque cider-house rhythm: a shared menu, cider from the house, and time enough to stay.
          </p>
        </div>

        <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          {experiences.map((item) => (
            <li key={item.index} className="flex flex-col">
              <div className="relative aspect-[4/3] overflow-hidden bg-cream-deep">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 768px) 30vw, 100vw"
                  className={item.imageClass}
                />
              </div>
              <p className="mt-5 text-xs font-medium tracking-[0.2em] text-copper">{item.index}</p>
              <h3 className="mt-2 font-serif text-3xl font-medium text-forest">{item.title}</h3>
              <p className="mt-3 text-base leading-7 text-muted">{item.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
