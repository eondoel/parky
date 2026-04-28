"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { MapPin, BarChart2, CalendarCheck, Home } from "lucide-react";

const NAV = [
  { href: "/", label: "Parks", icon: Home },
  { href: "/analyzer", label: "Analyzer", icon: BarChart2 },
  { href: "/planner", label: "Planner", icon: CalendarCheck },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop top nav */}
      <header className="hidden md:flex sticky top-0 z-40 w-full border-b border-gray-200 bg-white/90 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between w-full">
          <Link href="/" className="flex items-center gap-2 font-bold text-blue-600 text-lg">
            <MapPin className="w-5 h-5" />
            Parky
          </Link>
          <nav className="flex items-center gap-1">
            {NAV.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors",
                  pathname === href || (href !== "/" && pathname.startsWith(href))
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-200">
        <div className="grid grid-cols-3">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center py-2 gap-0.5 text-xs font-medium transition-colors",
                pathname === href || (href !== "/" && pathname.startsWith(href))
                  ? "text-blue-600"
                  : "text-gray-500"
              )}
            >
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
