import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AI_PLATFORMS, generateQueries } from "@/lib/platforms";
import { checkBrandVisibility } from "@/lib/checker";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { brandId } = body;

    if (!brandId) {
      return NextResponse.json(
        { error: "brandId is required" },
        { status: 400 }
      );
    }

    const brand = await prisma.brand.findUnique({
      where: { id: brandId },
    });

    if (!brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    // Generate queries from templates
    const queries = generateQueries(brand.name, brand.keywords);

    // Limit to a reasonable set: pick 5 diverse queries
    const selectedQueries = queries.slice(0, Math.min(queries.length, 5));

    const results = [];

    // Check each query against each platform
    for (const query of selectedQueries) {
      for (const platform of AI_PLATFORMS) {
        const result = await checkBrandVisibility(
          brand.name,
          query,
          platform.id,
          brand.keywords
        );

        const check = await prisma.check.create({
          data: {
            brandId: brand.id,
            query,
            platform: platform.id,
            mentioned: result.mentioned,
            position: result.position,
            context: result.context,
            fullResponse: result.fullResponse,
            sentiment: result.sentiment,
            competitors: result.competitors,
          },
        });

        results.push(check);
      }
    }

    return NextResponse.json({
      brand: brand.name,
      queriesChecked: selectedQueries.length,
      platformsChecked: AI_PLATFORMS.length,
      totalChecks: results.length,
      results,
    });
  } catch (error) {
    console.error("Failed to run visibility check:", error);
    return NextResponse.json(
      { error: "Failed to run visibility check" },
      { status: 500 }
    );
  }
}
