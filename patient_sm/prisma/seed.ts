import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const Doctors = [
  { image: "/assets/images/dr-green.png", name: "John Green" },
  { image: "/assets/images/dr-cameron.png", name: "Leila Cameron" },
  { image: "/assets/images/dr-livingston.png", name: "David Livingston" },
  { image: "/assets/images/dr-peter.png", name: "Evan Peter" },
  { image: "/assets/images/dr-powell.png", name: "Jane Powell" },
  { image: "/assets/images/dr-remirez.png", name: "Alex Ramirez" },
  { image: "/assets/images/dr-lee.png", name: "Jasmine Lee" },
  { image: "/assets/images/dr-cruz.png", name: "Alyana Cruz" },
  { image: "/assets/images/dr-sharma.png", name: "Hardik Sharma" },
];

async function main() {
  for (const doctor of Doctors) {
    const saved = await prisma.doctors.upsert({
      where: { name: doctor.name }, // relies on @unique
      update: {},
      create: doctor,
    });
    console.log(` Inserted: ${saved.name}`);
  }
  console.log(" Doctors seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding doctors:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
