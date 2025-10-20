import React, { useEffect, useState } from 'react';
import type { Location, Warehouse } from '../types';
import { toast } from 'sonner';

export function LocationMaster() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [form, setForm] = useState<{ code: string; description: string; warehouseId: string }>({
    code: '',
    description: '',
    warehouseId: '',
  });

  useEffect(() => {
    (async () => {
      const [wh, loc] = await Promise.all([
        fetch('/api/warehouses').then((r) => r.json()),
        fetch('/api/locations').then((r) => r.json()),
      ]);
      setWarehouses(wh);
      setLocations(loc);
    })();
  }, []);

  const addLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code || !form.warehouseId) {
      toast.error('Code and Warehouse are required');
      return;
    }
    const res = await fetch('/api/locations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    if (!res.ok) {
      toast.error('Failed to add location');
      return;
    }
    const created: Location = await res.json();
    setLocations((prev) => [created, ...prev]);
    setForm({ code: '', description: '', warehouseId: '' });
    toast.success('Location added');
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Location Master</h1>

      <form onSubmit={addLocation} className="card p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Code</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={form.code}
              onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
              placeholder="R1-A1-01"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Description</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Rack Row 1, Aisle 1, Bin 01"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Warehouse</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={form.warehouseId}
              onChange={(e) => setForm((f) => ({ ...f, warehouseId: e.target.value }))}
            >
              <option value="">Select Warehouse</option>
              {warehouses.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.code} — {w.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Add Location
          </button>
        </div>
      </form>

      <div className="card">
        <div className="p-4 border-b text-sm text-gray-600">Locations</div>
        <div className="p-4 overflow-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="py-2 pr-4">Code</th>
                <th className="py-2 pr-4">Description</th>
                <th className="py-2 pr-4">Warehouse</th>
                <th className="py-2 pr-4">Created</th>
              </tr>
            </thead>
            <tbody>
              {locations.map((loc) => (
                <tr key={loc.id} className="border-t">
                  <td className="py-2 pr-4">{loc.code}</td>
                  <td className="py-2 pr-4">{loc.description}</td>
                  <td className="py-2 pr-4">{loc.warehouseId}</td>
                  <td className="py-2 pr-4">{new Date(loc.createdAt).toLocaleString()}</td>
                </tr>
              ))}
              {locations.length === 0 && (
                <tr>
                  <td className="py-6 text-gray-500" colSpan={4}>
                    No locations yet
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
