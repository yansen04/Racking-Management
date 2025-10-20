import React, { useEffect, useState } from 'react';
import type { Item } from '../types';
import { toast } from 'sonner';

export function SkuMaster() {
  const [items, setItems] = useState<Item[]>([]);
  const [form, setForm] = useState<{ sku: string; name: string; barcode?: string }>({ sku: '', name: '', barcode: '' });

  useEffect(() => {
    (async () => {
      const data = await fetch('/api/items').then((r) => r.json());
      setItems(data);
    })();
  }, []);

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.sku || !form.name) {
      toast.error('SKU and Name are required');
      return;
    }
    const res = await fetch('/api/items', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    if (!res.ok) {
      toast.error('Failed to add item');
      return;
    }
    const created: Item = await res.json();
    setItems((prev) => [created, ...prev]);
    setForm({ sku: '', name: '', barcode: '' });
    toast.success('Item added');
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">SKU Master</h1>

      <form onSubmit={addItem} className="card p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">SKU</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={form.sku}
              onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))}
              placeholder="SKU-001"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Name</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Sample Product"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Barcode</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={form.barcode}
              onChange={(e) => setForm((f) => ({ ...f, barcode: e.target.value }))}
              placeholder="1234567890123"
            />
          </div>
        </div>
        <div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Add Item
          </button>
        </div>
      </form>

      <div className="card">
        <div className="p-4 border-b text-sm text-gray-600">Items</div>
        <div className="p-4 overflow-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="py-2 pr-4">SKU</th>
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Barcode</th>
                <th className="py-2 pr-4">Created</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id} className="border-t">
                  <td className="py-2 pr-4">{it.sku}</td>
                  <td className="py-2 pr-4">{it.name}</td>
                  <td className="py-2 pr-4">{it.barcode || '—'}</td>
                  <td className="py-2 pr-4">{new Date(it.createdAt).toLocaleString()}</td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td className="py-6 text-gray-500" colSpan={4}>
                    No items yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
