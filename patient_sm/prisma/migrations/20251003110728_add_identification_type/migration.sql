/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Doctors` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "IdentificationType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "IdentificationType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "IdentificationType_name_key" ON "IdentificationType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Doctors_name_key" ON "Doctors"("name");
