import { requireAuthRole } from "@/lib/server-auth";

export default async function VendorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuthRole(["vendor"], "/dashboard/vendor");
  return <>{children}</>;
}
