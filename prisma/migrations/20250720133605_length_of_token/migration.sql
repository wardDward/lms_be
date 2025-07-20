/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `tbl_personal_tokens` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `tbl_personal_tokens_token_key` ON `tbl_personal_tokens`;

-- AlterTable
ALTER TABLE `tbl_personal_tokens` MODIFY `token` LONGTEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `tbl_personal_tokens_token_key` ON `tbl_personal_tokens`(`token`(255));
