/*
  Warnings:

  - You are about to drop the column `categoryId` on the `blogs` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `blogs` table. All the data in the column will be lost.
  - You are about to alter the column `content` on the `blogs` table. The data in that column could be lost. The data in that column will be cast from `VarChar(500)` to `VarChar(191)`.
  - You are about to drop the column `category` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `confirmPassword` on the `users` table. All the data in the column will be lost.
  - You are about to alter the column `created_at` on the `users` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updated_at` on the `users` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to drop the `likes` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `CategoryId` to the `blogs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UserId` to the `blogs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageURL` to the `blogs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isDeleted` to the `blogs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isPublished` to the `blogs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `blogs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `categories` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `blogs` DROP FOREIGN KEY `blogs_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `blogs` DROP FOREIGN KEY `blogs_userId_fkey`;

-- DropForeignKey
ALTER TABLE `likes` DROP FOREIGN KEY `likes_blogId_fkey`;

-- DropForeignKey
ALTER TABLE `likes` DROP FOREIGN KEY `likes_userId_fkey`;

-- AlterTable
ALTER TABLE `blogs` DROP COLUMN `categoryId`,
    DROP COLUMN `userId`,
    ADD COLUMN `CategoryId` INTEGER NOT NULL,
    ADD COLUMN `UserId` INTEGER NOT NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `imageURL` VARCHAR(191) NOT NULL,
    ADD COLUMN `isDeleted` BOOLEAN NOT NULL,
    ADD COLUMN `isPublished` BOOLEAN NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `videoURL` VARCHAR(191) NULL,
    MODIFY `title` VARCHAR(191) NOT NULL,
    MODIFY `content` VARCHAR(191) NOT NULL,
    MODIFY `country` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `categories` DROP COLUMN `category`,
    ADD COLUMN `name` VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `confirmPassword`,
    MODIFY `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updated_at` DATETIME NOT NULL,
    MODIFY `token` VARCHAR(500) NULL;

-- DropTable
DROP TABLE `likes`;

-- CreateTable
CREATE TABLE `blog_keyword` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `BlogId` INTEGER NOT NULL,
    `KeywordId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `keyword` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `like` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `UserId` INTEGER NOT NULL,
    `BlogId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `blogs` ADD CONSTRAINT `blogs_UserId_fkey` FOREIGN KEY (`UserId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `blogs` ADD CONSTRAINT `blogs_CategoryId_fkey` FOREIGN KEY (`CategoryId`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `blog_keyword` ADD CONSTRAINT `blog_keyword_BlogId_fkey` FOREIGN KEY (`BlogId`) REFERENCES `blogs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `blog_keyword` ADD CONSTRAINT `blog_keyword_KeywordId_fkey` FOREIGN KEY (`KeywordId`) REFERENCES `keyword`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `like` ADD CONSTRAINT `like_UserId_fkey` FOREIGN KEY (`UserId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `like` ADD CONSTRAINT `like_BlogId_fkey` FOREIGN KEY (`BlogId`) REFERENCES `blogs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
