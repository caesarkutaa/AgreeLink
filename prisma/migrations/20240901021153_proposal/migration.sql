/*
  Warnings:

  - Made the column `signedAt` on table `Agreements` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Agreements" ALTER COLUMN "signedAt" SET NOT NULL,
ALTER COLUMN "signedAt" SET DEFAULT CURRENT_TIMESTAMP;
