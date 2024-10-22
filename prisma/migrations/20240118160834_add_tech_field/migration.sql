-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "isSold" BOOLEAN NOT NULL,
    "DamoURL" TEXT,
    "typeId" INTEGER NOT NULL,
    "sellerId" INTEGER NOT NULL,
    "techId" INTEGER,
    CONSTRAINT "Product_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "ProdutType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Product_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Product_techId_fkey" FOREIGN KEY ("techId") REFERENCES "Tech" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("DamoURL", "description", "id", "isSold", "name", "price", "sellerId", "typeId") SELECT "DamoURL", "description", "id", "isSold", "name", "price", "sellerId", "typeId" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
