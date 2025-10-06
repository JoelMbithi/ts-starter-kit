/*
  Warnings:

  - You are about to drop the `Doctors` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `IdentificationType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Patient` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Patient" DROP CONSTRAINT "Patient_identificationTypeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Patient" DROP CONSTRAINT "Patient_userId_fkey";

-- DropTable
DROP TABLE "public"."Doctors";

-- DropTable
DROP TABLE "public"."IdentificationType";

-- DropTable
DROP TABLE "public"."Patient";

-- CreateTable
CREATE TABLE "patients" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "treatmentConsent" BOOLEAN NOT NULL,
    "disclosureConsent" BOOLEAN NOT NULL,
    "privacyConsent" BOOLEAN NOT NULL,
    "gender" TEXT,
    "birthDate" TIMESTAMP(3),
    "address" TEXT NOT NULL,
    "occupation" TEXT NOT NULL,
    "emergencyContactName" TEXT NOT NULL,
    "emergencyContactNumber" TEXT NOT NULL,
    "insuranceProvider" TEXT NOT NULL,
    "insurancePolicyNumber" TEXT NOT NULL,
    "allergies" TEXT NOT NULL,
    "currentMedication" TEXT NOT NULL,
    "familyMedicalHistory" TEXT NOT NULL,
    "pastMedicalHistory" TEXT NOT NULL,
    "identificationTypeId" INTEGER NOT NULL,
    "identificationNumber" TEXT NOT NULL,
    "identificationDocumentUrl" TEXT,
    "primaryPhysician" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "patients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctors" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "doctors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identification_types" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "identification_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appointments" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "notes" TEXT,
    "patientId" INTEGER NOT NULL,
    "doctorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "patients_email_key" ON "patients"("email");

-- CreateIndex
CREATE UNIQUE INDEX "doctors_name_key" ON "doctors"("name");

-- CreateIndex
CREATE UNIQUE INDEX "identification_types_name_key" ON "identification_types"("name");

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_identificationTypeId_fkey" FOREIGN KEY ("identificationTypeId") REFERENCES "identification_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
