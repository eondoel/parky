import ParkCard from "@/components/ParkCard";
import { LA_PARKS, ORLANDO_PARKS } from "@/lib/parks";
import { MapPin } from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Live Wait Times</h1>
        <p className="text-gray-500 text-sm mt-1">
          Updated every 60 seconds · Times shown in each park&apos;s local timezone
        </p>
      </div>

      {/* California */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1.5 text-orange-600">
            <MapPin className="w-4 h-4" />
            <h2 className="text-base font-bold">California</h2>
          </div>
          <div className="flex-1 h-px bg-orange-100" />
          <span className="text-xs text-gray-400">Anaheim &amp; Los Angeles · Pacific Time</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {LA_PARKS.map((park) => (
            <ParkCard key={park.slug} park={park} />
          ))}
        </div>
      </section>

      {/* Florida */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1.5 text-blue-600">
            <MapPin className="w-4 h-4" />
            <h2 className="text-base font-bold">Florida</h2>
          </div>
          <div className="flex-1 h-px bg-blue-100" />
          <span className="text-xs text-gray-400">Orlando · Eastern Time</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ORLANDO_PARKS.map((park) => (
            <ParkCard key={park.slug} park={park} />
          ))}
        </div>
      </section>
    </div>
  );
}
