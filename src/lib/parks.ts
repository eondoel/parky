export interface ParkDef {
  slug: string;
  name: string;
  shortName: string;
  location: string;
  themeParksId: string;
  timezone: string;
  color: string;
  icon: string;
  image: string;
}

export const PARKS: ParkDef[] = [
  // ── Disneyland Resort ───────────────────────────────────────────
  {
    slug: "disneyland",
    name: "Disneyland Park",
    shortName: "Disneyland",
    location: "Anaheim, CA",
    themeParksId: "7340550b-c14d-4def-80bb-acdb51d49a66",
    timezone: "America/Los_Angeles",
    color: "#1565C0",
    icon: "Castle",
    image: "/images/parks/disneyland.png",
  },
  {
    slug: "california-adventure",
    name: "Disney California Adventure",
    shortName: "California Adventure",
    location: "Anaheim, CA",
    themeParksId: "832fcd51-ea19-4e77-85c7-75d5843b127c",
    timezone: "America/Los_Angeles",
    color: "#E65100",
    icon: "Sparkle",
    image: "/images/parks/california-adventure.jpg",
  },
  // ── Walt Disney World ────────────────────────────────────────────
  {
    slug: "magic-kingdom",
    name: "Magic Kingdom",
    shortName: "Magic Kingdom",
    location: "Orlando, FL",
    themeParksId: "75ea578a-adc8-4116-a54d-dccb60765ef9",
    timezone: "America/New_York",
    color: "#6A1B9A",
    icon: "Crown",
    image: "/images/parks/magic-kingdom.jpg",
  },
  {
    slug: "epcot",
    name: "EPCOT",
    shortName: "EPCOT",
    location: "Orlando, FL",
    themeParksId: "47f90d2c-e191-4239-a466-5892ef59a88b",
    timezone: "America/New_York",
    color: "#00796B",
    icon: "Globe",
    image: "/images/parks/epcot.jpg",
  },
  {
    slug: "hollywood-studios",
    name: "Disney's Hollywood Studios",
    shortName: "Hollywood Studios",
    location: "Orlando, FL",
    themeParksId: "288747d1-8b4f-4a64-867e-ea7c9b27bad8",
    timezone: "America/New_York",
    color: "#C62828",
    icon: "FilmSlate",
    image: "/images/parks/hollywood-studios.jpg",
  },
  {
    slug: "animal-kingdom",
    name: "Disney's Animal Kingdom",
    shortName: "Animal Kingdom",
    location: "Orlando, FL",
    themeParksId: "1c84a229-8862-4648-9c71-378ddd2c7693",
    timezone: "America/New_York",
    color: "#2E7D32",
    icon: "Paw",
    image: "/images/parks/animal-kingdom.jpg",
  },
  // ── Universal Studios Hollywood ──────────────────────────────────
  {
    slug: "universal-hollywood",
    name: "Universal Studios Hollywood",
    shortName: "Universal Hollywood",
    location: "Los Angeles, CA",
    themeParksId: "bc4005c5-8c7e-41d7-b349-cdddf1796427",
    timezone: "America/Los_Angeles",
    color: "#F57F17",
    icon: "FilmStrip",
    image: "/images/parks/universal-hollywood.jpg",
  },
  // ── Universal Orlando ────────────────────────────────────────────
  {
    slug: "universal-studios-florida",
    name: "Universal Studios Florida",
    shortName: "Universal Studios",
    location: "Orlando, FL",
    themeParksId: "eb3f4560-2383-4a36-9152-6b3e5ed6bc57",
    timezone: "America/New_York",
    color: "#FF6F00",
    icon: "VideoCamera",
    image: "/images/parks/universal-studios-florida.jpg",
  },
  {
    slug: "islands-of-adventure",
    name: "Islands of Adventure",
    shortName: "Islands of Adventure",
    location: "Orlando, FL",
    themeParksId: "267615cc-8943-4c2a-ae2c-5da728ca591f",
    timezone: "America/New_York",
    color: "#1976D2",
    icon: "Anchor",
    image: "/images/parks/islands-of-adventure.jpg",
  },
  {
    slug: "epic-universe",
    name: "Universal Epic Universe",
    shortName: "Epic Universe",
    location: "Orlando, FL",
    themeParksId: "12dbb85b-265f-44e6-bccf-f1faa17211fc",
    timezone: "America/New_York",
    color: "#4527A0",
    icon: "Planet",
    image: "/images/parks/epic-universe.jpg",
  },
];

export const PARK_BY_SLUG = Object.fromEntries(PARKS.map((p) => [p.slug, p]));
export const PARK_BY_ID = Object.fromEntries(PARKS.map((p) => [p.themeParksId, p]));

export const LA_PARKS = PARKS.filter((p) => p.location.includes("CA"));
export const ORLANDO_PARKS = PARKS.filter((p) => p.location.includes("FL"));
