/*
  Warnings:

  - A unique constraint covering the columns `[conversationId]` on the table `Follow` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Follow` ADD COLUMN `conversationId` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Follow_conversationId_key` ON `Follow`(`conversationId`);

-- CreateIndex
CREATE INDEX `Follow_conversationId_idx` ON `Follow`(`conversationId`);
