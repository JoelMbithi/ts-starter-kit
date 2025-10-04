/*
  Warnings:

  - You are about to drop the column `primaryPhysicion` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `privacyConcent` on the `Patient` table. All the data in the column will be lost.
  - The `birthDate` column on the `Patient` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `disclosureConsent` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `primaryPhysician` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `privacyConsent` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `treatmentConsent` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `Patient` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "primaryPhysicion",
DROP COLUMN "privacyConcent",
ADD COLUMN     "disclosureConsent" BOOLEAN NOT NULL,
ADD COLUMN     "primaryPhysician" TEXT NOT NULL,
ADD COLUMN     "privacyConsent" BOOLEAN NOT NULL,
ADD COLUMN     "treatmentConsent" BOOLEAN NOT NULL,
ALTER COLUMN "name" SET NOT NULL,
DROP COLUMN "birthDate",
ADD COLUMN     "birthDate" TIMESTAMP(3),
ALTER COLUMN "identificationNumber" SET DATA TYPE TEXT,
ALTER COLUMN "identificationDocumentUrl" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" SET NOT NULL;
