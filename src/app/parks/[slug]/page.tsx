import { notFound } from "next/navigation";
import { PARK_BY_SLUG } from "@/lib/parks";
import ParkDetailClient from "./ParkDetailClient";

export async function generateStaticParams() {
  const { PARKS } = await import("@/lib/parks");
  return PARKS.map((p) => ({ slug: p.slug }));
}

export default async function ParkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const park = PARK_BY_SLUG[slug];
  if (!park) notFound();

  return <ParkDetailClient park={park} />;
}
