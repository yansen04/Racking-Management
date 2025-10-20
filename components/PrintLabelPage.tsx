import React, { useMemo, useState } from 'react';
import QRCode from 'qrcode';

export function PrintLabelPage() {
  const [text, setText] = useState('SKU-001');
  const [size, setSize] = useState(128);

  const dataUrl = useMemo(() => {
    let cancelled = false;
    const controller = new AbortController();
    (async () => {
      try {
        const url = await QRCode.toDataURL(text, { width: size, margin: 1 });
        if (!cancelled) {
          const img = document.getElementById('qr-preview') as HTMLImageElement | null;
          if (img) img.src = url;
        }
      } catch (err) {
        console.error(err);
      }
    })();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [text, size]);

  const onPrint = () => {
    const w = window.open('', 'print');
    if (!w) return;
    const img = (document.getElementById('qr-preview') as HTMLImageElement | null)?.src || '';
    w.document.write(`<img src="${img}" style="width:${size}px;height:${size}px"/>`);
    w.document.close();
    w.focus();
    w.print();
    w.close();
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Print Label</h1>
      <div className="card p-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Text</label>
            <input className="w-full border rounded px-3 py-2" value={text} onChange={(e) => setText(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Size</label>
            <input
              type="number"
              min={64}
              max={512}
              className="w-full border rounded px-3 py-2"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
            />
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={onPrint}>
            Print
          </button>
        </div>
        <div className="flex items-center justify-center">
          <img id="qr-preview" alt="QR" className="border rounded p-2 bg-white" />
        </div>
      </div>
    </div>
  );
}
