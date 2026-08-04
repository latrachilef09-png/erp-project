import { PrismaClient, StockMovementType } from '@prisma/client';

const prisma = new PrismaClient();

async function rebuildStockLevels() {
  console.log('Deleting existing stock levels...');

  await prisma.stockLevel.deleteMany();

  console.log('Reading stock movements...');

  const movements = await prisma.stockMovement.findMany({
    orderBy: {
      createdAt: 'asc',
    },
  });

  for (const movement of movements) {
    const current = await prisma.stockLevel.findUnique({
      where: {
        productId_warehouseId: {
          productId: movement.productId,
          warehouseId: movement.warehouseId,
        },
      },
    });

    let quantity = current?.quantity ?? 0;

    if (movement.type === StockMovementType.IN) {
      quantity += movement.quantity;
    }

    if (movement.type === StockMovementType.OUT) {
      quantity -= movement.quantity;
    }

    await prisma.stockLevel.upsert({
      where: {
        productId_warehouseId: {
          productId: movement.productId,
          warehouseId: movement.warehouseId,
        },
      },

      update: {
        quantity,
      },

      create: {
        productId: movement.productId,
        warehouseId: movement.warehouseId,
        quantity,
      },
    });
  }

  console.log('Stock levels rebuilt successfully.');

  await prisma.$disconnect();
}

rebuildStockLevels();