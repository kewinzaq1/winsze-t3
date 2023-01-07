/*
  Warnings:

  - You are about to drop the column `friendId` on the `Follow` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,followerId]` on the table `Follow` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `followerId` to the `Follow` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Follow_friendId_idx` ON `Follow`;

-- DropIndex
DROP INDEX `Follow_userId_friendId_key` ON `Follow`;

-- AlterTable
ALTER TABLE `Follow` DROP COLUMN `friendId`,
    ADD COLUMN `followerId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE INDEX `Follow_followerId_idx` ON `Follow`(`followerId`);

-- CreateIndex
CREATE UNIQUE INDEX `Follow_userId_followerId_key` ON `Follow`(`userId`, `followerId`);
