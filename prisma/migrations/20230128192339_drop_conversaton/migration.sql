/*
  Warnings:

  - You are about to drop the column `conversationId` on the `Follow` table. All the data in the column will be lost.
  - You are about to drop the `Conversation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX `Follow_conversationId_idx` ON `Follow`;

-- DropIndex
DROP INDEX `Follow_conversationId_key` ON `Follow`;

-- AlterTable
ALTER TABLE `Follow` DROP COLUMN `conversationId`;

-- DropTable
DROP TABLE `Conversation`;

-- DropTable
DROP TABLE `Message`;
