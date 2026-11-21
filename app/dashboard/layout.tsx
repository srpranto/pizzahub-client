import { requireAuthRole } from "@/lib/server-auth";
import { Sidebar } from "@/components/layout/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuthRole();

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col md:flex-row">
      <Sidebar user={user} />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        {children}
      </div>
    </div>
  );
}
