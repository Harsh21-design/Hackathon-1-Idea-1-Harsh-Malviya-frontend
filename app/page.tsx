import { HouseLanding } from "@/components/house-landing";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TableRequestForm } from "@/components/table-request-form";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <HouseLanding />
        <TableRequestForm />
      </main>
      <SiteFooter />
    </>
  );
}
