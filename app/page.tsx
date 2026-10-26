import { Experience } from "@/components/experience";
import { Hero } from "@/components/hero";
import { OurStory } from "@/components/our-story";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { VisitUs } from "@/components/visit-us";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <Hero />
        <OurStory />
        <Experience />
        <VisitUs />
      </main>
      <SiteFooter />
    </>
  );
}
