import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ brandId: string }> }
) {
  try {
    const { brandId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const platform = searchParams.get("platform");
    const days = searchParams.get("days");

    const where: Record<string, unknown> = { brandId };

    if (platform) {
      where.platform = platform;
    }

    if (days) {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(days));
      where.checkedAt = { gte: daysAgo };
    }

    const checks = await prisma.check.findMany({
      where,
      orderBy: { checkedAt: "desc" },
    });

    return NextResponse.json(checks);
  } catch (error) {
    console.error("Failed to fetch checks:", error);
    return NextResponse.json(
      { error: "Failed to fetch checks" },
      { status: 500 }
    );
  }
}
