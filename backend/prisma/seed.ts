import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("123456", 10);

  const user = await prisma.user.upsert({
    where: { username: "admin" },
    update: { passwordHash },
    create: { username: "admin", passwordHash },
  });

  console.log(`Usuário de demonstração: ${user.username} / 123456`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
