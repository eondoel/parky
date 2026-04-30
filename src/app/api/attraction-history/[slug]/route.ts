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

  const themeParksId = req.nextUrl.searchParams.get("attractionId");
  const dateParam    = req.nextUrl.searchParams.get("date"); // YYYY-MM-DD in park timezone
  if (!themeParksId) return NextResponse.json({ error: "Missing attractionId" }, { status: 400 });

  // Resolve ThemeParks Wiki ID → database Attraction ID
  const attractionRecord = await prisma.attraction.findUnique({ where: { themeParksId } });
  if (!attractionRecord) return NextResponse.json({ hours: [], date: dateParam ?? "", snapshots: 0 });
  const attractionId = attractionRecord.id;

  // Determine the day window in UTC based on the park's timezone
  const dateStr = dateParam ?? new Date().toLocaleDateString("en-CA", { timeZone: park.timezone });
  const dayStart = new Date(`${dateStr}T00:00:00`);
  const dayEnd   = new Date(`${dateStr}T23:59:59`);

  // Convert park-local midnight → UTC (tzOffset = UTC - LOCAL, so LOCAL + offset = UTC)
  const tzOffset = getTimezoneOffset(park.timezone, dayStart);
  const utcStart = new Date(dayStart.getTime() + tzOffset);
  const utcEnd   = new Date(dayEnd.getTime()   + tzOffset);

  const snapshots = await prisma.waitSnapshot.findMany({
    where: {
      attractionId,
      recordedAt: { gte: utcStart, lte: utcEnd },
    },
    orderBy: { recordedAt: "asc" },
  });

  // Group by hour (park local time) and average
  const byHour: Record<number, { sum: number; count: number; statuses: string[] }> = {};
  for (const s of snapshots) {
    const localHour = new Date(s.recordedAt.getTime() - tzOffset).getHours();
    if (!byHour[localHour]) byHour[localHour] = { sum: 0, count: 0, statuses: [] };
    if (s.waitMinutes !== null) {
      byHour[localHour].sum += s.waitMinutes;
      byHour[localHour].count++;
    }
    byHour[localHour].statuses.push(s.status);
  }

  const hours = Object.entries(byHour)
    .map(([h, d]) => ({
      hour: Number(h),
      avgWait: d.count > 0 ? Math.round(d.sum / d.count) : null,
      status: d.statuses.includes("OPERATING") ? "OPERATING" : d.statuses[d.statuses.length - 1] ?? "UNKNOWN",
    }))
    .sort((a, b) => a.hour - b.hour);

  return NextResponse.json({ hours, date: dateStr, snapshots: snapshots.length });
}

function getTimezoneOffset(tz: string, date: Date): number {
  const utcDate = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }));
  const tzDate  = new Date(date.toLocaleString("en-US", { timeZone: tz }));
  return utcDate.getTime() - tzDate.getTime();
}
