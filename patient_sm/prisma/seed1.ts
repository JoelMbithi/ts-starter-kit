import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const IdentificationTypes = [
  "Birth Certificate",
  "Driver's License",
  "Medical Insurance Card/Policy",
  "Military ID Card",
  "National Identity Card",
  "Passport",
  "Resident Alien Card (Green Card)",
  "Social Security Card",
  "State ID Card",
  "Student ID Card",
  "Voter ID Card",
];

async function main() {
  for (const typeName of IdentificationTypes) {
    const saved = await prisma.identificationType.upsert({
      where: { name: typeName }, // make sure `name` is @unique in your schema
      update: {},
      create: { name: typeName },
    });
    console.log(`Inserted: ${saved.name}`);
  }
  console.log("Identification types seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding identification types:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
