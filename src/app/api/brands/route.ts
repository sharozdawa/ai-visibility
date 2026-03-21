import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        checks: {
          orderBy: { checkedAt: "desc" },
          take: 100,
        },
      },
    });
    return NextResponse.json(brands);
  } catch (error) {
    console.error("Failed to fetch brands:", error);
    return NextResponse.json(
      { error: "Failed to fetch brands" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, domain, keywords } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Brand name is required" },
        { status: 400 }
      );
    }

    const brand = await prisma.brand.create({
      data: {
        name: name.trim(),
        domain: domain?.trim() || null,
        keywords: Array.isArray(keywords)
          ? keywords.map((k: string) => k.trim()).filter(Boolean)
          : [],
      },
    });

    return NextResponse.json(brand, { status: 201 });
  } catch (error) {
    console.error("Failed to create brand:", error);
    return NextResponse.json(
      { error: "Failed to create brand" },
      { status: 500 }
    );
  }
}
