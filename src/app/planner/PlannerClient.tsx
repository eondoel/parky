"use client";

import { useState } from "react";
import { PARKS } from "@/lib/parks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarCheck, Clock, ChevronDown, ChevronUp, Lightbulb } from "lucide-react";

interface PlanStep {
  attractionId: string;
  name: string;
  estimatedWait: number;
  predictedWait: number | null;
  arrivalTime: string;
  exitTime: string;
  tip: string;
}

interface PlanResult {
  park: { name: string; logo: string; location: string };
  visitDate: string;
  plan: PlanStep[];
}

function WaitDot({ minutes }: { minutes: number }) {
  const color =
    minutes <= 15 ? "bg-green-500" : minutes <= 30 ? "bg-yellow-400" : minutes <= 60 ? "bg-orange-400" : "bg-red-500";
  return <span className={`inline-block w-2.5 h-2.5 rounded-full ${color} flex-shrink-0`} />;
}

export default function PlannerClient() {
  const [parkSlug, setParkSlug] = useState(PARKS[0].slug);
  const [visitDate, setVisitDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [openTime, setOpenTime] = useState("09:00");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PlanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedTip, setExpandedTip] = useState<string | null>(null);

  async function handlePlan() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parkSlug, visitDate, openTime }),
      });
      if (!res.ok) throw new Error("Failed to generate plan");
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const totalWait = result?.plan.reduce((s, step) => s + step.estimatedWait, 0) ?? 0;
  const avgWait = result ? Math.round(totalWait / result.plan.length) : 0;
  const park = PARKS.find((p) => p.slug === parkSlug)!;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Trip Planner</h1>
        <p className="text-gray-500 text-sm mt-1">
          Get an optimized ride order based on live and predicted wait times.
        </p>
      </div>

      {/* Form */}
      <Card>
        <CardContent className="space-y-4 pt-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Park</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PARKS.map((p) => (
                <button
                  key={p.slug}
                  onClick={() => setParkSlug(p.slug)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm border transition-colors ${
                    parkSlug === p.slug
                      ? "bg-blue-50 border-blue-400 text-blue-700 font-semibold"
                      : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <span>{p.logo}</span>
                  <span className="truncate">{p.shortName}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Visit Date</label>
              <input
                type="date"
                value={visitDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setVisitDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Park Open Time</label>
              <input
                type="time"
                value={openTime}
                onChange={(e) => setOpenTime(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <Button onClick={handlePlan} disabled={loading} size="lg" className="w-full">
            <CalendarCheck className="w-4 h-4" />
            {loading ? "Generating plan…" : "Generate My Plan"}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <span>{result.park.logo ?? park.logo}</span>
                Your Plan for {new Date(result.visitDate + "T12:00:00").toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {result.plan.length} attractions · avg {avgWait} min wait · ~{Math.round((totalWait + result.plan.length * 17) / 60)}h total
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {result.plan.map((step, i) => (
              <Card key={step.attractionId}>
                <CardContent className="py-3 px-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-sm text-gray-900 truncate">{step.name}</p>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <WaitDot minutes={step.estimatedWait} />
                          <span className="text-sm font-semibold text-gray-700">
                            {step.estimatedWait} min
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          {step.arrivalTime} → {step.exitTime}
                        </span>
                        {step.predictedWait && (
                          <span className="text-xs text-gray-400">
                            hist. avg {step.predictedWait} min
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => setExpandedTip(expandedTip === step.attractionId ? null : step.attractionId)}
                        className="flex items-center gap-1 mt-1.5 text-xs text-amber-600 hover:text-amber-700"
                      >
                        <Lightbulb className="w-3 h-3" />
                        Tip
                        {expandedTip === step.attractionId ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )}
                      </button>
                      {expandedTip === step.attractionId && (
                        <p className="mt-1.5 text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2">
                          {step.tip}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardContent className="py-3 px-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                General Tips for {park.shortName}
              </h3>
              <ul className="space-y-1.5 text-xs text-gray-600">
                <li>• Arrive 20–30 minutes before park opening for rope-drop advantage.</li>
                <li>• Head to the most popular rides immediately at opening — crowds build fast.</li>
                <li>• Rides often have shorter lines during parade and show times.</li>
                <li>• Late afternoon (4–6 PM) and after 8 PM are typically the quietest windows.</li>
                <li>• Check the Lightning Lane / Express Pass availability early in the day.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
