import { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { X, Printer, Download } from 'lucide-react';
import QRCode from 'qrcode';

interface PrintLabelProps {
  data: {
    sku: string;
    receiveDate: string;
    noSuratJalan: string;
    location: string;
    qtyPcsPerPallet: number;
    vendor?: string;
    poNumber?: string;
  };
  onClose: () => void;
}

export function PrintLabel({ data, onClose }: PrintLabelProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  // Generate QR Code
  useEffect(() => {
    const generateQRCode = async () => {
      if (!data.sku || !data.location) {
        return;
      }

      // Create comprehensive QR code data
      const qrData = JSON.stringify({
        sku: data.sku,
        location: data.location,
        receiveDate: data.receiveDate,
        noSuratJalan: data.noSuratJalan,
        qtyPcs: data.qtyPcsPerPallet,
        vendor: data.vendor || '',
        poNumber: data.poNumber || '',
        timestamp: new Date().toISOString()
      });

      try {
        const url = await QRCode.toDataURL(qrData, {
          width: 200,
          margin: 1,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        setQrCodeUrl(url);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };

    generateQRCode();
  }, [data]);

  const handlePrint = () => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Label - ${data.sku}</title>
            <style>
              @page {
                size: 10cm 5cm;
                margin: 0;
              }
              body { 
                margin: 0; 
                padding: 0; 
                font-family: Arial, sans-serif;
              }
              .print-label { 
                width: 10cm; 
                height: 5cm; 
                border: 2px solid #000;
                padding: 8px;
                background: white;
                box-sizing: border-box;
              }
              .label-title {
                text-align: center;
                font-weight: bold;
                font-size: 14px;
                margin-bottom: 8px;
                border-bottom: 2px solid #000;
                padding-bottom: 4px;
              }
              .label-content {
                display: grid;
                grid-template-columns: 1fr 100px;
                gap: 8px;
                height: calc(100% - 35px);
              }
              .label-info div {
                margin-bottom: 3px;
                font-size: 11px;
              }
              .label-info strong {
                display: inline-block;
                width: 80px;
              }
              .label-qr {
                border: 1px solid #000;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                text-align: center;
                padding: 4px;
              }
              .qr-code-img {
                width: 80px;
                height: 80px;
              }
              .qr-label {
                font-size: 7px;
                margin-top: 2px;
              }
              @media print {
                body { margin: 0; padding: 0; }
                .print-label { margin: 0; border: none; }
              }
            </style>
          </head>
          <body>
            <div class="print-label">
              <div class="label-title">WAREHOUSE LABEL</div>
              <div class="label-content">
                <div class="label-info">
                  <div><strong>SKU:</strong> ${data.sku || 'N/A'}</div>
                  <div><strong>Date:</strong> ${data.receiveDate ? formatDate(data.receiveDate) : 'N/A'}</div>
                  <div><strong>Surat Jalan:</strong> ${data.noSuratJalan || 'N/A'}</div>
                  <div><strong>Location:</strong> ${data.location || 'N/A'}</div>
                  <div><strong>QTY PCS:</strong> ${data.qtyPcsPerPallet || 0}</div>
                  ${data.vendor ? `<div><strong>Vendor:</strong> ${data.vendor}</div>` : ''}
                  ${data.poNumber ? `<div><strong>PO:</strong> ${data.poNumber}</div>` : ''}
                </div>
                <div class="label-qr">
                  ${qrCodeUrl ? `<img src="${qrCodeUrl}" alt="QR Code" class="qr-code-img" />` : '<div>No QR Code</div>'}
                  <div class="qr-label">Scan for details</div>
                </div>
              </div>
            </div>
            <script>
              window.onload = function() {
                setTimeout(function() {
                  window.print();
                  window.close();
                }, 500);
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Print Label</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6">
          {/* Label Preview */}
          <div className="print-label border-2 border-gray-800 p-4 bg-white font-sans text-sm mb-6" style={{ width: '400px', height: '200px' }}>
            <div className="text-center font-bold text-lg mb-3 border-b-2 border-gray-800 pb-2">
              WAREHOUSE LABEL
            </div>
            
            <div className="grid grid-cols-[1fr_100px] gap-3 h-[calc(100%-45px)]">
              <div className="space-y-1">
                <div className="flex">
                  <span className="font-medium w-24">SKU:</span>
                  <span className="font-bold">{data.sku || 'N/A'}</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-24">Date:</span>
                  <span>{data.receiveDate ? formatDate(data.receiveDate) : 'N/A'}</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-24">Surat Jalan:</span>
                  <span>{data.noSuratJalan || 'N/A'}</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-24">Location:</span>
                  <span className="font-bold">{data.location || 'N/A'}</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-24">QTY PCS:</span>
                  <span className="font-bold">{data.qtyPcsPerPallet || 0}</span>
                </div>
                {data.vendor && (
                  <div className="flex">
                    <span className="font-medium w-24">Vendor:</span>
                    <span className="text-xs">{data.vendor}</span>
                  </div>
                )}
                {data.poNumber && (
                  <div className="flex">
                    <span className="font-medium w-24">PO:</span>
                    <span className="text-xs">{data.poNumber}</span>
                  </div>
                )}
              </div>
              
              <div className="border border-gray-800 flex items-center justify-center flex-col p-2">
                {qrCodeUrl ? (
                  <>
                    <img src={qrCodeUrl} alt="QR Code" className="w-20 h-20" />
                    <div className="text-[8px] mt-1">Scan for details</div>
                  </>
                ) : (
                  <div className="text-center">
                    <div className="w-16 h-16 border border-gray-400 flex items-center justify-center text-xs mb-1">
                      QR
                    </div>
                    <div className="text-[8px]">Generating...</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Print Actions */}
          <div className="flex gap-3">
            <Button onClick={handlePrint} className="flex-1">
              <Printer className="h-4 w-4 mr-2" />
              Print Label
            </Button>
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => {
                // Simple download functionality - in real app would generate actual PDF
                const element = document.createElement('a');
                const file = new Blob([`
WAREHOUSE LABEL
===============
SKU: ${data.sku || 'N/A'}
Receive Date: ${data.receiveDate ? formatDate(data.receiveDate) : 'N/A'}
Surat Jalan: ${data.noSuratJalan || 'N/A'}
Location: ${data.location || 'N/A'}
QTY PCS: ${data.qtyPcsPerPallet || 0}
QR Code: ${data.sku}-${data.location}
                `], {type: 'text/plain'});
                element.href = URL.createObjectURL(file);
                element.download = `label-${data.sku}-${data.location}.txt`;
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Download Label
            </Button>
          </div>

          <div className="mt-4 space-y-3">
            <div className="text-sm text-gray-600">
              <p>• Label akan dicetak dengan ukuran 10cm x 5cm</p>
              <p>• Pastikan printer telah diatur dengan kertas label yang sesuai</p>
              <p>• Gunakan browser print preview untuk memastikan format label sesuai</p>
            </div>

            {qrCodeUrl && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2 text-sm">QR Code berisi informasi:</h4>
                <div className="text-sm space-y-1 text-gray-700">
                  <p>• SKU: {data.sku}</p>
                  <p>• Location: {data.location}</p>
                  <p>• Receive Date: {data.receiveDate}</p>
                  <p>• Surat Jalan: {data.noSuratJalan || 'N/A'}</p>
                  <p>• Quantity: {data.qtyPcsPerPallet} pcs</p>
                  {data.vendor && <p>• Vendor: {data.vendor}</p>}
                  {data.poNumber && <p>• PO Number: {data.poNumber}</p>}
                  <p className="text-xs text-gray-500 mt-2">
                    * Scan QR code untuk melihat semua informasi lengkap
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-label, .print-label * {
            visibility: visible;
          }
          .print-label {
            position: absolute;
            left: 0;
            top: 0;
            width: 10cm;
            height: 5cm;
          }
        }
      `}</style>
    </div>
  );
}