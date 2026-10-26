"use client";

import Image from "next/image";
import { useLang } from "@/lib/lang-context";

export function Experience() {
  const { t } = useLang();

  const experiences = [
    {
      title: t.experience.card1Title,
      subtitle: t.experience.card1Sub,
      image: "/images/comedor.jpg",
      alt: "The Iturrieta dining room with long wooden tables and stone fireplace",
      text: t.experience.card1Text,
    },
    {
      title: t.experience.card2Title,
      subtitle: t.experience.card2Sub,
      image: "/images/kupelas.jpg",
      alt: "Wooden kupela barrels and glasses in the cellar",
      text: t.experience.card2Text,
    },
    {
      title: t.experience.card3Title,
      subtitle: t.experience.card3Sub,
      image: "/images/manzano-nieve.jpg",
      alt: "Organic apple trees in Aramaio",
      text: t.experience.card3Text,
    },
  ];

  return (
    <section id="experience" aria-labelledby="experience-heading" className="bg-[#f4eee4]/60 py-24 sm:py-32 border-y border-stone-200/80">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-gold">
            {t.experience.badge}
          </span>
          <h2
            id="experience-heading"
            className="mt-3 font-serif text-4xl leading-tight font-semibold text-stone-900 sm:text-5xl"
          >
            {t.experience.title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-stone-600 sm:text-lg">
            {t.experience.subtitle}
          </p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {experiences.map((item) => (
            <article
              key={item.title}
              className="group flex flex-col overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm transition-all duration-300 hover:border-gold/40 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-300">
                    {item.subtitle}
                  </span>
                  <h3 className="font-serif text-2xl font-semibold text-white">
                    {item.title}
                  </h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-sm leading-relaxed text-stone-600">
                  {item.text}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
