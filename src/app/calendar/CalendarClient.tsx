"use client";

import { useState, useMemo } from "react";
import { PARKS, LA_PARKS, ORLANDO_PARKS } from "@/lib/parks";
import { predictCrowd, CrowdPrediction } from "@/lib/predictions";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function DayCell({
  date,
  prediction,
  isToday,
  isPast,
  isSelected,
  onClick,
}: {
  date: Date;
  prediction: CrowdPrediction;
  isToday: boolean;
  isPast: boolean;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={isPast}
      className={cn(
        "relative flex flex-col items-center justify-start w-full aspect-square sm:aspect-auto sm:h-16 rounded-lg p-1 text-xs font-medium transition-all border-2",
        isPast
          ? "opacity-30 cursor-not-allowed bg-gray-50 border-transparent"
          : isSelected
          ? `${prediction.bg} border-current ${prediction.color} ring-2 ring-offset-1 ring-current`
          : `${prediction.bg} border-transparent hover:border-current ${prediction.color} hover:shadow-sm`
      )}
    >
      <span className={cn("text-sm font-bold", isToday && "underline underline-offset-2")}>
        {date.getDate()}
      </span>
      <span className="hidden sm:block text-[10px] mt-0.5 leading-tight opacity-80">
        {prediction.label}
      </span>
      <span className="sm:hidden text-[10px] font-bold mt-auto">{prediction.score}</span>
      {isToday && (
        <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-blue-500" />
      )}
    </button>
  );
}

export default function CalendarClient() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maxDate = new Date(today);
  maxDate.setFullYear(maxDate.getFullYear() + 1);

  const [selectedPark, setSelectedPark] = useState(PARKS[0].slug);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth()); // 0-indexed
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const park = PARKS.find((p) => p.slug === selectedPark)!;

  // Build calendar grid for current view month
  const calendarDays = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1);
    const lastDay = new Date(viewYear, viewMonth + 1, 0);
    const startOffset = firstDay.getDay(); // 0=Sun

    const days: (Date | null)[] = Array(startOffset).fill(null);
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(new Date(viewYear, viewMonth, d));
    }
    // Pad end to fill last row
    while (days.length % 7 !== 0) days.push(null);
    return days;
  }, [viewYear, viewMonth]);

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }

  function nextMonth() {
    const next = new Date(viewYear, viewMonth + 1, 1);
    if (next <= maxDate) {
      if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
      else setViewMonth(m => m + 1);
    }
  }

  const isPrevDisabled = viewYear === today.getFullYear() && viewMonth === today.getMonth();
  const isNextDisabled = (() => {
    const next = new Date(viewYear, viewMonth + 1, 1);
    return next > maxDate;
  })();

  const selectedPrediction = selectedDate ? predictCrowd(selectedDate, selectedPark) : null;

  // Monthly summary: avg score
  const monthlySummary = useMemo(() => {
    const scores: number[] = [];
    const days = new Date(viewYear, viewMonth + 1, 0).getDate();
    for (let d = 1; d <= days; d++) {
      const date = new Date(viewYear, viewMonth, d);
      if (date >= today) scores.push(predictCrowd(date, selectedPark).score);
    }
    if (!scores.length) return null;
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    const best = Math.min(...scores);
    return { avg: avg.toFixed(1), best };
  }, [viewYear, viewMonth, selectedPark]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Crowd Calendar</h1>
        <p className="text-gray-500 text-sm mt-1">
          Predicted crowd levels up to 12 months ahead · Based on historical patterns, holidays &amp; events
        </p>
      </div>

      {/* Park selector */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">California</p>
        <div className="flex flex-wrap gap-2">
          {LA_PARKS.map((p) => (
            <button
              key={p.slug}
              onClick={() => { setSelectedPark(p.slug); setSelectedDate(null); }}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors",
                selectedPark === p.slug
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-200 hover:border-blue-300"
              )}
            >
              {p.logo} {p.shortName}
            </button>
          ))}
        </div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider pt-1">Florida</p>
        <div className="flex flex-wrap gap-2">
          {ORLANDO_PARKS.map((p) => (
            <button
              key={p.slug}
              onClick={() => { setSelectedPark(p.slug); setSelectedDate(null); }}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors",
                selectedPark === p.slug
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-200 hover:border-blue-300"
              )}
            >
              {p.logo} {p.shortName}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar */}
      <Card>
        <CardContent className="p-4 space-y-4">
          {/* Month nav */}
          <div className="flex items-center justify-between">
            <button
              onClick={prevMonth}
              disabled={isPrevDisabled}
              className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="text-center">
              <h2 className="text-lg font-bold text-gray-900">
                {MONTHS[viewMonth]} {viewYear}
              </h2>
              {monthlySummary && (
                <p className="text-xs text-gray-500">
                  avg score {monthlySummary.avg} · best day scores {monthlySummary.best}/10
                </p>
              )}
            </div>
            <button
              onClick={nextMonth}
              disabled={isNextDisabled}
              className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1">
            {DOW.map((d) => (
              <div key={d} className="text-center text-xs font-semibold text-gray-400 py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((date, i) => {
              if (!date) return <div key={`empty-${i}`} />;
              const prediction = predictCrowd(date, selectedPark);
              const isPast = date < today;
              const isToday = date.getTime() === today.getTime();
              const isSelected = selectedDate?.getTime() === date.getTime();
              return (
                <DayCell
                  key={date.toISOString()}
                  date={date}
                  prediction={prediction}
                  isToday={isToday}
                  isPast={isPast}
                  isSelected={isSelected}
                  onClick={() => setSelectedDate(isSelected ? null : date)}
                />
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Selected day detail */}
      {selectedDate && selectedPrediction && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black flex-shrink-0", selectedPrediction.bg, selectedPrediction.color)}>
                {selectedPrediction.score}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-gray-900">
                    {selectedDate.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                  </h3>
                  <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", selectedPrediction.bg, selectedPrediction.color)}>
                    {selectedPrediction.label} crowds
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{park.logo} {park.name}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {selectedPrediction.reasons.map((r) => (
                    <span key={r} className="text-xs bg-gray-100 text-gray-600 rounded-full px-2.5 py-1">
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs">
        {[
          { bg: "bg-emerald-100", color: "text-emerald-700", label: "Very Low (1–2) · Walk onto most rides" },
          { bg: "bg-green-100",   color: "text-green-700",   label: "Low (3–4) · Short waits" },
          { bg: "bg-yellow-100",  color: "text-yellow-700",  label: "Moderate (5–6) · Plan ahead" },
          { bg: "bg-orange-100",  color: "text-orange-700",  label: "High (7–8) · Lightning Lane recommended" },
          { bg: "bg-red-100",     color: "text-red-700",     label: "Very High (9–10) · Maximum crowds" },
        ].map(({ bg, color, label }) => (
          <span key={label} className={cn("flex items-center gap-1.5 px-2 py-1 rounded-full font-medium", bg, color)}>
            {label}
          </span>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="flex gap-2 text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2">
        <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
        <p>Predictions are based on historical crowd patterns, US school calendars, and known park events. Actual crowds may vary due to weather, new attraction openings, or unannounced events.</p>
      </div>
    </div>
  );
}
