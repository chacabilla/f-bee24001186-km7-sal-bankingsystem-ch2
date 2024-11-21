/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `password_resets` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "password_resets_email_key" ON "password_resets"("email");
