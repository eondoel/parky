import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { PARK_BY_SLUG } from "@/lib/parks";
import { scoreToLevel } from "@/lib/predictions";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const park = PARK_BY_SLUG[slug];
  if (!park) return NextResponse.json({ error: "Park not found" }, { status: 404 });

  const { searchParams } = new URL(req.url);
  const year  = parseInt(searchParams.get("year")  ?? String(new Date().getFullYear()));
  const month = parseInt(searchParams.get("month") ?? String(new Date().getMonth() + 1));

  const dbPark = await prisma.park.findUnique({ where: { slug } });
  if (!dbPark) return NextResponse.json({ days: {} });

  const start = new Date(year, month - 1, 1);
  const end   = new Date(year, month, 0, 23, 59, 59);

  // Query daily average wait from snapshots
  const rows = await prisma.$queryRaw<{ day: string; avg_wait: number; count: bigint }[]>`
    SELECT
      TO_CHAR("recordedAt" AT TIME ZONE ${park.timezone}, 'YYYY-MM-DD') AS day,
      AVG("waitMinutes") AS avg_wait,
      COUNT(*) AS count
    FROM "WaitSnapshot" s
    JOIN "Attraction" a ON a.id = s."attractionId"
    WHERE a."parkId" = ${dbPark.id}
      AND s."recordedAt" >= ${start}
      AND s."recordedAt" <= ${end}
      AND s."waitMinutes" IS NOT NULL
      AND s.status = 'OPERATING'
    GROUP BY day
    ORDER BY day
  `;

  const days: Record<string, { score: number; level: string; label: string; avgWait: number; snapshots: number }> = {};

  for (const row of rows) {
    const avgWait = Number(row.avg_wait);
    // Convert avg wait to a 1–10 score (mirrors prediction engine scale)
    let score: number;
    if (avgWait <= 10)      score = 1;
    else if (avgWait <= 18) score = 2;
    else if (avgWait <= 24) score = 3;
    else if (avgWait <= 30) score = 4;
    else if (avgWait <= 38) score = 5;
    else if (avgWait <= 46) score = 6;
    else if (avgWait <= 55) score = 7;
    else if (avgWait <= 65) score = 8;
    else if (avgWait <= 78) score = 9;
    else                    score = 10;

    const { level, label } = scoreToLevel(score);
    days[row.day] = { score, level, label, avgWait: Math.round(avgWait), snapshots: Number(row.count) };
  }

  return NextResponse.json({ days });
}
