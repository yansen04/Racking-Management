import React from 'react';

export function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4">
          <div className="text-sm text-gray-500">Total SKUs</div>
          <div className="text-2xl font-bold">—</div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-gray-500">Locations</div>
          <div className="text-2xl font-bold">—</div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-gray-500">Total Quantity</div>
          <div className="text-2xl font-bold">—</div>
        </div>
      </div>
    </div>
  );
}
