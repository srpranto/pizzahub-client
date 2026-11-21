import { requireAuthRole } from "@/lib/server-auth";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuthRole(["admin"], "/dashboard/admin");
  return <>{children}</>;
}
