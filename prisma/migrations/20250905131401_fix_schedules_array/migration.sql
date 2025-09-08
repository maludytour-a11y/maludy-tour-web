/*
  Warnings:

  - The `schedules` column on the `Activitie` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."Activitie" DROP COLUMN "schedules",
ADD COLUMN     "schedules" TEXT[];
