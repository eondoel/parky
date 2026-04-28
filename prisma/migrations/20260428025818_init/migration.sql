-- CreateTable
CREATE TABLE "Park" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "themeParksId" TEXT NOT NULL,
    "timezone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Park_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attraction" (
    "id" TEXT NOT NULL,
    "parkId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "themeParksId" TEXT NOT NULL,
    "attractionType" TEXT NOT NULL DEFAULT 'ATTRACTION',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Attraction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WaitSnapshot" (
    "id" TEXT NOT NULL,
    "attractionId" TEXT NOT NULL,
    "waitMinutes" INTEGER,
    "status" TEXT NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WaitSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Park_slug_key" ON "Park"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Park_themeParksId_key" ON "Park"("themeParksId");

-- CreateIndex
CREATE UNIQUE INDEX "Attraction_themeParksId_key" ON "Attraction"("themeParksId");

-- CreateIndex
CREATE INDEX "WaitSnapshot_attractionId_recordedAt_idx" ON "WaitSnapshot"("attractionId", "recordedAt");

-- CreateIndex
CREATE INDEX "WaitSnapshot_recordedAt_idx" ON "WaitSnapshot"("recordedAt");

-- AddForeignKey
ALTER TABLE "Attraction" ADD CONSTRAINT "Attraction_parkId_fkey" FOREIGN KEY ("parkId") REFERENCES "Park"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WaitSnapshot" ADD CONSTRAINT "WaitSnapshot_attractionId_fkey" FOREIGN KEY ("attractionId") REFERENCES "Attraction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
