import { NextRequest, NextResponse } from "next/server";
import { getCuratedImage } from "@/lib/attraction-images";

// Strip marketing suffixes that don't appear in Wikipedia titles
function cleanName(name: string): string {
  return name
    .replace(/\s+inspired by\b.*/i, "")
    .replace(/\s+presented by\b.*/i, "")
    .replace(/\s+featuring\b.*/i, "")
    .replace(/\s+sponsored by\b.*/i, "")
    .replace(/\s+–.*/, "")
    .replace(/\s+-\s+.*/, "")
    .replace(/\s*\(.*?\)\s*$/, "")   // trailing parenthetical
    .trim();
}

async function getThumbnail(title: string): Promise<string | null> {
  const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&pithumbsize=400&titles=${encodeURIComponent(title)}&redirects=1`;
  const res  = await fetch(url, { next: { revalidate: 86400 } });
  const data = await res.json();
  const page = Object.values(data?.query?.pages ?? {}) as Record<string, unknown>[];
  const p    = page[0] as { thumbnail?: { source: string }; pageid?: number } | undefined;
  if (p?.thumbnail?.source && p.pageid !== -1) return p.thumbnail.source;
  return null;
}

async function searchAndGetThumbnail(query: string): Promise<string | null> {
  // Step 1: search Wikipedia for best matching article titles
  const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${encodeURIComponent(query)}&srlimit=4`;
  const searchRes  = await fetch(searchUrl, { next: { revalidate: 86400 } });
  const searchData = await searchRes.json();
  const results: { title: string }[] = searchData?.query?.search ?? [];

  // Step 2: try each result until we find one with a thumbnail
  for (const result of results) {
    const thumb = await getThumbnail(result.title);
    if (thumb) return thumb;
  }
  return null;
}

export async function GET(req: NextRequest) {
  const rawName = req.nextUrl.searchParams.get("name") ?? "";
  const park    = req.nextUrl.searchParams.get("park") ?? "";
  if (!rawName) return NextResponse.json({ url: null });

  const name = cleanName(rawName);

  // Check curated list first (instant, no network)
  const curated = getCuratedImage(rawName);
  if (curated) return NextResponse.json({ url: curated }, { headers: { "Cache-Control": "public, max-age=86400" } });

  // Try progressively broader queries
  const queries = [
    `${name} ${park}`,
    name,
    `${name} Disney`,
    `${name} Universal`,
    `${name} theme park`,
  ];

  for (const query of queries) {
    try {
      const url = await searchAndGetThumbnail(query);
      if (url) {
        return NextResponse.json({ url }, {
          headers: { "Cache-Control": "public, max-age=86400" },
        });
      }
    } catch {
      continue;
    }
  }

  return NextResponse.json({ url: null });
}
