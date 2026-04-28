import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { PARK_BY_SLUG } from "@/lib/parks";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const park = PARK_BY_SLUG[slug];
  if (!park) return NextResponse.json({ error: "Park not found" }, { status: 404 });

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") ?? "by-day"; // by-day | by-hour | by-month

  const dbPark = await prisma.park.findUnique({ where: { slug } });
  if (!dbPark) return NextResponse.json({ data: [], message: "No data collected yet" });

  const attractions = await prisma.attraction.findMany({
    where: { parkId: dbPark.id },
    select: { id: true, name: true },
  });

  if (attractions.length === 0) {
    return NextResponse.json({ data: [], message: "No data collected yet" });
  }

  const attractionIds = attractions.map((a) => a.id);

  if (type === "by-day") {
    // Average wait per day of week (0=Sun, 6=Sat)
    const rows = await prisma.$queryRaw<{ dow: number; avg_wait: number; count: bigint }[]>`
      SELECT
        EXTRACT(DOW FROM "recordedAt")::int AS dow,
        AVG("waitMinutes") AS avg_wait,
        COUNT(*) AS count
      FROM "WaitSnapshot"
      WHERE "attractionId" = ANY(${attractionIds}::text[])
        AND "waitMinutes" IS NOT NULL
        AND status = 'OPERATING'
      GROUP BY dow
      ORDER BY dow
    `;

    const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const data = rows.map((r) => ({
      label: DAY_NAMES[r.dow],
      avgWait: Math.round(Number(r.avg_wait)),
      count: Number(r.count),
    }));

    return NextResponse.json({ data, type });
  }

  if (type === "by-hour") {
    const rows = await prisma.$queryRaw<{ hour: number; avg_wait: number; count: bigint }[]>`
      SELECT
        EXTRACT(HOUR FROM "recordedAt" AT TIME ZONE ${park.timezone})::int AS hour,
        AVG("waitMinutes") AS avg_wait,
        COUNT(*) AS count
      FROM "WaitSnapshot"
      WHERE "attractionId" = ANY(${attractionIds}::text[])
        AND "waitMinutes" IS NOT NULL
        AND status = 'OPERATING'
      GROUP BY hour
      ORDER BY hour
    `;

    const data = rows.map((r) => ({
      label: `${r.hour}:00`,
      avgWait: Math.round(Number(r.avg_wait)),
      count: Number(r.count),
    }));

    return NextResponse.json({ data, type });
  }

  if (type === "by-month") {
    const rows = await prisma.$queryRaw<{ month: number; avg_wait: number; count: bigint }[]>`
      SELECT
        EXTRACT(MONTH FROM "recordedAt")::int AS month,
        AVG("waitMinutes") AS avg_wait,
        COUNT(*) AS count
      FROM "WaitSnapshot"
      WHERE "attractionId" = ANY(${attractionIds}::text[])
        AND "waitMinutes" IS NOT NULL
        AND status = 'OPERATING'
      GROUP BY month
      ORDER BY month
    `;

    const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const data = rows.map((r) => ({
      label: MONTH_NAMES[r.month - 1],
      avgWait: Math.round(Number(r.avg_wait)),
      count: Number(r.count),
    }));

    return NextResponse.json({ data, type });
  }

  return NextResponse.json({ error: "Invalid type" }, { status: 400 });
}
