/*
  Warnings:

  - You are about to drop the column `reset_password_expires` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `reset_password_token` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "reset_password_expires",
DROP COLUMN "reset_password_token";
