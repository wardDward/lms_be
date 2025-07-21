/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `tbl_courses` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `tbl_courses_uuid_key` ON `tbl_courses`(`uuid`);
