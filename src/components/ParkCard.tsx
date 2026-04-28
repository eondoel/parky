"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
    <Card className="flex flex-col h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{park.logo}</span>
            <div>
              <CardTitle>{park.shortName}</CardTitle>
              <p className="text-xs text-gray-500 mt-0.5">{park.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {crowd && (
              <span className={`text-xs font-semibold ${crowd.color}`}>{crowd.label}</span>
            )}
            {loading && <RefreshCw className="w-3 h-3 text-gray-400 animate-spin" />}
          </div>
        </div>

        {/* Operating hours */}
        {hours?.open && hours?.close && (
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {hours.open} – {hours.close}
            </span>
            {hours.earlyEntry && (
              <span className="rounded-full bg-blue-50 text-blue-600 px-2 py-0.5 font-medium">
                Early Entry {hours.earlyEntry}
              </span>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-3">
        {loading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-8 rounded-lg bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : top5.length === 0 ? (
          <p className="text-sm text-gray-500 py-4 text-center">No live data available</p>
        ) : (
          <ul className="divide-y divide-gray-50">
            {top5.map((a) => (
              <li key={a.id} className="flex items-center justify-between py-2 gap-3">
                <span className="text-sm text-gray-800 truncate">{a.name}</span>
                <WaitBadge waitMinutes={a.waitMinutes} status={a.status} size="sm" />
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto pt-2 flex items-center justify-between">
          {parkTime && (
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Clock className="w-3 h-3" />
              {parkTime} local
            </span>
          )}
          <Link
            href={`/parks/${park.slug}`}
            className="ml-auto flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            View all
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
