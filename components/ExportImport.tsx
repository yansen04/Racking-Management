import React, { useRef } from 'react';

export function ExportImport() {
  const fileRef = useRef<HTMLInputElement | null>(null);

  const onExport = () => {
    // TODO: call backend export
    const blob = new Blob([JSON.stringify({ items: [], locations: [] }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'export.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const onImport = () => {
    fileRef.current?.click();
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    // TODO: send to backend
    console.log('Imported file content (preview):', text.slice(0, 200));
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Export / Import</h1>

      <div className="card p-4 flex gap-3">
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={onExport}>
          Export JSON
        </button>
        <button className="bg-gray-700 text-white px-4 py-2 rounded" onClick={onImport}>
          Import JSON
        </button>
        <input ref={fileRef} type="file" className="hidden" accept="application/json" onChange={onFileChange} />
      </div>
    </div>
  );
}
