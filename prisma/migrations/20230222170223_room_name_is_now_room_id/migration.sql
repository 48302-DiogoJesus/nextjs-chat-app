/*
  Warnings:

  - The primary key for the `Room` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `roomId` on the `User` table. All the data in the column will be lost.
  - Added the required column `roomName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_roomId_fkey";

-- AlterTable
ALTER TABLE "Room" DROP CONSTRAINT "Room_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Room_pkey" PRIMARY KEY ("name");

-- AlterTable
ALTER TABLE "User" DROP COLUMN "roomId",
ADD COLUMN     "roomName" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roomName_fkey" FOREIGN KEY ("roomName") REFERENCES "Room"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
