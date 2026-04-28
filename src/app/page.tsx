import ParkCard from "@/components/ParkCard";
import { LA_PARKS, ORLANDO_PARKS } from "@/lib/parks";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Live Wait Times</h1>
        <p className="text-gray-500 text-sm mt-1">
          Updated every 60 seconds · All times in local park timezone
        </p>
      </div>

      <section>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Los Angeles / Anaheim
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {LA_PARKS.map((park) => (
            <ParkCard key={park.slug} park={park} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Orlando
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ORLANDO_PARKS.map((park) => (
            <ParkCard key={park.slug} park={park} />
          ))}
        </div>
      </section>
    </div>
  );
}
