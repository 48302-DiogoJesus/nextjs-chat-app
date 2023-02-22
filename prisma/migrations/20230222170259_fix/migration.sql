-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_roomName_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "roomName" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roomName_fkey" FOREIGN KEY ("roomName") REFERENCES "Room"("name") ON DELETE SET NULL ON UPDATE CASCADE;
