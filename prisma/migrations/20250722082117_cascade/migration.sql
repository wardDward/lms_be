-- DropForeignKey
ALTER TABLE `tbl_course_ratings` DROP FOREIGN KEY `tbl_course_ratings_course_id_fkey`;

-- DropForeignKey
ALTER TABLE `tbl_courses` DROP FOREIGN KEY `tbl_courses_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `tbl_lessons` DROP FOREIGN KEY `tbl_lessons_course_id_fkey`;

-- DropForeignKey
ALTER TABLE `tbl_media_attachments` DROP FOREIGN KEY `tbl_media_attachments_lesson_id_fkey`;

-- DropForeignKey
ALTER TABLE `tbl_personal_tokens` DROP FOREIGN KEY `tbl_personal_tokens_user_id_fkey`;

-- DropIndex
DROP INDEX `tbl_course_ratings_course_id_fkey` ON `tbl_course_ratings`;

-- DropIndex
DROP INDEX `tbl_courses_user_id_fkey` ON `tbl_courses`;

-- DropIndex
DROP INDEX `tbl_lessons_course_id_fkey` ON `tbl_lessons`;

-- DropIndex
DROP INDEX `tbl_media_attachments_lesson_id_fkey` ON `tbl_media_attachments`;

-- DropIndex
DROP INDEX `tbl_personal_tokens_user_id_fkey` ON `tbl_personal_tokens`;

-- AddForeignKey
ALTER TABLE `tbl_personal_tokens` ADD CONSTRAINT `tbl_personal_tokens_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `tbl_users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_courses` ADD CONSTRAINT `tbl_courses_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `tbl_users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_course_ratings` ADD CONSTRAINT `tbl_course_ratings_course_id_fkey` FOREIGN KEY (`course_id`) REFERENCES `tbl_courses`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_lessons` ADD CONSTRAINT `tbl_lessons_course_id_fkey` FOREIGN KEY (`course_id`) REFERENCES `tbl_courses`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_media_attachments` ADD CONSTRAINT `tbl_media_attachments_lesson_id_fkey` FOREIGN KEY (`lesson_id`) REFERENCES `tbl_lessons`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
