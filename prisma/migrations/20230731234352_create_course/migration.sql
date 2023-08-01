/*
  Warnings:

  - You are about to drop the column `accepted_lesson_template_ids` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `lesson_card_template_id` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `courses` table. All the data in the column will be lost.
  - Added the required column `classSize` to the `courses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `courses` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "courses" DROP CONSTRAINT "courses_user_id_fkey";

-- AlterTable
ALTER TABLE "courses" DROP COLUMN "accepted_lesson_template_ids";
ALTER TABLE "courses" DROP COLUMN "lesson_card_template_id";
ALTER TABLE "courses" DROP COLUMN "user_id";
ALTER TABLE "courses" ADD COLUMN     "classSize" STRING NOT NULL;
ALTER TABLE "courses" ADD COLUMN     "modality" STRING DEFAULT 'Hybrid';
ALTER TABLE "courses" ADD COLUMN     "tone" STRING DEFAULT 'Friendly';
ALTER TABLE "courses" ADD COLUMN     "userId" INT4 NOT NULL;
ALTER TABLE "courses" ALTER COLUMN "language" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
