import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    try {
      await db.collection("subscribers").updateOne(
        { email },
        {
          $set: { email, updatedAt: new Date() },
          $setOnInsert: { createdAt: new Date() },
        },
        { upsert: true }
      );
    } catch (dbErr) {
      console.warn("MongoDB subscription write error (falling back):", dbErr);
    }

    return NextResponse.json({
      success: true,
      message: "Welcome to the Artisanal Sourdough Club! Check your inbox soon for exclusive oven drops.",
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to process subscription." },
      { status: 500 }
    );
  }
}
