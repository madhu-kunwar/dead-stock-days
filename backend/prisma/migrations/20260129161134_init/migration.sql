-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "era" TEXT NOT NULL,
    "archiveType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "function" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "soldOut" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT NOT NULL,
    "dropDate" TEXT NOT NULL,
    "dropName" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
