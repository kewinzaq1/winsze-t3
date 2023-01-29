/*
  Warnings:

  - A unique constraint covering the columns `[conversationId]` on the table `Follow` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Follow` ADD COLUMN `conversationId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Conversation` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `followId` VARCHAR(191) NOT NULL,

    INDEX `Conversation_userId_idx`(`userId`),
    UNIQUE INDEX `Conversation_userId_key`(`userId`),
    UNIQUE INDEX `Conversation_followId_key`(`followId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Message` (
    `id` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `conversationId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Message_userId_idx`(`userId`),
    INDEX `Message_conversationId_idx`(`conversationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Follow_conversationId_key` ON `Follow`(`conversationId`);

-- CreateIndex
CREATE INDEX `Follow_conversationId_idx` ON `Follow`(`conversationId`);
