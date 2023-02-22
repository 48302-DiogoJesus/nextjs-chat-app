/*
  Warnings:

  - You are about to drop the column `roomName` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_roomName_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "roomName";

-- CreateTable
CREATE TABLE "_RoomUsers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_RoomUsers_AB_unique" ON "_RoomUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_RoomUsers_B_index" ON "_RoomUsers"("B");

-- AddForeignKey
ALTER TABLE "_RoomUsers" ADD CONSTRAINT "_RoomUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Room"("name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoomUsers" ADD CONSTRAINT "_RoomUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
