/*
  Warnings:

  - You are about to drop the `Marketplace` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `sellerId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Marketplace_sellerId_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Marketplace";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "pric" REAL NOT NULL,
    "isSold" BOOLEAN NOT NULL,
    "DamoURL" TEXT,
    "typeId" INTEGER NOT NULL,
    "sellerId" INTEGER NOT NULL,
    CONSTRAINT "Product_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "ProdutType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Product_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("DamoURL", "description", "id", "isSold", "name", "pric", "typeId") SELECT "DamoURL", "description", "id", "isSold", "name", "pric", "typeId" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
