import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { PARKS } from "@/lib/parks";
import { getLiveDataNoCache } from "@/lib/themeparks";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results: { park: string; collected: number; errors: number }[] = [];

  for (const parkDef of PARKS) {
    let park = await prisma.park.findFirst({
      where: { OR: [{ themeParksId: parkDef.themeParksId }, { slug: parkDef.slug }] },
    });
    if (!park) {
      park = await prisma.park.create({
        data: { name: parkDef.name, slug: parkDef.slug, location: parkDef.location, themeParksId: parkDef.themeParksId, timezone: parkDef.timezone },
      });
    }

    try {
      const live = await getLiveDataNoCache(parkDef.themeParksId);
      const attractions = live.liveData.filter(
        (e) => e.entityType === "ATTRACTION" || e.entityType === "RIDE"
      );

      let collected = 0;
      let errors = 0;

      for (const entity of attractions) {
        try {
          let attraction = await prisma.attraction.findUnique({ where: { themeParksId: entity.id } });
          if (!attraction) {
            attraction = await prisma.attraction.create({
              data: { parkId: park.id, name: entity.name, themeParksId: entity.id, attractionType: entity.entityType },
            });
          }

          const waitMinutes = entity.queue?.STANDBY?.waitTime ?? null;
          const status = entity.status ?? "UNKNOWN";

          await prisma.waitSnapshot.create({
            data: {
              attractionId: attraction.id,
              waitMinutes,
              status,
            },
          });
          collected++;
        } catch {
          errors++;
        }
      }

      results.push({ park: parkDef.slug, collected, errors });
    } catch (err) {
      results.push({ park: parkDef.slug, collected: 0, errors: 1 });
      console.error(`Error collecting ${parkDef.slug}:`, err);
    }
  }

  return NextResponse.json({ ok: true, results, timestamp: new Date().toISOString() });
}

// Allow GET for manual testing in dev
export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }
  return POST(req);
}
