import { PrismaClient, RoleName, WarehouseType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {

  // Seed roles
  await prisma.role.createMany({
    data: [
      { name: RoleName.ADMIN },
      { name: RoleName.STOCK_MANAGER },
      { name: RoleName.VIEWER },
    ],
    skipDuplicates: true,
  });

  console.log('Roles created.');


  // Seed warehouses
  await prisma.warehouse.createMany({
    data: [
      {
        name: 'Principal Warehouse',
        type: WarehouseType.PRINCIPAL,
        description: 'Main storage warehouse',
      },
      {
        name: 'Production Warehouse',
        type: WarehouseType.PRODUCTION,
        description: 'Production area storage',
      },
      {
        name: 'Distribution Warehouse',
        type: WarehouseType.DISTRIBUTION,
        description: 'Distribution storage',
      },
      {
        name: 'Retour Warehouse',
        type: WarehouseType.RETOUR,
        description: 'Returned products storage',
      },
      {
        name: 'Rebut Warehouse',
        type: WarehouseType.REBUT,
        description: 'Damaged products storage',
      },
    ],
    skipDuplicates: true,
  });


  console.log('Warehouses created.');

}


main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });