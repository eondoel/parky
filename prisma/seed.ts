import { PrismaClient } from "@prisma/client";
import { PARKS } from "../src/lib/parks";

const prisma = new PrismaClient();

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
