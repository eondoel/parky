import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { PARK_BY_SLUG } from "@/lib/parks";
import { getLiveData } from "@/lib/themeparks";

interface PlanStep {
  attractionId: string;
  name: string;
  estimatedWait: number;
  predictedWait: number | null;
  arrivalTime: string;
  exitTime: string;
  tip: string;
}

export async function POST(req: NextRequest) {
  const { parkSlug, visitDate, openTime = "09:00", preferences = [] } = await req.json();

  const park = PARK_BY_SLUG[parkSlug];
  if (!park) return NextResponse.json({ error: "Park not found" }, { status: 404 });

  // Get live data
  const live = await getLiveData(park.themeParksId);
  const liveMap = new Map(live.liveData.map((e) => [e.id, e]));

  // Get historical averages for the target day of week
  const targetDate = new Date(visitDate);
  const dow = targetDate.getDay();

  const dbPark = await prisma.park.findUnique({ where: { slug: parkSlug } });
  const historicalAvgs = new Map<string, number>();

  if (dbPark) {
    const rows = await prisma.$queryRaw<{ themeParksId: string; avg_wait: number }[]>`
      SELECT a."themeParksId", AVG(s."waitMinutes") AS avg_wait
      FROM "WaitSnapshot" s
      JOIN "Attraction" a ON a.id = s."attractionId"
      WHERE a."parkId" = ${dbPark.id}
        AND EXTRACT(DOW FROM s."recordedAt") = ${dow}
        AND s."waitMinutes" IS NOT NULL
        AND s.status = 'OPERATING'
      GROUP BY a."themeParksId"
    `;
    for (const row of rows) {
      historicalAvgs.set(row.themeParksId, Math.round(Number(row.avg_wait)));
    }
  }

  // Build scored attraction list
  const attractions = live.liveData
    .filter((e) => (e.entityType === "ATTRACTION" || e.entityType === "RIDE") && e.status !== "CLOSED" && e.status !== "REFURBISHMENT")
    .map((e) => {
      const liveWait = e.queue?.STANDBY?.waitTime ?? null;
      const historicalWait = historicalAvgs.get(e.id) ?? null;
      const estimatedWait = liveWait ?? historicalWait ?? 30;
      return { id: e.id, name: e.name, liveWait, historicalWait, estimatedWait };
    });

  // Filter by preferences if provided
  const filtered =
    preferences.length > 0
      ? attractions.filter((a) => preferences.some((p: string) => a.name.toLowerCase().includes(p.toLowerCase())))
      : attractions;

  // Sort: open attractions with lowest estimated wait first (rope-drop strategy)
  const sorted = filtered.sort((a, b) => a.estimatedWait - b.estimatedWait);

  // Build the plan timeline
  const plan: PlanStep[] = [];
  let cursor = parseTimeToMinutes(openTime);
  const AVG_RIDE_DURATION = 10;
  const WALK_TIME = 7;

  for (const attraction of sorted) {
    const arrivalTime = formatMinutes(cursor);
    const waitMinutes = attraction.estimatedWait;
    const rideEnd = cursor + waitMinutes + AVG_RIDE_DURATION;
    const exitTime = formatMinutes(rideEnd);

    let tip = "";
    if (waitMinutes <= 15) tip = "Low wait — great time to ride!";
    else if (waitMinutes <= 30) tip = "Moderate wait — consider riding early or late.";
    else tip = "Long wait — consider Lightning Lane or come back later.";

    plan.push({
      attractionId: attraction.id,
      name: attraction.name,
      estimatedWait: waitMinutes,
      predictedWait: attraction.historicalWait,
      arrivalTime,
      exitTime,
      tip,
    });

    cursor = rideEnd + WALK_TIME;
    if (plan.length >= 12) break;
  }

  return NextResponse.json({ park, visitDate, plan });
}

function parseTimeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function formatMinutes(total: number): string {
  const h = Math.floor(total / 60) % 24;
  const m = total % 60;
  const ampm = h >= 12 ? "PM" : "AM";
  const displayH = h % 12 === 0 ? 12 : h % 12;
  return `${displayH}:${String(m).padStart(2, "0")} ${ampm}`;
}
