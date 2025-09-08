/*
  Warnings:

  - A unique constraint covering the columns `[no]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Booking_no_key" ON "public"."Booking"("no");
