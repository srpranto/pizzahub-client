"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, MessageSquare, Send, AlertCircle, Sparkles, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Review, ItemReviewsSummary } from "@/types";

interface ReviewsSectionProps {
  itemId: string;
  vendorId: string;
  itemName: string;
}

export function ReviewsSection({
  itemId,
  vendorId,
  itemName,
}: ReviewsSectionProps) {
  const { data: session } = useSession();
  const [summary, setSummary] = React.useState<ItemReviewsSummary>({
    reviews: [],
    averageRating: 0,
    totalReviews: 0,
  });
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);

  // Form state
  const [rating, setRating] = React.useState(5);
  const [hoverRating, setHoverRating] = React.useState(0);
  const [comment, setComment] = React.useState("");

  const user = session?.user;
  const isOwner = Boolean(user && user.id === vendorId);

  const fetchReviews = React.useCallback(async () => {
    try {
      const res = await apiFetch<{
        success: boolean;
        data: ItemReviewsSummary;
      }>(`/api/menu/${itemId}/reviews`);

      if (res.success && res.data) {
        setSummary(res.data);
      }
    } catch {
      // Quiet fallback
    } finally {
      setLoading(false);
    }
  }, [itemId]);

  React.useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      toast.error("Please sign in to submit a review");
      return;
    }

    if (isOwner) {
      toast.error("Vendors cannot write reviews for their own artisanal pizzas");
      return;
    }

    if (!comment.trim() || comment.trim().length < 3) {
      toast.error("Please write at least 3 characters in your review comment");
      return;
    }

    try {
      setSubmitting(true);
      const res = await apiFetch<{
        success: boolean;
        message?: string;
        data?: { review: Review; summary: ItemReviewsSummary };
      }>(`/api/menu/${itemId}/reviews`, {
        method: "POST",
        body: JSON.stringify({
          rating,
          comment: comment.trim(),
        }),
      });

      if (res.success) {
        toast.success(res.message || "Review submitted successfully!");
        setComment("");
        if (res.data?.summary) {
          setSummary(res.data.summary);
        } else {
          fetchReviews();
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to submit review";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const userExistingReview = user
    ? summary.reviews.find((r) => r.customerId === user.id)
    : undefined;

  return (
    <section className="mt-14 border-t border-border pt-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary mb-1">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Community Feedback</span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Customer Reviews &amp; Ratings
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Verified feedback from pizza connoisseurs who enjoyed {itemName}.
          </p>
        </div>

        {summary.totalReviews > 0 && (
          <div className="flex items-center gap-3 rounded-2xl border border-border/80 bg-card p-3.5 px-5 shadow-xs w-fit">
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="h-6 w-6 fill-current" />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-foreground tabular-nums">
                  {summary.averageRating.toFixed(1)}
                </span>
                <span className="text-xs text-muted-foreground font-semibold">
                  / 5.0
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Based on {summary.totalReviews} review{summary.totalReviews !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Review Submission Form */}
        <div className="lg:col-span-5 rounded-2xl border border-border/80 bg-card p-6 shadow-xs">
          <h3 className="text-lg font-bold text-foreground mb-1">
            {userExistingReview ? "Update Your Review" : "Leave a Review"}
          </h3>
          <p className="text-xs text-muted-foreground mb-5">
            Share your experience with the crust, sauce balance, and toppings.
          </p>

          {!session ? (
            <div className="rounded-xl border border-dashed border-border bg-muted/40 p-6 text-center space-y-3">
              <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto" />
              <p className="text-xs text-muted-foreground">
                Sign in to your PizzaHub account to leave a rating and share your taste review.
              </p>
              <Button asChild size="sm" className="w-full">
                <Link href={`/sign-in?callbackUrl=${encodeURIComponent(`/menu/${itemId}`)}`}>Sign In to Review</Link>
              </Button>
            </div>
          ) : isOwner ? (
            <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-xs text-amber-700 dark:text-amber-300">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>You are the baker of this pizza. Vendors cannot review their own creations.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1.5">
                  Your Overall Rating
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const active = (hoverRating || rating) >= star;
                    return (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 rounded-md transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                        aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
                      >
                        <Star
                          className={`h-6 w-6 transition-colors duration-150 ${
                            active
                              ? "fill-amber-400 text-amber-500"
                              : "text-muted-foreground/40 hover:text-muted-foreground"
                          }`}
                        />
                      </button>
                    );
                  })}
                  <span className="ml-2 text-xs font-bold text-foreground tabular-nums">
                    {hoverRating || rating} / 5 Stars
                  </span>
                </div>
              </div>

              <div>
                <label
                  htmlFor="review-comment"
                  className="text-xs font-semibold text-foreground block mb-1.5"
                >
                  Your Review Comment
                </label>
                <textarea
                  id="review-comment"
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="How was the sourdough crust blister? Was the cheese melted to perfection? Mention delivery speed or special flavor notes..."
                  disabled={submitting}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full font-bold gap-2"
              >
                <Send className="h-4 w-4" />
                {submitting
                  ? "Publishing Review..."
                  : userExistingReview
                  ? "Update Review"
                  : "Publish Review"}
              </Button>

              {userExistingReview && (
                <p className="text-[11px] text-muted-foreground text-center flex items-center justify-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>You previously rated this pizza {userExistingReview.rating}★</span>
                </p>
              )}
            </form>
          )}
        </div>

        {/* Right Column: Customer Reviews Feed */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-foreground">
              Recent Customer Reviews ({summary.totalReviews})
            </h3>
            {summary.totalReviews > 0 && (
              <Badge variant="outline" className="text-xs font-medium">
                Verified Orders &amp; Reviews
              </Badge>
            )}
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-muted-foreground">
              Loading verified reviews...
            </div>
          ) : summary.reviews.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/80 p-8 text-center bg-card/40 space-y-2">
              <MessageSquare className="h-8 w-8 text-muted-foreground/60 mx-auto" />
              <p className="text-sm font-bold text-foreground">No Reviews Yet</p>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Be the first pizza connoisseur to taste this stone-fired creation and leave a review!
              </p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {summary.reviews.map((rev) => {
                const initials = rev.customerName
                  ? rev.customerName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)
                  : "U";

                return (
                  <div
                    key={rev.id}
                    className="rounded-2xl border border-border/70 bg-card p-4 sm:p-5 shadow-xs space-y-2.5 transition-all hover:border-primary/30"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        {rev.customerImage ? (
                          <Image
                            src={rev.customerImage}
                            alt={rev.customerName}
                            width={32}
                            height={32}
                            unoptimized
                            className="h-8 w-8 rounded-full object-cover border border-border"
                          />
                        ) : (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
                            {initials}
                          </div>
                        )}
                        <div>
                          <p className="text-xs font-bold text-foreground leading-none">
                            {rev.customerName}
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            {new Date(rev.createdAt).toLocaleDateString([], {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-0.5 text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 ${
                              i < rev.rating
                                ? "fill-amber-400 text-amber-500"
                                : "text-muted-foreground/30"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-foreground/90 leading-relaxed [text-wrap:pretty]">
                      {rev.comment}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
