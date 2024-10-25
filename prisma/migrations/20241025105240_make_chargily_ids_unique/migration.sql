/*
  Warnings:

  - A unique constraint covering the columns `[ChargilyPayId]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ChargilyPayPriceId]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Made the column `ChargilyPayId` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ChargilyPayPriceId` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "ChargilyPayId" SET NOT NULL,
ALTER COLUMN "ChargilyPayPriceId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Product_ChargilyPayId_key" ON "Product"("ChargilyPayId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_ChargilyPayPriceId_key" ON "Product"("ChargilyPayPriceId");
