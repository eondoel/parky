import { NextRequest, NextResponse } from "next/server";
import ICAL from "ical.js";

export interface ICSEvent {
  uid: string;
  title: string;
  start: string; // YYYY-MM-DD
  end: string;   // YYYY-MM-DD (exclusive)
  description?: string;
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) return NextResponse.json({ error: "Missing url param" }, { status: 400 });

  // Only allow http/https
  if (!/^https?:\/\//i.test(url)) {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  let text: string;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Parky/1.0 (calendar reader)" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    text = await res.text();
  } catch (err) {
    return NextResponse.json({ error: `Failed to fetch calendar: ${err}` }, { status: 502 });
  }

  const events: ICSEvent[] = [];
  try {
    const parsed   = ICAL.parse(text);
    const comp     = new ICAL.Component(parsed);
    const vevents  = comp.getAllSubcomponents("vevent");

    for (const vevent of vevents) {
      const ev = new ICAL.Event(vevent);
      const dtstart = ev.startDate;
      const dtend   = ev.endDate ?? ev.startDate;

      // Normalise to date-only strings
      const toYMD = (t: ICAL.Time) => {
        const d = t.toJSDate();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      };

      events.push({
        uid: ev.uid ?? Math.random().toString(36),
        title: ev.summary ?? "Event",
        start: toYMD(dtstart),
        end:   toYMD(dtend),
        description: ev.description ?? undefined,
      });
    }
  } catch {
    return NextResponse.json({ error: "Failed to parse ICS data" }, { status: 422 });
  }

  return NextResponse.json({ events }, { headers: { "Cache-Control": "public, max-age=3600" } });
}
