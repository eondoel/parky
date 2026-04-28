/**
 * Crowd prediction engine.
 * Returns a score 1–10 for a given park + date based on:
 *  - Monthly seasonality
 *  - Day of week
 *  - US school holidays and breaks
 *  - Known park-specific events
 *  - Epic Universe opening surge (2026)
 */

export interface CrowdPrediction {
  score: number;        // 1–10
  level: "very-low" | "low" | "moderate" | "high" | "very-high";
  label: string;
  color: string;
  bg: string;
  reasons: string[];    // human-readable explanation
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function mmdd(date: Date): string {
  return `${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function isBetween(date: Date, m1: number, d1: number, m2: number, d2: number): boolean {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const val = month * 100 + day;
  return val >= m1 * 100 + d1 && val <= m2 * 100 + d2;
}

function isWeekend(date: Date): boolean {
  const dow = date.getDay();
  return dow === 0 || dow === 6;
}

function isFriday(date: Date): boolean { return date.getDay() === 5; }

// Nth weekday of a month: e.g. 4th Thursday of November
function nthWeekday(year: number, month: number, weekday: number, n: number): Date {
  const first = new Date(year, month - 1, 1);
  const diff = (weekday - first.getDay() + 7) % 7;
  return new Date(year, month - 1, 1 + diff + (n - 1) * 7);
}

function addDays(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function sameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function withinDays(date: Date, anchor: Date, before: number, after: number): boolean {
  const low = addDays(anchor, -before);
  const high = addDays(anchor, after);
  return date >= low && date <= high;
}

// ── Monthly baseline (1–10) ───────────────────────────────────────────────────

const FLORIDA_MONTHLY: Record<number, number> = {
  1: 5,   // Jan: moderate (New Year hangover; MLK weekend spike handled separately)
  2: 4,   // Feb: low (except Presidents Day)
  3: 8,   // Mar: very high (Spring Break)
  4: 6,   // Apr: moderate-high (Easter, Spring Break tail)
  5: 5,   // May: moderate
  6: 7,   // Jun: high (summer begins)
  7: 9,   // Jul: very high (peak summer + 4th of July)
  8: 7,   // Aug: high (summer, back-to-school overlap)
  9: 3,   // Sep: low (quietest month — school back)
  10: 5,  // Oct: moderate (Halloween events boost it)
  11: 6,  // Nov: moderate-high (Thanksgiving spike)
  12: 8,  // Dec: high (Christmas, NYE)
};

const CALIFORNIA_MONTHLY: Record<number, number> = {
  1: 4,
  2: 3,
  3: 7,
  4: 6,
  5: 5,
  6: 6,
  7: 8,
  8: 7,
  9: 4,
  10: 5,
  11: 5,
  12: 7,
};

// ── Main prediction function ──────────────────────────────────────────────────

export function predictCrowd(date: Date, parkSlug: string): CrowdPrediction {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const dow = date.getDay(); // 0 Sun … 6 Sat
  const isFL = !["disneyland", "california-adventure", "universal-hollywood"].includes(parkSlug);
  const isUniversalOrlando = ["universal-studios-florida", "islands-of-adventure", "epic-universe"].includes(parkSlug);

  const reasons: string[] = [];
  let score = isFL ? FLORIDA_MONTHLY[month] : CALIFORNIA_MONTHLY[month];

  // ── Day of week modifier ────────────────────────────────────────────────────
  if (dow === 6) { score += 1.5; reasons.push("Saturday") }
  else if (dow === 0) { score += 1; reasons.push("Sunday") }
  else if (dow === 5) { score += 0.5; reasons.push("Friday") }
  else if (dow === 1) { score -= 0.5 } // Monday slightly quieter

  // ── US School Holidays ──────────────────────────────────────────────────────

  // New Year's Day ±3 days
  const newYearsDay = new Date(year, 0, 1);
  if (withinDays(date, newYearsDay, 3, 3)) {
    score += 3; reasons.push("New Year's holiday");
  }

  // MLK Day (3rd Monday of January) — long weekend
  const mlkDay = nthWeekday(year, 1, 1, 3);
  if (withinDays(date, mlkDay, 1, 1)) {
    score += 1.5; reasons.push("MLK Day weekend");
  }

  // Presidents Day (3rd Monday of February) — long weekend
  const presidentsDay = nthWeekday(year, 2, 1, 3);
  if (withinDays(date, presidentsDay, 2, 2)) {
    score += 2; reasons.push("Presidents' Day weekend");
  }

  // Spring Break — typically mid-March through end of April (peak: last 2 wks March)
  if (isBetween(date, 3, 7, 3, 22)) {
    score += 2.5; reasons.push("Peak Spring Break");
  } else if (isBetween(date, 3, 23, 4, 13)) {
    score += 1.5; reasons.push("Spring Break");
  }

  // Easter — 2026: Apr 5, 2027: Mar 28
  const easterDates: Record<number, Date> = {
    2026: new Date(2026, 3, 5),
    2027: new Date(2027, 2, 28),
  };
  const easter = easterDates[year];
  if (easter && withinDays(date, easter, 3, 3)) {
    score += 2; reasons.push("Easter weekend");
  }

  // Memorial Day (last Monday of May) — long weekend
  const memorialDay = nthWeekday(year, 5, 1, 4);
  if (sameDay(date, memorialDay) || withinDays(date, memorialDay, 2, 0)) {
    score += 2; reasons.push("Memorial Day weekend");
  }

  // Summer (June 15 – Aug 15): already in monthly but reinforce core weeks
  if (isBetween(date, 6, 25, 7, 7)) {
    score += 1; reasons.push("Peak early summer");
  }

  // 4th of July ±3 days
  const july4 = new Date(year, 6, 4);
  if (withinDays(date, july4, 3, 3)) {
    score += 2.5; reasons.push("4th of July");
  }

  // Labor Day (1st Monday of September) — long weekend
  const laborDay = nthWeekday(year, 9, 1, 1);
  if (withinDays(date, laborDay, 2, 0)) {
    score += 1.5; reasons.push("Labor Day weekend");
  }

  // Columbus / Indigenous Peoples Day (2nd Monday of October)
  const columbusDay = nthWeekday(year, 10, 1, 2);
  if (withinDays(date, columbusDay, 1, 1)) {
    score += 1; reasons.push("Columbus Day weekend");
  }

  // Thanksgiving (4th Thursday of November) — full week is very busy
  const thanksgiving = nthWeekday(year, 11, 4, 4);
  if (withinDays(date, thanksgiving, 5, 2)) {
    score += 3; reasons.push("Thanksgiving week");
  }

  // Christmas week: Dec 20 – Jan 1
  if (isBetween(date, 12, 20, 12, 31)) {
    score += 3.5; reasons.push("Christmas & New Year's week");
  }

  // ── Park-specific events ────────────────────────────────────────────────────

  // EPCOT Flower & Garden: late Feb – late May
  if (parkSlug === "epcot" && isBetween(date, 3, 1, 5, 25)) {
    score += 0.5; reasons.push("EPCOT Flower & Garden Festival");
  }

  // EPCOT Food & Wine: late Aug – late Nov
  if (parkSlug === "epcot" && isBetween(date, 8, 29, 11, 22)) {
    score += 0.5; reasons.push("EPCOT Food & Wine Festival");
  }

  // Halloween Horror Nights at Universal (Sept–Nov, Fri/Sat/some weekdays)
  if (isUniversalOrlando && isBetween(date, 9, 1, 11, 1)) {
    score += isWeekend(date) || isFriday(date) ? 1.5 : 0.5;
    reasons.push("Halloween Horror Nights season");
  }

  // Halloween Horror Nights Hollywood (same period)
  if (parkSlug === "universal-hollywood" && isBetween(date, 9, 5, 11, 2)) {
    score += isWeekend(date) || isFriday(date) ? 1.5 : 0.5;
    reasons.push("Halloween Horror Nights Hollywood");
  }

  // Mickey's Not So Scary (Magic Kingdom) Aug–Oct, selected nights
  if (parkSlug === "magic-kingdom" && isBetween(date, 8, 1, 10, 31)) {
    score += isWeekend(date) ? 0.75 : 0.25;
    reasons.push("Halloween party season");
  }

  // Mickey's Very Merry Christmas (Magic Kingdom) Nov–Dec
  if (parkSlug === "magic-kingdom" && isBetween(date, 11, 8, 12, 19)) {
    score += 0.5; reasons.push("Christmas party season");
  }

  // Epic Universe opening surge (2026 — whole year is elevated for Universal Orlando)
  if (isUniversalOrlando && year === 2026) {
    score += 1.5; reasons.push("Epic Universe opening year");
  }

  // Clamp to 1–10
  score = Math.min(10, Math.max(1, Math.round(score)));

  // If no special reasons, add a default
  if (reasons.filter(r => !["Saturday","Sunday","Friday"].includes(r)).length === 0) {
    reasons.unshift(score <= 4 ? "Typically a quiet period" : "Standard seasonal crowds");
  }

  return { score, ...scoreToLevel(score), reasons };
}

function scoreToLevel(score: number): Omit<CrowdPrediction, "score" | "reasons"> {
  if (score <= 2) return { level: "very-low", label: "Very Low",  color: "text-emerald-700", bg: "bg-emerald-100" };
  if (score <= 4) return { level: "low",      label: "Low",       color: "text-green-700",   bg: "bg-green-100"  };
  if (score <= 6) return { level: "moderate", label: "Moderate",  color: "text-yellow-700",  bg: "bg-yellow-100" };
  if (score <= 8) return { level: "high",     label: "High",      color: "text-orange-700",  bg: "bg-orange-100" };
  return            { level: "very-high", label: "Very High", color: "text-red-700",     bg: "bg-red-100"    };
}
