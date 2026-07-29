import { PrismaClient, RoleName } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.role.createMany({
    data: [
      { name: RoleName.ADMIN },
      { name: RoleName.STOCK_MANAGER },
      { name: RoleName.VIEWER },
    ],
    skipDuplicates: true,
  });

  console.log('Roles created.');
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });