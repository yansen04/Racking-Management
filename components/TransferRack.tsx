import React, { useEffect, useState } from 'react';
import type { Item, Location } from '../types';
import { toast } from 'sonner';

export function TransferRack() {
  const [items, setItems] = useState<Item[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [form, setForm] = useState<{ itemId: string; fromLocationId: string; toLocationId: string; qty: number }>({
    itemId: '',
    fromLocationId: '',
    toLocationId: '',
    qty: 1,
  });

  useEffect(() => {
    (async () => {
      const [it, loc] = await Promise.all([
        fetch('/api/items').then((r) => r.json()),
        fetch('/api/locations').then((r) => r.json()),
      ]);
      setItems(it);
      setLocations(loc);
    })();
  }, []);

  const transfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.itemId || !form.fromLocationId || !form.toLocationId || form.qty <= 0) {
      toast.error('Please complete the form');
      return;
    }
    if (form.fromLocationId === form.toLocationId) {
      toast.error('Source and destination cannot be the same');
      return;
    }
    const res = await fetch('/api/transfer', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: 'Failed to transfer' }));
      toast.error(error);
      return;
    }
    toast.success('Transfer recorded');
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Transfer Rack</h1>

      <form onSubmit={transfer} className="card p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Item</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={form.itemId}
              onChange={(e) => setForm((f) => ({ ...f, itemId: e.target.value }))}
            >
              <option value="">Select Item</option>
              {items.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.sku} — {i.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">From</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={form.fromLocationId}
              onChange={(e) => setForm((f) => ({ ...f, fromLocationId: e.target.value }))}
            >
              <option value="">Select Location</option>
              {locations.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.code}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">To</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={form.toLocationId}
              onChange={(e) => setForm((f) => ({ ...f, toLocationId: e.target.value }))}
            >
              <option value="">Select Location</option>
              {locations.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.code}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Quantity</label>
            <input
              type="number"
              min={1}
              className="w-full border rounded px-3 py-2"
              value={form.qty}
              onChange={(e) => setForm((f) => ({ ...f, qty: Number(e.target.value) }))}
            />
          </div>
        </div>
        <div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Transfer
          </button>
        </div>
      </form>
    </div>
  );
}
