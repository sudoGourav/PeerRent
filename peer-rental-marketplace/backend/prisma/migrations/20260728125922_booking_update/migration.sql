/*
  Warnings:

  - Added the required column `numberOfDays` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "numberOfDays" INTEGER NOT NULL,
ADD COLUMN     "paymentStatus" TEXT NOT NULL DEFAULT 'PENDING';

-- CreateIndex
CREATE INDEX "Booking_status_idx" ON "Booking"("status");
