"use client";

import { Stepper, type StepItem } from "@/components/reui/stepper";
import type { Order } from "@/types";

interface OrderTimelineProps {
  order: Order;
}

export function OrderTimeline({ order }: OrderTimelineProps) {
  const history = order.statusHistory ?? [];

  const placedEntry = history.find((h) => h.status === "pending");
  const acceptedEntry = history.find((h) => h.status === "accepted");
  const rejectedEntry = history.find((h) => h.status === "rejected");
  const cancelledEntry = history.find((h) => h.status === "cancelled");

  const steps: StepItem[] = [
    {
      title: "Order Submitted",
      description: "Order request sent to vendor with delivery details.",
      date: placedEntry?.at ?? order.createdAt,
      status: "completed",
    },
  ];

  if (order.status === "pending") {
    steps.push({
      title: "Vendor Review",
      description: "The kitchen is reviewing recipe availability and schedule.",
      status: "current",
    });
    steps.push({
      title: "Bake & Delivery",
      description: `Target delivery date: ${order.deliveryDate}`,
      status: "upcoming",
    });
  } else if (order.status === "accepted") {
    steps.push({
      title: "Order Accepted",
      description: "The kitchen confirmed your order and scheduled dough prep.",
      date: acceptedEntry?.at,
      status: "completed",
    });
    steps.push({
      title: "Scheduled For Delivery",
      description: `Delivery scheduled for ${order.deliveryDate} at ${order.deliveryAddress}`,
      status: "current",
    });
  } else if (order.status === "rejected") {
    steps.push({
      title: "Order Declined",
      description: "The kitchen was unable to fulfill this order request.",
      date: rejectedEntry?.at,
      status: "failed",
    });
  } else if (order.status === "cancelled") {
    steps.push({
      title: "Order Cancelled",
      description: "The order was cancelled by the customer.",
      date: cancelledEntry?.at,
      status: "failed",
    });
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
      <h3 className="text-base font-bold text-foreground mb-6">
        Order Progress Timeline
      </h3>
      <Stepper steps={steps} />
    </div>
  );
}
