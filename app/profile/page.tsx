import { requireAuthRole } from "@/lib/server-auth";
import { ProfileForm } from "@/components/dashboard/profile-form";
import { UserCheck } from "lucide-react";
import { GradientText } from "@/components/motion-brew/gradient-text";
import { AnnotationText } from "@/components/motion-brew/annotation-text";

export default async function ProfilePage() {
  const user = await requireAuthRole(undefined, "/profile");

  return (
    <div className="relative min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="ambient-glow pointer-events-none absolute inset-x-0 top-0 h-96 -z-10" />
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-3">
            <UserCheck className="h-3.5 w-3.5" />
            <span>Account Security &amp; Identity</span>
          </div>
          <GradientText
            as="h1"
            text="Account Profile"
            colors={["#d9381e", "#e67e22", "#d9381e"]}
            className="text-3xl font-extrabold tracking-tight sm:text-4xl"
          />
          <p className="mt-2 text-sm text-muted-foreground">
            Manage your personal profile information, avatar photo, and{" "}
            <AnnotationText type="underline" color="rgba(217, 56, 30, 0.45)" strokeWidth={1.5}>
              restaurant brand identity
            </AnnotationText>
            .
          </p>
        </div>

        <ProfileForm user={user} />
      </div>
    </div>
  );
}
