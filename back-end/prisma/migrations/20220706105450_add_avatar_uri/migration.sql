/*
  Warnings:

  - Added the required column `avatarURI` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatarURI" TEXT NOT NULL;
