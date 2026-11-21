import { redirect } from "next/navigation";
import { requireAuthRole } from "@/lib/server-auth";
import { ROLE_DASHBOARD_ROUTES } from "@/lib/constants";

export default async function DashboardPage() {
  const user = await requireAuthRole();
  const target = ROLE_DASHBOARD_ROUTES[user.role] || "/dashboard/customer";
  redirect(target);
}
