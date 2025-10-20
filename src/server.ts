import express from 'express';
import cors from 'cors';
import { PrismaClient, MovementType } from '../generated/prisma';
import { z } from 'zod';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Health
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// Warehouses
app.get('/api/warehouses', async (_req, res) => {
  const data = await prisma.warehouse.findMany({ orderBy: { code: 'asc' } });
  res.json(data);
});

app.post('/api/warehouses', async (req, res) => {
  const schema = z.object({ code: z.string().min(1), name: z.string().min(1), address: z.string().optional() });
  const body = schema.parse(req.body);
  const created = await prisma.warehouse.create({ data: body });
  res.json(created);
});

// Locations
app.get('/api/locations', async (_req, res) => {
  const data = await prisma.location.findMany({ include: { warehouse: true } });
  res.json(data);
});

app.post('/api/locations', async (req, res) => {
  const schema = z.object({ code: z.string().min(1), description: z.string().optional(), warehouseId: z.string().min(1) });
  const body = schema.parse(req.body);
  const created = await prisma.location.create({ data: body });
  res.json(created);
});

// Items
app.get('/api/items', async (_req, res) => {
  const data = await prisma.item.findMany({ orderBy: { sku: 'asc' } });
  res.json(data);
});

app.post('/api/items', async (req, res) => {
  const schema = z.object({ sku: z.string().min(1), name: z.string().min(1), barcode: z.string().optional() });
  const body = schema.parse(req.body);
  const created = await prisma.item.create({ data: body });
  res.json(created);
});

// Inventory operations
app.get('/api/inventory', async (_req, res) => {
  const data = await prisma.inventory.findMany({ include: { item: true, location: true } });
  res.json(data);
});

app.post('/api/placement', async (req, res) => {
  const schema = z.object({ itemId: z.string(), locationId: z.string(), qty: z.number().int().positive() });
  const { itemId, locationId, qty } = schema.parse(req.body);

  const inv = await prisma.inventory.upsert({
    where: { itemId_locationId: { itemId, locationId } },
    create: { itemId, locationId, quantity: qty },
    update: { quantity: { increment: qty } },
  });

  await prisma.movement.create({ data: { type: MovementType.PLACEMENT, itemId, toLocationId: locationId, quantity: qty } });
  res.json(inv);
});

app.post('/api/retrieval', async (req, res) => {
  const schema = z.object({ itemId: z.string(), locationId: z.string(), qty: z.number().int().positive() });
  const { itemId, locationId, qty } = schema.parse(req.body);

  const current = await prisma.inventory.findUnique({ where: { itemId_locationId: { itemId, locationId } } });
  if (!current || current.quantity < qty) return res.status(400).json({ error: 'Insufficient quantity' });

  const inv = await prisma.inventory.update({ where: { itemId_locationId: { itemId, locationId } }, data: { quantity: { decrement: qty } } });
  await prisma.movement.create({ data: { type: MovementType.RETRIEVAL, itemId, fromLocationId: locationId, quantity: qty } });
  res.json(inv);
});

app.post('/api/transfer', async (req, res) => {
  const schema = z.object({ itemId: z.string(), fromLocationId: z.string(), toLocationId: z.string(), qty: z.number().int().positive() });
  const { itemId, fromLocationId, toLocationId, qty } = schema.parse(req.body);
  if (fromLocationId === toLocationId) return res.status(400).json({ error: 'Source and destination cannot be the same' });

  const current = await prisma.inventory.findUnique({ where: { itemId_locationId: { itemId, locationId: fromLocationId } } });
  if (!current || current.quantity < qty) return res.status(400).json({ error: 'Insufficient quantity' });

  await prisma.$transaction([
    prisma.inventory.update({ where: { itemId_locationId: { itemId, locationId: fromLocationId } }, data: { quantity: { decrement: qty } } }),
    prisma.inventory.upsert({ where: { itemId_locationId: { itemId, locationId: toLocationId } }, create: { itemId, locationId: toLocationId, quantity: qty }, update: { quantity: { increment: qty } } }),
    prisma.movement.create({ data: { type: MovementType.TRANSFER, itemId, fromLocationId, toLocationId, quantity: qty } }),
  ]);

  res.json({ ok: true });
});

// Search
app.get('/api/search', async (req, res) => {
  const q = String(req.query.q || '').trim();
  if (!q) return res.json([]);
  const data = await prisma.item.findMany({
    where: { OR: [{ sku: { contains: q, mode: 'insensitive' } }, { name: { contains: q, mode: 'insensitive' } }, { barcode: { contains: q, mode: 'insensitive' } }] },
    take: 20,
  });
  res.json(data);
});

const port = Number(process.env.PORT || 8787);
app.listen(port, () => console.log(`API running on http://localhost:${port}`));
