/*
  Warnings:

  - Made the column `imagePath` on table `Signature` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Signature" ALTER COLUMN "imagePath" SET NOT NULL;
