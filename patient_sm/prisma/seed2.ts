import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma.config";

async function seedAdmin() {
  const hashed = await bcrypt.hash("Joe904", 10);
  await prisma.admin.create({
    data: { email: "joellembithi@gmail.com", passKey: hashed },
  });
}

seedAdmin();
