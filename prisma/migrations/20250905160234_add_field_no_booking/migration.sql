/*
  Warnings:

  - Added the required column `no` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Booking" ADD COLUMN     "no" TEXT NOT NULL;
