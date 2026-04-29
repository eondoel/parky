"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import WaitBadge from "@/components/WaitBadge";
import { crowdLevel } from "@/lib/utils";
import { ParkDef } from "@/lib/parks";
import { Clock, ChevronRight, RefreshCw } from "lucide-react";

interface Attraction {
  id: string;
  name: string;
  status: string;
  waitMinutes: number | null;
}

interface Hours {
  open: string | null;
  close: string | null;
  earlyEntry: string | null;
}

interface ParkCardProps {
  park: ParkDef;
  refreshInterval?: number;
}

export default function ParkCard({ park, refreshInterval = 60000 }: ParkCardProps) {
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [hours, setHours] = useState<Hours | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  async function fetchData() {
    try {
      const res = await fetch(`/api/live/${park.slug}`);
      if (!res.ok) return;
      const data = await res.json();
      setAttractions(data.attractions);
      setLastUpdated(new Date());
    } catch {
      // silently ignore
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, refreshInterval);
    return () => clearInterval(id);
  }, [park.slug]);

  useEffect(() => {
    fetch(`/api/schedule/${park.slug}`)
      .then((r) => r.json())
      .then(setHours)
      .catch(() => null);
  }, [park.slug]);

  const operating = attractions.filter(
    (a) => a.status === "OPERATING" && a.waitMinutes !== null
  );
  const avgWait =
    operating.length > 0
      ? Math.round(operating.reduce((s, a) => s + (a.waitMinutes ?? 0), 0) / operating.length)
      : null;
  const crowd = avgWait !== null ? crowdLevel(avgWait) : null;

  const top5 = [
    ...attractions.filter((a) => a.status === "OPERATING"),
    ...attractions.filter((a) => a.status !== "OPERATING"),
  ].slice(0, 5);

  const parkTime = lastUpdated
    ? lastUpdated.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: park.timezone,
      })
    : null;

  return (
    <Link href={`/parks/${park.slug}`} className="group block rounded-2xl overflow-hidden shadow-sm border border-gray-200 bg-white hover:shadow-md transition-shadow">
      {/* Hero image */}
      <div className="relative h-40 w-full overflow-hidden">
        <Image
          src={park.image}
          alt={park.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Park name on photo */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <p className="text-white font-bold text-base leading-tight drop-shadow">{park.shortName}</p>
          <p className="text-white/70 text-xs mt-0.5">{park.location}</p>
        </div>

        {/* Crowd badge top-right */}
        {crowd && (
          <div className={`absolute top-2 right-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm ${crowd.color}`}>
            {crowd.label}
          </div>
        )}
        {loading && (
          <div className="absolute top-2 left-2">
            <RefreshCw className="w-3.5 h-3.5 text-white/70 animate-spin" />
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-3 space-y-2">
        {/* Hours row */}
        {hours?.open && hours?.close ? (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock className="w-3 h-3 flex-shrink-0" />
            <span>{hours.open} – {hours.close}</span>
            {hours.earlyEntry && (
              <span className="ml-auto rounded-full bg-blue-50 text-blue-600 px-2 py-0.5 font-medium whitespace-nowrap">
                Early Entry {hours.earlyEntry}
              </span>
            )}
          </div>
        ) : (
          <div className="h-4" />
        )}

        {/* Top attractions */}
        {loading ? (
          <div className="space-y-1.5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-7 rounded-lg bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : top5.length === 0 ? (
          <p className="text-xs text-gray-400 py-3 text-center">No live data</p>
        ) : (
          <ul className="divide-y divide-gray-50">
            {top5.map((a) => (
              <li key={a.id} className="flex items-center justify-between py-1.5 gap-2">
                <span className="text-xs text-gray-700 truncate">{a.name}</span>
                <WaitBadge waitMinutes={a.waitMinutes} status={a.status} size="sm" />
              </li>
            ))}
          </ul>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-1 border-t border-gray-50">
          {parkTime ? (
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Clock className="w-3 h-3" />
              {parkTime} local
            </span>
          ) : <span />}
          <span className="flex items-center gap-0.5 text-xs text-blue-600 font-medium">
            View all
            <ChevronRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}
