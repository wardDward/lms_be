/*
  Warnings:

  - You are about to drop the `CourseRating` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `CourseRating` DROP FOREIGN KEY `CourseRating_course_id_fkey`;

-- DropTable
DROP TABLE `CourseRating`;

-- CreateTable
CREATE TABLE `tbl_course_ratings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `course_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tbl_course_ratings` ADD CONSTRAINT `tbl_course_ratings_course_id_fkey` FOREIGN KEY (`course_id`) REFERENCES `tbl_courses`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
