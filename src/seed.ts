import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

async function main() {
  // Warehouses
  const wh1 = await prisma.warehouse.upsert({ where: { code: 'WH-A' }, update: {}, create: { code: 'WH-A', name: 'Warehouse A' } });
  const wh2 = await prisma.warehouse.upsert({ where: { code: 'WH-B' }, update: {}, create: { code: 'WH-B', name: 'Warehouse B' } });

  // Locations
  const l1 = await prisma.location.upsert({ where: { code_warehouseId: { code: 'R1-A1-01', warehouseId: wh1.id } }, update: {}, create: { code: 'R1-A1-01', warehouseId: wh1.id, description: 'Row 1 Aisle 1 Bin 01' } });
  const l2 = await prisma.location.upsert({ where: { code_warehouseId: { code: 'R1-A1-02', warehouseId: wh1.id } }, update: {}, create: { code: 'R1-A1-02', warehouseId: wh1.id } });
  const l3 = await prisma.location.upsert({ where: { code_warehouseId: { code: 'R2-B1-01', warehouseId: wh2.id } }, update: {}, create: { code: 'R2-B1-01', warehouseId: wh2.id } });

  // Items
  const it1 = await prisma.item.upsert({ where: { sku: 'SKU-001' }, update: {}, create: { sku: 'SKU-001', name: 'Sample Item 1', barcode: '1234567890123' } });
  const it2 = await prisma.item.upsert({ where: { sku: 'SKU-002' }, update: {}, create: { sku: 'SKU-002', name: 'Sample Item 2' } });

  // Inventory
  await prisma.inventory.upsert({ where: { itemId_locationId: { itemId: it1.id, locationId: l1.id } }, update: { quantity: 50 }, create: { itemId: it1.id, locationId: l1.id, quantity: 50 } });
  await prisma.inventory.upsert({ where: { itemId_locationId: { itemId: it2.id, locationId: l2.id } }, update: { quantity: 20 }, create: { itemId: it2.id, locationId: l2.id, quantity: 20 } });
}

main().then(() => prisma.$disconnect()).catch((e) => { console.error(e); return prisma.$disconnect(); });
