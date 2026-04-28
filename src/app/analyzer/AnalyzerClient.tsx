"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { PARKS } from "@/lib/parks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { crowdLevel } from "@/lib/utils";
import { Info } from "lucide-react";

type ChartType = "by-day" | "by-hour" | "by-month";

interface DataPoint {
  label: string;
  avgWait: number;
  count: number;
}

const CHART_TABS: { value: ChartType; label: string }[] = [
  { value: "by-day", label: "Day of Week" },
  { value: "by-hour", label: "Time of Day" },
  { value: "by-month", label: "Month" },
];

function barColor(avgWait: number): string {
  const { label } = crowdLevel(avgWait);
  if (label === "Low") return "#22c55e";
  if (label === "Moderate") return "#eab308";
  if (label === "High") return "#f97316";
  return "#ef4444";
}

function BestDayBadge({ data }: { data: DataPoint[] }) {
  if (data.length === 0) return null;
  const best = [...data].sort((a, b) => a.avgWait - b.avgWait)[0];
  const worst = [...data].sort((a, b) => b.avgWait - a.avgWait)[0];
  return (
    <div className="flex flex-wrap gap-3 mt-2">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 text-green-700 text-xs font-semibold px-3 py-1">
        ✓ Best: {best.label} ({best.avgWait} min avg)
      </span>
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 text-red-700 text-xs font-semibold px-3 py-1">
        ✗ Busiest: {worst.label} ({worst.avgWait} min avg)
      </span>
    </div>
  );
}

export default function AnalyzerClient() {
  const [selectedPark, setSelectedPark] = useState(PARKS[0].slug);
  const [chartType, setChartType] = useState<ChartType>("by-day");
  const [data, setData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setData([]);
    setMessage(null);
    fetch(`/api/history/${selectedPark}?type=${chartType}`)
      .then((r) => r.json())
      .then((res) => {
        setData(res.data ?? []);
        setMessage(res.message ?? null);
      })
      .finally(() => setLoading(false));
  }, [selectedPark, chartType]);

  const park = PARKS.find((p) => p.slug === selectedPark)!;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Wait Time Analyzer</h1>
        <p className="text-gray-500 text-sm mt-1">
          Historical crowd patterns to find the best time to visit.
        </p>
      </div>

      {/* Park selector */}
      <div className="flex flex-wrap gap-2">
        {PARKS.map((p) => (
          <button
            key={p.slug}
            onClick={() => setSelectedPark(p.slug)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              selectedPark === p.slug
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:text-blue-700"
            }`}
          >
            <span>{p.logo}</span>
            {p.shortName}
          </button>
        ))}
      </div>

      {/* Chart type tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {CHART_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setChartType(tab.value)}
            className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
              chartType === tab.value
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <span className="text-xl">{park.logo}</span>
            <CardTitle>
              {park.shortName} — Average Wait by{" "}
              {chartType === "by-day" ? "Day of Week" : chartType === "by-hour" ? "Hour" : "Month"}
            </CardTitle>
          </div>
          {data.length > 0 && <BestDayBadge data={data} />}
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : message || data.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center gap-3 text-center">
              <Info className="w-8 h-8 text-gray-300" />
              <p className="text-gray-500 text-sm max-w-xs">
                {message ?? "No historical data yet."}
              </p>
              <p className="text-gray-400 text-xs">
                Data accumulates as the app collects snapshots every 30 minutes. Check back after a few days!
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} unit=" min" />
                <Tooltip
                  formatter={(value) => [`${value} min avg`, "Wait Time"]}
                  labelStyle={{ fontWeight: 600 }}
                />
                <Bar dataKey="avgWait" radius={[4, 4, 0, 0]}>
                  {data.map((entry, i) => (
                    <Cell key={i} fill={barColor(entry.avgWait)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-gray-600">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-green-500 inline-block" /> Low (≤20 min)</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-yellow-400 inline-block" /> Moderate (21–35 min)</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-orange-400 inline-block" /> High (36–55 min)</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-red-500 inline-block" /> Very High (&gt;55 min)</span>
      </div>
    </div>
  );
}
