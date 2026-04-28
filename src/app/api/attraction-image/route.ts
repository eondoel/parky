import { NextRequest, NextResponse } from "next/server";

// Search Wikipedia for an attraction thumbnail.
// Tries progressively simpler queries until an image is found.
export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get("name") ?? "";
  const park = req.nextUrl.searchParams.get("park") ?? "";
  if (!name) return NextResponse.json({ url: null });

  const queries = [
    `${name} (${park})`,
    name,
    `${name} Disney`,
    `${name} Universal`,
  ];

  for (const query of queries) {
    const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&pithumbsize=400&titles=${encodeURIComponent(query)}&redirects=1`;
    try {
      const res  = await fetch(url, { next: { revalidate: 86400 } });
      const data = await res.json();
      const pages = Object.values(data?.query?.pages ?? {}) as Record<string, unknown>[];
      const page  = pages[0] as { thumbnail?: { source: string }; pageid?: number } | undefined;
      if (page?.thumbnail?.source && page.pageid !== -1) {
        return NextResponse.json({ url: page.thumbnail.source }, {
          headers: { "Cache-Control": "public, max-age=86400" },
        });
      }
    } catch {
      continue;
    }
  }

  return NextResponse.json({ url: null });
}
