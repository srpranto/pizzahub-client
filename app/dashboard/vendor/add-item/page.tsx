import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ItemForm } from "@/components/dashboard/item-form";
import { GradientText } from "@/components/motion-brew/gradient-text";
import { AnnotationText } from "@/components/motion-brew/annotation-text";

export default function VendorAddItemPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/dashboard/vendor/menu"
          className="inline-flex items-center text-xs font-medium text-muted-foreground hover:text-foreground mb-3"
        >
          <ArrowLeft className="h-3.5 w-3.5 mr-1" />
          Back to Menu Items
        </Link>
        <GradientText
          as="h1"
          text="Add New Pizza Creation"
          colors={["#d9381e", "#e67e22", "#d9381e"]}
          className="text-2xl font-extrabold tracking-tight sm:text-3xl"
        />
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Upload artisan photos, specify{" "}
          <AnnotationText type="underline" color="rgba(217, 56, 30, 0.45)" strokeWidth={1.5}>
            stone-baking techniques
          </AnnotationText>
          , and submit for platform review.
        </p>
      </div>

      <ItemForm />
    </div>
  );
}
