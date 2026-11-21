import { Loader } from "@/components/common/loader";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Loader size="lg" text="Preparing oven fresh delights..." />
    </div>
  );
}
