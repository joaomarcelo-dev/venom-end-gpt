-- CreateTable
CREATE TABLE "Messages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL,
    "content" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "from" TEXT NOT NULL
);
