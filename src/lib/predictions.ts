export interface CrowdPrediction {
  score: number;
  level: "very-low" | "low" | "moderate" | "high" | "very-high";
  label: string;
  color: string;
  bg: string;
  reasons: string[];
  holidays: string[];   // holiday / special event names for this date
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function isBetween(date: Date, m1: number, d1: number, m2: number, d2: number): boolean {
  const v = (date.getMonth() + 1) * 100 + date.getDate();
  return v >= m1 * 100 + d1 && v <= m2 * 100 + d2;
}

function isWeekend(date: Date) { const d = date.getDay(); return d === 0 || d === 6; }
function isFriday(date: Date)  { return date.getDay() === 5; }

function nthWeekday(year: number, month: number, weekday: number, n: number): Date {
  const first = new Date(year, month - 1, 1);
  const diff = (weekday - first.getDay() + 7) % 7;
  return new Date(year, month - 1, 1 + diff + (n - 1) * 7);
}

function addDays(date: Date, n: number): Date {
  const d = new Date(date); d.setDate(d.getDate() + n); return d;
}

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function withinDays(date: Date, anchor: Date, before: number, after: number) {
  return date >= addDays(anchor, -before) && date <= addDays(anchor, after);
}

// ── Monthly baseline ──────────────────────────────────────────────────────────

const FLORIDA_MONTHLY: Record<number, number> = {
  1:5, 2:4, 3:8, 4:6, 5:5, 6:7, 7:9, 8:7, 9:3, 10:5, 11:6, 12:8,
};
const CALIFORNIA_MONTHLY: Record<number, number> = {
  1:4, 2:3, 3:7, 4:6, 5:5, 6:6, 7:8, 8:7, 9:4, 10:5, 11:5, 12:7,
};

// ── Holiday / event names ─────────────────────────────────────────────────────

export function getHolidaysForDate(date: Date, parkSlug?: string): string[] {
  const year  = date.getFullYear();
  const month = date.getMonth() + 1;
  const day   = date.getDate();
  const val   = month * 100 + day;
  const list: string[] = [];

  // Fixed-date US holidays
  if (val === 101) list.push("New Year's Day");
  if (val === 214) list.push("Valentine's Day");
  if (val === 317) list.push("St. Patrick's Day");
  if (val === 704) list.push("4th of July");
  if (val === 1011) list.push("Veterans Day");
  if (val === 1225) list.push("Christmas Day");
  if (val === 1226) list.push("Christmas Day (observed)");
  if (val === 1231) list.push("New Year's Eve");

  // MLK Day — 3rd Monday of January
  const mlk = nthWeekday(year, 1, 1, 3);
  if (sameDay(date, mlk)) list.push("MLK Day");

  // Presidents Day — 3rd Monday of February
  const pres = nthWeekday(year, 2, 1, 3);
  if (sameDay(date, pres)) list.push("Presidents' Day");

  // Memorial Day — last Monday of May
  const mem = nthWeekday(year, 5, 1, 4);
  if (sameDay(date, mem) || sameDay(date, addDays(mem, -2)) || sameDay(date, addDays(mem, -1))) {
    if (sameDay(date, mem)) list.push("Memorial Day");
  }

  // Labor Day — 1st Monday of September
  const labor = nthWeekday(year, 9, 1, 1);
  if (sameDay(date, labor)) list.push("Labor Day");

  // Columbus Day — 2nd Monday of October
  const columbus = nthWeekday(year, 10, 1, 2);
  if (sameDay(date, columbus)) list.push("Columbus Day");

  // Thanksgiving — 4th Thursday of November
  const thanks = nthWeekday(year, 11, 4, 4);
  if (sameDay(date, thanks)) list.push("Thanksgiving");
  if (sameDay(date, addDays(thanks, 1))) list.push("Black Friday");

  // Easter
  const easterDates: Record<number, [number, number]> = {
    2025: [4, 20], 2026: [4, 5], 2027: [3, 28], 2028: [4, 16],
  };
  const e = easterDates[year];
  if (e && month === e[0] && day === e[1]) list.push("Easter Sunday");

  // Spring Break label (general)
  if (isBetween(date, 3, 7, 3, 22)) list.push("Spring Break (peak)");
  else if (isBetween(date, 3, 23, 4, 13)) list.push("Spring Break");

  // Summer
  if (isBetween(date, 6, 21, 9, 5)) list.push("Summer");

  // Park-specific events
  if (parkSlug) {
    if (parkSlug === "epcot") {
      if (isBetween(date, 3, 1, 5, 25))  list.push("Flower & Garden Festival");
      if (isBetween(date, 8, 29, 11, 22)) list.push("Food & Wine Festival");
    }
    if (["universal-studios-florida", "islands-of-adventure", "epic-universe"].includes(parkSlug)) {
      if (isBetween(date, 9, 1, 11, 1) && (isWeekend(date) || isFriday(date))) list.push("Halloween Horror Nights");
      if (isBetween(date, 11, 15, 1, 5)) list.push("Holidays at Universal");
    }
    if (parkSlug === "universal-hollywood") {
      if (isBetween(date, 9, 5, 11, 2) && (isWeekend(date) || isFriday(date))) list.push("Halloween Horror Nights");
    }
    if (parkSlug === "magic-kingdom") {
      if (isBetween(date, 8, 1, 10, 31) && isWeekend(date)) list.push("Not-So-Scary Halloween Party");
      if (isBetween(date, 11, 8, 12, 19) && isWeekend(date)) list.push("Very Merry Christmas Party");
    }
    if (["disneyland", "california-adventure"].includes(parkSlug)) {
      if (isBetween(date, 9, 5, 10, 31)) list.push("Halloween Time at Disneyland");
      if (isBetween(date, 11, 8, 1, 6))  list.push("Holidays at Disneyland");
    }
  }

  return list;
}

// ── Main prediction ───────────────────────────────────────────────────────────

export function predictCrowd(date: Date, parkSlug: string): CrowdPrediction {
  const year  = date.getFullYear();
  const month = date.getMonth() + 1;
  const dow   = date.getDay();
  const isFL  = !["disneyland", "california-adventure", "universal-hollywood"].includes(parkSlug);
  const isUniversalOrlando = ["universal-studios-florida", "islands-of-adventure", "epic-universe"].includes(parkSlug);

  const reasons: string[] = [];
  let score = isFL ? FLORIDA_MONTHLY[month] : CALIFORNIA_MONTHLY[month];

  // Day of week
  if (dow === 6)      { score += 1.5; reasons.push("Saturday"); }
  else if (dow === 0) { score += 1;   reasons.push("Sunday"); }
  else if (dow === 5) { score += 0.5; reasons.push("Friday"); }
  else if (dow === 1) { score -= 0.5; }

  // New Year's ±3 days
  if (withinDays(date, new Date(year, 0, 1), 3, 3)) { score += 3; reasons.push("New Year's holiday"); }

  // MLK weekend
  const mlk = nthWeekday(year, 1, 1, 3);
  if (withinDays(date, mlk, 1, 1)) { score += 1.5; reasons.push("MLK Day weekend"); }

  // Presidents Day weekend
  const pres = nthWeekday(year, 2, 1, 3);
  if (withinDays(date, pres, 2, 2)) { score += 2; reasons.push("Presidents' Day weekend"); }

  // Spring Break
  if (isBetween(date, 3, 7, 3, 22))   { score += 2.5; reasons.push("Peak Spring Break"); }
  else if (isBetween(date, 3, 23, 4, 13)) { score += 1.5; reasons.push("Spring Break"); }

  // Easter
  const easterDates: Record<number, Date> = {
    2025: new Date(2025, 3, 20), 2026: new Date(2026, 3, 5),
    2027: new Date(2027, 2, 28), 2028: new Date(2028, 3, 16),
  };
  const easter = easterDates[year];
  if (easter && withinDays(date, easter, 3, 3)) { score += 2; reasons.push("Easter weekend"); }

  // Memorial Day
  const mem = nthWeekday(year, 5, 1, 4);
  if (withinDays(date, mem, 2, 0)) { score += 2; reasons.push("Memorial Day weekend"); }

  // 4th of July ±3 days
  const july4 = new Date(year, 6, 4);
  if (withinDays(date, july4, 3, 3)) { score += 2.5; reasons.push("4th of July"); }

  // Labor Day weekend
  const labor = nthWeekday(year, 9, 1, 1);
  if (withinDays(date, labor, 2, 0)) { score += 1.5; reasons.push("Labor Day weekend"); }

  // Columbus Day weekend
  const columbus = nthWeekday(year, 10, 1, 2);
  if (withinDays(date, columbus, 1, 1)) { score += 1; reasons.push("Columbus Day weekend"); }

  // Thanksgiving week
  const thanks = nthWeekday(year, 11, 4, 4);
  if (withinDays(date, thanks, 5, 2)) { score += 3; reasons.push("Thanksgiving week"); }

  // Christmas week
  if (isBetween(date, 12, 20, 12, 31)) { score += 3.5; reasons.push("Christmas & New Year's week"); }

  // Park-specific events
  if (parkSlug === "epcot") {
    if (isBetween(date, 3, 1, 5, 25))  { score += 0.5; reasons.push("Flower & Garden Festival"); }
    if (isBetween(date, 8, 29, 11, 22)){ score += 0.5; reasons.push("Food & Wine Festival"); }
  }
  if (isUniversalOrlando && isBetween(date, 9, 1, 11, 1)) {
    score += isWeekend(date) || isFriday(date) ? 1.5 : 0.5;
    reasons.push("Halloween Horror Nights season");
  }
  if (parkSlug === "universal-hollywood" && isBetween(date, 9, 5, 11, 2)) {
    score += isWeekend(date) || isFriday(date) ? 1.5 : 0.5;
    reasons.push("Halloween Horror Nights Hollywood");
  }
  if (parkSlug === "magic-kingdom" && isBetween(date, 8, 1, 10, 31)) {
    score += isWeekend(date) ? 0.75 : 0.25;
    reasons.push("Halloween party season");
  }
  if (parkSlug === "magic-kingdom" && isBetween(date, 11, 8, 12, 19)) {
    score += 0.5; reasons.push("Christmas party season");
  }
  if (["disneyland", "california-adventure"].includes(parkSlug) && isBetween(date, 9, 5, 10, 31)) {
    score += isWeekend(date) ? 0.75 : 0.25;
    reasons.push("Halloween Time at Disneyland");
  }
  if (isUniversalOrlando && year === 2026) {
    score += 1.5; reasons.push("Epic Universe opening year");
  }

  score = Math.min(10, Math.max(1, Math.round(score)));

  if (reasons.filter((r) => !["Saturday","Sunday","Friday"].includes(r)).length === 0) {
    reasons.unshift(score <= 4 ? "Typically a quiet period" : "Standard seasonal crowds");
  }

  return {
    score,
    ...scoreToLevel(score),
    reasons,
    holidays: getHolidaysForDate(date, parkSlug),
  };
}

export function scoreToLevel(score: number): Omit<CrowdPrediction, "score" | "reasons" | "holidays"> {
  if (score <= 2) return { level: "very-low", label: "Very Low",  color: "text-emerald-700", bg: "bg-emerald-100" };
  if (score <= 4) return { level: "low",      label: "Low",       color: "text-green-700",   bg: "bg-green-100"  };
  if (score <= 6) return { level: "moderate", label: "Moderate",  color: "text-yellow-700",  bg: "bg-yellow-100" };
  if (score <= 8) return { level: "high",     label: "High",      color: "text-orange-700",  bg: "bg-orange-100" };
  return            { level: "very-high", label: "Very High", color: "text-red-700",     bg: "bg-red-100"    };
}
