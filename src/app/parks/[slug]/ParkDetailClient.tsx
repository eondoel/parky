"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { ParkDef } from "@/lib/parks";
import WaitBadge from "@/components/WaitBadge";
import AttractionImage from "@/components/AttractionImage";
import { Card, CardContent } from "@/components/ui/card";
import { crowdLevel } from "@/lib/utils";
import { ArrowLeft, RefreshCw, Search } from "lucide-react";

interface Attraction {
  id: string;
  name: string;
  status: string;
  waitMinutes: number | null;
  singleRider: number | null;
}

type Filter = "all" | "open" | "short" | "long";

export default function ParkDetailClient({ park }: { park: ParkDef }) {
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  async function fetchData() {
    setLoading(true);
    try {
      const res = await fetch(`/api/live/${park.slug}`);
      if (!res.ok) return;
      const data = await res.json();
      setAttractions(data.attractions);
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, 60000);
    return () => clearInterval(id);
  }, [park.slug]);

  const operating = attractions.filter(
    (a) => a.status === "OPERATING" && a.waitMinutes !== null
  );
  const avgWait =
    operating.length > 0
      ? Math.round(operating.reduce((s, a) => s + (a.waitMinutes ?? 0), 0) / operating.length)
      : null;
  const crowd = avgWait !== null ? crowdLevel(avgWait) : null;

  const filtered = useMemo(() => {
    let list = attractions;
    if (search) {
      list = list.filter((a) => a.name.toLowerCase().includes(search.toLowerCase()));
    }
    if (filter === "open") list = list.filter((a) => a.status === "OPERATING");
    if (filter === "short") list = list.filter((a) => (a.waitMinutes ?? 999) <= 20);
    if (filter === "long") list = list.filter((a) => (a.waitMinutes ?? 0) > 60);
    return list;
  }, [attractions, search, filter]);

  const FILTER_OPTS: { value: Filter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "open", label: "Open" },
    { value: "short", label: "≤20 min" },
    { value: "long", label: ">60 min" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/" className="text-gray-400 hover:text-gray-600 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-3xl">{park.logo}</span>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{park.name}</h1>
            <p className="text-sm text-gray-500">{park.location}</p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-3">
          {crowd && (
            <span className={`text-sm font-semibold ${crowd.color}`}>
              {crowd.label} crowds
            </span>
          )}
          {avgWait !== null && (
            <span className="text-sm text-gray-500">avg {avgWait} min</span>
          )}
          <button
            onClick={fetchData}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="py-3 text-center">
            <p className="text-2xl font-bold text-gray-900">{attractions.length}</p>
            <p className="text-xs text-gray-500 mt-0.5">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-3 text-center">
            <p className="text-2xl font-bold text-green-600">{operating.length}</p>
            <p className="text-xs text-gray-500 mt-0.5">Open</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-3 text-center">
            <p className="text-2xl font-bold text-gray-900">{avgWait ?? "—"}</p>
            <p className="text-xs text-gray-500 mt-0.5">Avg wait</p>
          </CardContent>
        </Card>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search attractions…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
        <div className="flex gap-2">
          {FILTER_OPTS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === opt.value
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Attraction list */}
      {loading && attractions.length === 0 ? (
        <div className="space-y-2">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-14 rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-gray-500 py-12">No attractions match your filters.</p>
      ) : (
        <div className="space-y-2">
          {filtered.map((a) => (
            <div
              key={a.id}
              className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 overflow-hidden"
            >
              {/* Photo thumbnail */}
              <div className="relative w-16 h-16 flex-shrink-0">
                <AttractionImage
                  attractionName={a.name}
                  parkName={park.name}
                  className="absolute inset-0 rounded-l-xl overflow-hidden"
                />
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0 py-2">
                <p className="text-sm font-medium text-gray-900 truncate">{a.name}</p>
                {a.singleRider !== null && (
                  <p className="text-xs text-gray-500 mt-0.5">Single rider: {a.singleRider} min</p>
                )}
              </div>
              <div className="pr-4 flex-shrink-0">
                <WaitBadge waitMinutes={a.waitMinutes} status={a.status} />
              </div>
            </div>
          ))}
        </div>
      )}

      {lastUpdated && (
        <p className="text-center text-xs text-gray-400">
          Last updated at {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", timeZone: park.timezone })} local park time
        </p>
      )}
    </div>
  );
}
