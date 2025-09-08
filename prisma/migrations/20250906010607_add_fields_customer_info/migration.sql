/*
  Warnings:

  - Added the required column `customerEmail` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerName` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerPhone` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Booking" ADD COLUMN     "customerEmail" TEXT NOT NULL,
ADD COLUMN     "customerName" TEXT NOT NULL,
ADD COLUMN     "customerPhone" TEXT NOT NULL;
