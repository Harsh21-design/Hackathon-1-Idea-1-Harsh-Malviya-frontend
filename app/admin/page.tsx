import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin-dashboard";

export const metadata: Metadata = {
  title: "Staff · Reservas Iturrieta",
  description: "Today’s table requests and the service schedule for Iturrieta.",
};

export default function AdminPage() {
  return <AdminDashboard />;
}
