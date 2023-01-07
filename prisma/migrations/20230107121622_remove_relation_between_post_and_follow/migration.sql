/*
  Warnings:

  - You are about to drop the column `postId` on the `Follow` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,followerId]` on the table `Follow` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Follow_postId_idx` ON `Follow`;

-- DropIndex
DROP INDEX `Follow_userId_followerId_postId_key` ON `Follow`;

-- AlterTable
ALTER TABLE `Follow` DROP COLUMN `postId`;

-- CreateIndex
CREATE UNIQUE INDEX `Follow_userId_followerId_key` ON `Follow`(`userId`, `followerId`);
