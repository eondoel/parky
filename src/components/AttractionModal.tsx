"use client";

import { useEffect, useState } from "react";
import { X, Clock, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import AttractionImage from "@/components/AttractionImage";
import WaitBadge from "@/components/WaitBadge";

interface HourData {
  hour: number;
  avgWait: number | null;
  status: string;
}

interface AttractionModalProps {
  attraction: {
    id: string;
    name: string;
    status: string;
    waitMinutes: number | null;
    singleRider: number | null;
  };
  parkSlug: string;
  parkName: string;
  parkImage: string;
  parkTimezone: string;
  onClose: () => void;
}

function formatHour(h: number) {
  if (h === 0)  return "12am";
  if (h < 12)   return `${h}am`;
  if (h === 12) return "12pm";
  return `${h - 12}pm`;
}

function barColor(wait: number | null) {
  if (wait === null) return "#d1d5db";
  if (wait <= 15)   return "#10b981";
  if (wait <= 30)   return "#f59e0b";
  if (wait <= 60)   return "#f97316";
  return "#ef4444";
}

export default function AttractionModal({
  attraction, parkSlug, parkName, parkImage, parkTimezone, onClose,
}: AttractionModalProps) {
  const [hours, setHours]       = useState<HourData[]>([]);
  const [loading, setLoading]   = useState(true);
  const [date, setDate]         = useState("");

  useEffect(() => {
    const today = new Date().toLocaleDateString("en-CA", { timeZone: parkTimezone });
    setDate(today);
    fetch(`/api/attraction-history/${parkSlug}?attractionId=${attraction.id}&date=${today}`)
      .then(r => r.json())
      .then(d => { setHours(d.hours ?? []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [attraction.id, parkSlug, parkTimezone]);

  const maxWait = Math.max(...hours.map(h => h.avgWait ?? 0), 10);
  const hasData = hours.length > 0;
  const dateLabel = date ? new Date(date + "T12:00:00").toLocaleDateString(undefined, {
    weekday: "long", month: "long", day: "numeric",
  }) : "";

  // Close on backdrop click
  function onBackdrop(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4"
      onClick={onBackdrop}
    >
      <div className="w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[90dvh] flex flex-col">
        {/* Header image strip */}
        <div className="relative h-32 w-full flex-shrink-0">
          <AttractionImage
            attractionName={attraction.name}
            parkName={parkName}
            parkImage={parkImage}
            className="absolute inset-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-3 left-4 right-12">
            <p className="text-white font-bold text-base leading-tight drop-shadow">{attraction.name}</p>
            <p className="text-white/70 text-xs mt-0.5">{parkName}</p>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 p-4 space-y-4">
          {/* Current status row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Current wait</span>
            </div>
            <WaitBadge waitMinutes={attraction.waitMinutes} status={attraction.status} />
          </div>

          {attraction.singleRider !== null && (
            <p className="text-xs text-gray-500">Single rider: {attraction.singleRider} min</p>
          )}

          {/* Chart section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-gray-400" />
              <p className="text-sm font-semibold text-gray-700">Wait times today</p>
              {dateLabel && <p className="text-xs text-gray-400 ml-auto">{dateLabel}</p>}
            </div>

            {loading ? (
              <div className="h-40 rounded-xl bg-gray-100 animate-pulse" />
            ) : !hasData ? (
              <div className="h-40 rounded-xl bg-gray-50 flex flex-col items-center justify-center gap-2 text-gray-400">
                <Clock className="w-6 h-6 opacity-40" />
                <p className="text-sm">No data collected yet for today</p>
                <p className="text-xs opacity-70">Data is captured every 30 minutes once the cron is running</p>
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={hours} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                    <XAxis
                      dataKey="hour"
                      tickFormatter={formatHour}
                      tick={{ fontSize: 10, fill: "#9ca3af" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[0, maxWait + 5]}
                      tick={{ fontSize: 10, fill: "#9ca3af" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      formatter={(val) => [`${val} min`, "Avg wait"]}
                      labelFormatter={(h) => formatHour(Number(h))}
                      contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }}
                    />
                    <Bar dataKey="avgWait" radius={[4, 4, 0, 0]} maxBarSize={32}>
                      {hours.map((h, i) => (
                        <Cell key={i} fill={barColor(h.avgWait)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>

                {/* Color legend */}
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[10px] text-gray-500">
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" /> ≤15 min</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-amber-400 inline-block" /> 16–30 min</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-orange-500 inline-block" /> 31–60 min</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-red-500 inline-block" /> &gt;60 min</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
