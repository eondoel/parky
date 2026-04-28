import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { PARKS } from "../src/lib/parks";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding parks...");
  for (const park of PARKS) {
    await prisma.park.upsert({
      where: { slug: park.slug },
      update: { name: park.name, location: park.location, themeParksId: park.themeParksId, timezone: park.timezone },
      create: { name: park.name, slug: park.slug, location: park.location, themeParksId: park.themeParksId, timezone: park.timezone },
    });
    console.log(`  ✓ ${park.name}`);
  }
  console.log("Done!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
