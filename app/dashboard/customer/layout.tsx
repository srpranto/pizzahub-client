import { requireAuthRole } from "@/lib/server-auth";

export default async function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuthRole(["customer"], "/dashboard/customer");
  return <>{children}</>;
}
