export interface Warehouse {
  id: string;
  code: string;
  name: string;
  address?: string;
  createdAt: string;
}

export interface Location {
  id: string;
  code: string;
  description?: string;
  warehouseId: string;
  createdAt: string;
}

export interface Item {
  id: string;
  sku: string;
  name: string;
  barcode?: string;
  createdAt: string;
}

export interface InventoryRecord {
  id: string;
  itemId: string;
  locationId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export type MovementType = 'PLACEMENT' | 'RETRIEVAL' | 'TRANSFER';

export interface Movement {
  id: string;
  type: MovementType;
  itemId: string;
  fromLocationId?: string | null;
  toLocationId?: string | null;
  quantity: number;
  createdAt: string;
}
