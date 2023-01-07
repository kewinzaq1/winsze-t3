/*
  Warnings:

  - A unique constraint covering the columns `[userId,followerId,postId]` on the table `Follow` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Follow_userId_followerId_key` ON `Follow`;

-- AlterTable
ALTER TABLE `Follow` ADD COLUMN `postId` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `Follow_postId_idx` ON `Follow`(`postId`);

-- CreateIndex
CREATE UNIQUE INDEX `Follow_userId_followerId_postId_key` ON `Follow`(`userId`, `followerId`, `postId`);
