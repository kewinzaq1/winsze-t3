-- AlterTable
ALTER TABLE `Follow` ADD COLUMN `conversationId` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `Follow_conversationId_idx` ON `Follow`(`conversationId`);
