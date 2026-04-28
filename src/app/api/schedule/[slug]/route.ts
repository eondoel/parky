import { NextRequest, NextResponse } from "next/server";
import { PARK_BY_SLUG } from "@/lib/parks";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const park = PARK_BY_SLUG[slug];
  if (!park) return NextResponse.json({ error: "Park not found" }, { status: 404 });

  const res = await fetch(
    `https://api.themeparks.wiki/v1/entity/${park.themeParksId}/schedule`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) return NextResponse.json({ hours: null });

  const data = await res.json();

  // Get today's date in the park's local timezone
  const today = new Date().toLocaleDateString("en-CA", { timeZone: park.timezone }); // YYYY-MM-DD

  const todaySchedule = (data.schedule ?? []).filter(
    (s: { date: string; type: string }) => s.date === today
  );

  const operating = todaySchedule.find((s: { type: string }) => s.type === "OPERATING");
  const earlyEntry = todaySchedule.find((s: { type: string; description?: string }) =>
    s.type === "TICKETED_EVENT" && s.description?.toLowerCase().includes("early")
  );

  function fmt(iso: string) {
    return new Date(iso).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      timeZone: park.timezone,
    });
  }

  return NextResponse.json({
    open: operating?.openingTime ? fmt(operating.openingTime) : null,
    close: operating?.closingTime ? fmt(operating.closingTime) : null,
    earlyEntry: earlyEntry?.openingTime ? fmt(earlyEntry.openingTime) : null,
  });
}
