-- CreateEnum
CREATE TYPE "public"."ImageType" AS ENUM ('MAIN', 'ACTIVITY', 'REVIEW');

-- CreateEnum
CREATE TYPE "public"."BadgeType" AS ENUM ('NEW', 'POPULAR', 'SEASON');

-- CreateEnum
CREATE TYPE "public"."Languages" AS ENUM ('ES', 'EN', 'FR');

-- CreateEnum
CREATE TYPE "public"."PaymentMethod" AS ENUM ('PAYPAL', 'CARD', 'CASH');

-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('PAID', 'PENDING');

-- CreateTable
CREATE TABLE "public"."Activitie" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "rating" DECIMAL(65,30) NOT NULL,
    "reviews" INTEGER NOT NULL,
    "badge" "public"."BadgeType" NOT NULL,
    "languages" "public"."Languages" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Activitie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Image" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" "public"."ImageType" NOT NULL,
    "alt" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "storage" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Prices" (
    "id" TEXT NOT NULL,
    "seniorPrice" INTEGER NOT NULL,
    "adultPrice" INTEGER NOT NULL,
    "youthsPrice" INTEGER NOT NULL,
    "childrenPrice" INTEGER NOT NULL,
    "babiesPrice" INTEGER NOT NULL,
    "seniorAge" INTEGER[],
    "adultAge" INTEGER[],
    "youthsAge" INTEGER[],
    "childrenAge" INTEGER[],
    "babiesAge" INTEGER[],
    "activityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Prices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Booking" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "seniors" INTEGER NOT NULL,
    "adults" INTEGER NOT NULL,
    "youths" INTEGER NOT NULL,
    "children" INTEGER NOT NULL,
    "babies" INTEGER NOT NULL,
    "paymentMethod" "public"."PaymentMethod" NOT NULL,
    "paymentStatus" "public"."PaymentStatus" NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "pickupLocation" TEXT NOT NULL,
    "pickupTime" TEXT NOT NULL,
    "schedule" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Prices_activityId_key" ON "public"."Prices"("activityId");

-- AddForeignKey
ALTER TABLE "public"."Image" ADD CONSTRAINT "Image_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "public"."Activitie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Prices" ADD CONSTRAINT "Prices_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "public"."Activitie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "public"."Activitie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
