/*
  Warnings:

  - You are about to drop the column `conversationId` on the `Follow` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Follow_conversationId_idx` ON `Follow`;

-- AlterTable
ALTER TABLE `Follow` DROP COLUMN `conversationId`;

-- CreateIndex
CREATE INDEX `Conversation_userId_idx` ON `Conversation`(`userId`);

-- CreateIndex
CREATE INDEX `Conversation_followerId_idx` ON `Conversation`(`followerId`);
