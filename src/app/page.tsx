import ParkCard from "@/components/ParkCard";
import { LA_PARKS, ORLANDO_PARKS } from "@/lib/parks";
import { MapPin } from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-10">
      {/* Hero header */}
      <div className="text-center py-2">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Live Wait Times</h1>
        <p className="text-gray-400 text-sm mt-1.5">
          Real-time data · Auto-refreshes every 60 s · Park local time
        </p>
      </div>

      {/* California */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-orange-50 rounded-full text-orange-600">
            <MapPin className="w-3.5 h-3.5" />
            <span className="text-sm font-bold">California</span>
          </div>
          <div className="flex-1 h-px bg-orange-100" />
          <span className="text-xs text-gray-400">Anaheim &amp; Los Angeles · Pacific Time</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {LA_PARKS.map((park) => (
            <ParkCard key={park.slug} park={park} />
          ))}
        </div>
      </section>

      {/* Florida */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 rounded-full text-blue-600">
            <MapPin className="w-3.5 h-3.5" />
            <span className="text-sm font-bold">Florida</span>
          </div>
          <div className="flex-1 h-px bg-blue-100" />
          <span className="text-xs text-gray-400">Orlando · Eastern Time</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {ORLANDO_PARKS.map((park) => (
            <ParkCard key={park.slug} park={park} />
          ))}
        </div>
      </section>
    </div>
  );
}
