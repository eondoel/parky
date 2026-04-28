import { NextRequest, NextResponse } from "next/server";
import { PARK_BY_SLUG } from "@/lib/parks";
import { getLiveData } from "@/lib/themeparks";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const park = PARK_BY_SLUG[slug];
  if (!park) return NextResponse.json({ error: "Park not found" }, { status: 404 });

  const data = await getLiveData(park.themeParksId);

  const attractions = data.liveData
    .filter((e) => e.entityType === "ATTRACTION" || e.entityType === "RIDE")
    .map((e) => ({
      id: e.id,
      name: e.name,
      status: e.status ?? "UNKNOWN",
      waitMinutes: e.queue?.STANDBY?.waitTime ?? null,
      singleRider: e.queue?.SINGLE_RIDER?.waitTime ?? null,
      lastUpdated: e.lastUpdated,
    }))
    .sort((a, b) => {
      if (a.waitMinutes === null && b.waitMinutes === null) return a.name.localeCompare(b.name);
      if (a.waitMinutes === null) return 1;
      if (b.waitMinutes === null) return -1;
      return a.waitMinutes - b.waitMinutes;
    });

  return NextResponse.json({ park, attractions });
}
