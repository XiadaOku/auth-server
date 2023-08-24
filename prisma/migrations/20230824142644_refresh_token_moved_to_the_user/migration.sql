/*
  Warnings:

  - You are about to drop the column `isRefresh` on the `token` table. All the data in the column will be lost.
  - Added the required column `refreshToken` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "token" DROP COLUMN "isRefresh";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "refreshToken" TEXT NOT NULL;
