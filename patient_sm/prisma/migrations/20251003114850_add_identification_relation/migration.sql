/*
  Warnings:

  - You are about to drop the column `identificationId` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `identificationType` on the `Patient` table. All the data in the column will be lost.
  - Added the required column `identificationTypeId` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "identificationId",
DROP COLUMN "identificationType",
ADD COLUMN     "identificationTypeId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_identificationTypeId_fkey" FOREIGN KEY ("identificationTypeId") REFERENCES "IdentificationType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
