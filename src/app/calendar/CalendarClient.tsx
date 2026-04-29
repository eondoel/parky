"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { PARKS, LA_PARKS, ORLANDO_PARKS } from "@/lib/parks";
import { predictCrowd, getHolidaysForDate, scoreToLevel, CrowdPrediction } from "@/lib/predictions";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Info, Plus, Trash2, RefreshCw, CalendarDays, FlaskConical, CalendarCheck } from "lucide-react";
import ParkIcon from "@/components/ParkIcon";
import CrowdIcon from "@/components/CrowdIcon";
import { Card, CardContent } from "@/components/ui/card";

const DOW    = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

// ── Types ─────────────────────────────────────────────────────────────────────

interface ActualDay {
  score: number; level: string; label: string; avgWait: number; snapshots: number;
}

interface ICSEvent {
  uid: string; title: string; start: string; end: string; description?: string;
}

interface CalFeed {
  url: string; name: string; color: string; events: ICSEvent[]; loading: boolean; error?: string;
}

const FEED_COLORS = ["#6366f1","#0ea5e9","#10b981","#f59e0b","#ef4444","#8b5cf6","#ec4899"];

// ── Day cell ─────────────────────────────────────────────────────────────────

function DayCell({
  date, prediction, actual, holidays, feedEvents, isPast, isToday, isSelected, onClick,
}: {
  date: Date;
  prediction: CrowdPrediction;
  actual?: ActualDay;
  holidays: string[];
  feedEvents: ICSEvent[];
  isPast: boolean;
  isToday: boolean;
  isSelected: boolean;
  onClick: () => void;
}) {
  const display = actual ? { ...scoreToLevel(actual.score), score: actual.score } : prediction;
  // Past days without data are shown in grayscale/dimmed
  const isDimmed = isPast && !actual;

  return (
    <button
      onClick={isDimmed ? undefined : onClick}
      className={cn(
        "relative flex flex-col items-center w-full min-h-[5rem] rounded-xl p-1.5 transition-all border-2 text-center gap-0.5",
        isDimmed
          ? "bg-gray-50 border-transparent opacity-35 cursor-default"
          : isSelected
          ? `${display.bg} ${display.color} border-current ring-2 ring-offset-1 ring-current shadow-md`
          : `${display.bg} ${display.color} border-transparent hover:border-current hover:shadow-sm cursor-pointer`,
        // Actual data cells get a subtle glow to stand out
        actual && !isDimmed && "shadow-sm ring-1 ring-current ring-opacity-30"
      )}
    >
      {/* Date number */}
      <span className={cn(
        "text-xs font-bold leading-none w-full text-left",
        isToday && "underline underline-offset-2"
      )}>
        {date.getDate()}
      </span>

      {/* Big crowd icon */}
      <span className="leading-none my-0.5" title={display.label}>
        <CrowdIcon level={display.level} size={22} />
      </span>

      {/* First holiday label */}
      {holidays[0] && (
        <span className="w-full truncate text-[8px] opacity-75 leading-tight px-0.5">
          {holidays[0]}
        </span>
      )}

      {/* Feed event dots */}
      {feedEvents.length > 0 && (
        <div className="absolute bottom-1 right-1 flex gap-0.5">
          {feedEvents.slice(0, 3).map((ev) => (
            <span key={ev.uid} className="w-1.5 h-1.5 rounded-full bg-indigo-500 opacity-80" title={ev.title} />
          ))}
        </div>
      )}

      {/* Today indicator */}
      {isToday && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-500 border-2 border-white" />}

      {/* Real data badge */}
      {actual && (
        <span className="absolute top-1 left-1 text-[8px] font-bold opacity-60">●</span>
      )}
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function CalendarClient() {
  const today = useMemo(() => { const d = new Date(); d.setHours(0,0,0,0); return d; }, []);
  const maxDate = useMemo(() => { const d = new Date(today); d.setFullYear(d.getFullYear()+1); return d; }, [today]);
  const minDate = useMemo(() => { const d = new Date(today); d.setFullYear(d.getFullYear()-1); return d; }, [today]);

  const [selectedPark, setSelectedPark] = useState(PARKS[0].slug);
  const [viewYear,  setViewYear]  = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  function goToToday() {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    setSelectedDate(today);
  }
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [actualData, setActualData] = useState<Record<string, ActualDay>>({});
  const [loadingActual, setLoadingActual] = useState(false);
  const [feeds, setFeeds] = useState<CalFeed[]>([]);
  const [showFeedPanel, setShowFeedPanel] = useState(false);
  const [newFeedUrl, setNewFeedUrl] = useState("");
  const [newFeedName, setNewFeedName] = useState("");
  const [addingFeed, setAddingFeed] = useState(false);

  const park = PARKS.find((p) => p.slug === selectedPark)!;

  // ── Fetch actual DB data for current month ──────────────────────────────────
  const fetchActual = useCallback(async () => {
    setLoadingActual(true);
    try {
      const res = await fetch(`/api/calendar/${selectedPark}?year=${viewYear}&month=${viewMonth + 1}`);
      if (res.ok) setActualData((await res.json()).days ?? {});
    } finally {
      setLoadingActual(false);
    }
  }, [selectedPark, viewYear, viewMonth]);

  useEffect(() => { fetchActual(); }, [fetchActual]);

  // ── Persist feeds in localStorage ──────────────────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem("parky_feeds");
    if (saved) {
      const parsed: Omit<CalFeed,"loading">[] = JSON.parse(saved);
      setFeeds(parsed.map(f => ({ ...f, loading: false })));
    }
  }, []);

  function saveFeeds(updated: CalFeed[]) {
    setFeeds(updated);
    localStorage.setItem("parky_feeds", JSON.stringify(
      updated.map(({ loading: _l, ...rest }) => rest)
    ));
  }

  async function addFeed() {
    if (!newFeedUrl.trim()) return;
    setAddingFeed(true);
    const color = FEED_COLORS[feeds.length % FEED_COLORS.length];
    const name  = newFeedName.trim() || new URL(newFeedUrl).hostname;
    try {
      const res = await fetch(`/api/ics-proxy?url=${encodeURIComponent(newFeedUrl.trim())}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const feed: CalFeed = { url: newFeedUrl.trim(), name, color, events: data.events, loading: false };
      saveFeeds([...feeds, feed]);
      setNewFeedUrl(""); setNewFeedName("");
    } catch (e) {
      alert(`Failed to load calendar: ${e instanceof Error ? e.message : e}`);
    } finally {
      setAddingFeed(false);
    }
  }

  async function refreshFeed(i: number) {
    const feed = feeds[i];
    const updated = [...feeds];
    updated[i] = { ...feed, loading: true, error: undefined };
    setFeeds(updated);
    try {
      const res = await fetch(`/api/ics-proxy?url=${encodeURIComponent(feed.url)}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      updated[i] = { ...feed, events: data.events, loading: false };
    } catch (e) {
      updated[i] = { ...feed, loading: false, error: String(e) };
    }
    saveFeeds(updated);
  }

  function removeFeed(i: number) {
    saveFeeds(feeds.filter((_, j) => j !== i));
  }

  // ── Calendar grid ───────────────────────────────────────────────────────────
  const calendarDays = useMemo(() => {
    const first = new Date(viewYear, viewMonth, 1);
    const last  = new Date(viewYear, viewMonth + 1, 0);
    const days: (Date | null)[] = Array(first.getDay()).fill(null);
    for (let d = 1; d <= last.getDate(); d++) days.push(new Date(viewYear, viewMonth, d));
    while (days.length % 7 !== 0) days.push(null);
    return days;
  }, [viewYear, viewMonth]);

  // All ICS events for this month
  const allFeedEvents = useMemo(() => {
    const map: Record<string, ICSEvent[]> = {};
    for (const feed of feeds) {
      for (const ev of feed.events) {
        const start = new Date(ev.start + "T00:00:00");
        const end   = new Date(ev.end   + "T00:00:00");
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          const key = d.toISOString().split("T")[0];
          if (!map[key]) map[key] = [];
          map[key].push(ev);
        }
      }
    }
    return map;
  }, [feeds]);

  function prevMonth() {
    const prev = new Date(viewYear, viewMonth - 1, 1);
    if (prev >= minDate) { setViewMonth(viewMonth === 0 ? 11 : viewMonth - 1); if (viewMonth === 0) setViewYear(y => y - 1); }
  }
  function nextMonth() {
    const next = new Date(viewYear, viewMonth + 1, 1);
    if (next <= maxDate) { setViewMonth(viewMonth === 11 ? 0 : viewMonth + 1); if (viewMonth === 11) setViewYear(y => y + 1); }
  }

  const isPrevDisabled = new Date(viewYear, viewMonth - 1, 1) < minDate;
  const isNextDisabled = new Date(viewYear, viewMonth + 1, 1) > maxDate;
  const isPastMonth    = new Date(viewYear, viewMonth + 1, 0) < today;

  // Monthly stats
  const monthlyStats = useMemo(() => {
    const scores: number[] = [];
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(viewYear, viewMonth, d);
      const key  = date.toISOString().split("T")[0];
      const score = actualData[key]?.score ?? predictCrowd(date, selectedPark).score;
      scores.push(score);
    }
    return {
      avg:   (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1),
      best:  Math.min(...scores),
      worst: Math.max(...scores),
    };
  }, [viewYear, viewMonth, selectedPark, actualData]);

  // Selected day info
  const selectedKey = selectedDate?.toISOString().split("T")[0] ?? null;
  const selectedPrediction = selectedDate ? predictCrowd(selectedDate, selectedPark) : null;
  const selectedActual     = selectedKey  ? actualData[selectedKey] : undefined;
  const selectedHolidays   = selectedDate ? getHolidaysForDate(selectedDate, selectedPark) : [];
  const selectedFeedEvents = selectedKey  ? (allFeedEvents[selectedKey] ?? []) : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Crowd Calendar</h1>
          <p className="text-gray-500 text-sm mt-1">
            Predictions up to 12 months ahead · Past year shown with real data when available
          </p>
        </div>
        <button
          onClick={() => setShowFeedPanel(v => !v)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors flex-shrink-0"
        >
          <CalendarDays className="w-4 h-4" />
          Feeds {feeds.length > 0 && <span className="ml-0.5 text-xs bg-blue-100 text-blue-700 rounded-full px-1.5">{feeds.length}</span>}
        </button>
      </div>

      {/* ICS Feed panel */}
      {showFeedPanel && (
        <Card>
          <CardContent className="p-4 space-y-3">
            <h3 className="font-semibold text-sm text-gray-800">External Calendar Feeds (ICS)</h3>
            <p className="text-xs text-gray-500">
              Paste any public ICS calendar URL to overlay events on the calendar. Works with Google Calendar, Apple Calendar, or any park event feed.
            </p>

            {feeds.map((feed, i) => (
              <div key={feed.url} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: feed.color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{feed.name}</p>
                  <p className="text-xs text-gray-400 truncate">{feed.events.length} events · {feed.url}</p>
                  {feed.error && <p className="text-xs text-red-500">{feed.error}</p>}
                </div>
                <button onClick={() => refreshFeed(i)} className="p-1 text-gray-400 hover:text-gray-600">
                  <RefreshCw className={cn("w-3.5 h-3.5", feed.loading && "animate-spin")} />
                </button>
                <button onClick={() => removeFeed(i)} className="p-1 text-gray-400 hover:text-red-500">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Calendar name (optional)"
                value={newFeedName}
                onChange={e => setNewFeedName(e.target.value)}
                className="w-32 px-2.5 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="url"
                placeholder="Paste ICS URL…"
                value={newFeedUrl}
                onChange={e => setNewFeedUrl(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addFeed()}
                className="flex-1 px-2.5 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={addFeed}
                disabled={addingFeed || !newFeedUrl.trim()}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {addingFeed ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                Add
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Park selector */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">California</p>
        <div className="flex flex-wrap gap-2">
          {LA_PARKS.map(p => (
            <button key={p.slug} onClick={() => { setSelectedPark(p.slug); setSelectedDate(null); }}
              className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors",
                selectedPark === p.slug ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-200 hover:border-blue-300"
              )}>
              <ParkIcon name={p.icon} size={14} /> {p.shortName}
            </button>
          ))}
        </div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider pt-1">Florida</p>
        <div className="flex flex-wrap gap-2">
          {ORLANDO_PARKS.map(p => (
            <button key={p.slug} onClick={() => { setSelectedPark(p.slug); setSelectedDate(null); }}
              className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors",
                selectedPark === p.slug ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-200 hover:border-blue-300"
              )}>
              <ParkIcon name={p.icon} size={14} /> {p.shortName}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar card */}
      <Card>
        <CardContent className="p-4 space-y-3">
          {/* Month navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevMonth}
              disabled={isPrevDisabled}
              className="flex items-center justify-center w-11 h-11 rounded-xl bg-gray-800 text-white hover:bg-gray-700 active:bg-gray-900 disabled:opacity-25 disabled:cursor-not-allowed transition-colors flex-shrink-0 shadow-sm"
            >
              <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
            </button>

            <div className="flex-1 text-center">
              <h2 className="text-lg font-bold text-gray-900">
                {MONTHS[viewMonth]} {viewYear}
              </h2>
              <div className="flex items-center justify-center gap-3 mt-0.5 text-xs text-gray-500">
                <span>avg <strong>{monthlyStats.avg}</strong>/10</span>
                <span className="inline-flex items-center gap-1 text-green-600 font-semibold">best <CrowdIcon level="very-low" size={12} /> {monthlyStats.best}</span>
                <span className="inline-flex items-center gap-1 text-red-500 font-semibold">busiest <CrowdIcon level="very-high" size={12} /> {monthlyStats.worst}</span>
                {loadingActual && <RefreshCw className="w-3 h-3 animate-spin text-gray-400" />}
              </div>
            </div>

            <button
              onClick={nextMonth}
              disabled={isNextDisabled}
              className="flex items-center justify-center w-11 h-11 rounded-xl bg-gray-800 text-white hover:bg-gray-700 active:bg-gray-900 disabled:opacity-25 disabled:cursor-not-allowed transition-colors flex-shrink-0 shadow-sm"
            >
              <ChevronRight className="w-6 h-6" strokeWidth={2.5} />
            </button>
          </div>

          {/* Today button */}
          {(viewYear !== today.getFullYear() || viewMonth !== today.getMonth()) && (
            <div className="flex justify-center">
              <button
                onClick={goToToday}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
              >
                <CalendarCheck className="w-3.5 h-3.5" />
                Back to Today
              </button>
            </div>
          )}

          {/* Past month notice */}
          {isPastMonth && (
            <div className="flex items-center gap-1.5 text-xs text-blue-600 bg-blue-50 rounded-lg px-3 py-2">
              <FlaskConical className="w-3.5 h-3.5 flex-shrink-0" />
              {Object.keys(actualData).length > 0
                ? `Showing real collected data for ${Object.keys(actualData).length} days · dots indicate actual data`
                : "No collected data for this month yet — showing historical predictions"}
            </div>
          )}

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1">
            {DOW.map(d => (
              <div key={d} className="text-center text-xs font-semibold text-gray-400 py-1">{d}</div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((date, i) => {
              if (!date) return <div key={`e-${i}`} />;
              const key       = date.toISOString().split("T")[0];
              const prediction = predictCrowd(date, selectedPark);
              const actual     = actualData[key];
              const holidays   = getHolidaysForDate(date, selectedPark);
              const feedEvs    = allFeedEvents[key] ?? [];
              const isPast     = date < today;
              return (
                <DayCell
                  key={key}
                  date={date}
                  prediction={prediction}
                  actual={actual}
                  holidays={holidays}
                  feedEvents={feedEvs}
                  isPast={isPast}
                  isToday={date.getTime() === today.getTime()}
                  isSelected={selectedDate?.getTime() === date.getTime()}
                  onClick={() => setSelectedDate(prev => prev?.getTime() === date.getTime() ? null : date)}
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
            <div className="flex items-start gap-4">
              <div className={cn(
                "w-14 h-14 rounded-2xl flex flex-col items-center justify-center flex-shrink-0",
                selectedActual ? scoreToLevel(selectedActual.score).bg : selectedPrediction.bg
              )}>
                <span className={cn("text-2xl font-black", selectedActual ? scoreToLevel(selectedActual.score).color : selectedPrediction.color)}>
                  {selectedActual?.score ?? selectedPrediction.score}
                </span>
                <span className={cn("text-[9px] font-semibold opacity-70", selectedActual ? scoreToLevel(selectedActual.score).color : selectedPrediction.color)}>
                  {selectedActual ? "actual" : "pred."}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900">
                  {selectedDate.toLocaleDateString(undefined, { weekday:"long", month:"long", day:"numeric", year:"numeric" })}
                </h3>
                <p className="inline-flex items-center gap-1.5 text-sm text-gray-500 mt-0.5"><ParkIcon name={park.icon} size={14} /> {park.name}</p>

                {selectedActual && (
                  <p className="text-xs text-blue-600 mt-1">
                    Real data · avg {selectedActual.avgWait} min wait from {selectedActual.snapshots} snapshots
                    {selectedPrediction.score !== selectedActual.score && (
                      <span className="ml-1 text-gray-400">(predicted: {selectedPrediction.score})</span>
                    )}
                  </p>
                )}

                {/* Holidays & events */}
                {(selectedHolidays.length > 0 || selectedFeedEvents.length > 0) && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {selectedHolidays.map(h => (
                      <span key={h} className="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-2.5 py-0.5 font-medium">
                        <CalendarDays className="w-3 h-3" /> {h}
                      </span>
                    ))}
                    {selectedFeedEvents.map(ev => (
                      <span key={ev.uid} className="inline-flex items-center gap-1 text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full px-2.5 py-0.5 font-medium">
                        <CalendarDays className="w-3 h-3" /> {ev.title}
                      </span>
                    ))}
                  </div>
                )}

                {/* Prediction reasons */}
                <div className="mt-2 flex flex-wrap gap-1">
                  {selectedPrediction.reasons.map(r => (
                    <span key={r} className="text-xs bg-gray-100 text-gray-600 rounded-full px-2 py-0.5">{r}</span>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-2 text-xs">
        {([
          { bg:"bg-emerald-100", color:"text-emerald-700", level:"very-low", label:"Very Low — walk right on" },
          { bg:"bg-green-100",   color:"text-green-700",   level:"low",      label:"Low — short waits" },
          { bg:"bg-yellow-100",  color:"text-yellow-700",  level:"moderate", label:"Moderate — plan ahead" },
          { bg:"bg-orange-100",  color:"text-orange-700",  level:"high",     label:"High — Lightning Lane recommended" },
          { bg:"bg-red-100",     color:"text-red-700",     level:"very-high",label:"Very High — maximum crowds" },
        ] as const).map(({ bg, color, level, label }) => (
          <span key={label} className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold", bg, color)}>
            <CrowdIcon level={level} size={14} /> {label}
          </span>
        ))}
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold bg-blue-50 text-blue-700">
          ● = real collected data
        </span>
      </div>

      <div className="flex gap-2 text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2">
        <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
        <p>Predictions are based on historical crowd patterns, US school calendars, and known park events. Real data shown for past dates once the app has collected enough snapshots. Actual crowds may vary.</p>
      </div>
    </div>
  );
}
