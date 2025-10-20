import React, { useState } from 'react';
import type { Item } from '../types';

export function SkuSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Item[]>([]);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: call backend
    setResults([]);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">SKU Search</h1>

      <form onSubmit={onSearch} className="card p-4 space-y-3">
        <div className="flex gap-2">
          <input
            className="flex-1 border rounded px-3 py-2"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by SKU, name, or barcode"
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">
            Search
          </button>
        </div>
      </form>

      <div className="card">
        <div className="p-4 border-b text-sm text-gray-600">Results</div>
        <div className="p-4">
          {results.length === 0 ? (
            <div className="text-gray-500">No results</div>
          ) : (
            <ul className="space-y-2">
              {results.map((r) => (
                <li key={r.id} className="border rounded p-3">
                  <div className="font-medium">{r.sku} — {r.name}</div>
                  <div className="text-sm text-gray-500">{r.barcode || '—'}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
