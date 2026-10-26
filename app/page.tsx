import { ChatWidget } from "@/components/chat-widget";
import { Experience } from "@/components/experience";
import { Hero } from "@/components/hero";
import { HouseLanding } from "@/components/house-landing";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TableRequestForm } from "@/components/table-request-form";
import { VisitUs } from "@/components/visit-us";
import { LangProvider } from "@/lib/lang-context";

export default function Home() {
  return (
    <LangProvider>
      <SiteHeader />
      <main id="main" className="flex-1">
        <Hero />
        <HouseLanding />
        <Experience />
        <TableRequestForm />
        <VisitUs />
      </main>
      <SiteFooter />
      {/* Floating AI Concierge Agent for guest inquiries */}
      <ChatWidget />
    </LangProvider>
  );
}
