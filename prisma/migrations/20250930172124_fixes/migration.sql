/*
  Warnings:

  - The primary key for the `PumpStatus` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `lastUpdated` on the `PumpStatus` table. All the data in the column will be lost.
  - You are about to drop the column `waterDelivered` on the `PumpStatus` table. All the data in the column will be lost.
  - The `id` column on the `PumpStatus` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `pumpId` to the `PumpStatus` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PumpStatus" DROP CONSTRAINT "PumpStatus_pkey",
DROP COLUMN "lastUpdated",
DROP COLUMN "waterDelivered",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "pumpId" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "isActive" DROP DEFAULT,
ADD CONSTRAINT "PumpStatus_pkey" PRIMARY KEY ("id");
