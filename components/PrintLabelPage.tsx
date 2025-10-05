import { useState, useRef, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Printer, QrCode, Download } from 'lucide-react';
import QRCode from 'qrcode';

interface LabelData {
  sku: string;
  receiveDate: string;
  noSuratJalan: string;
  location: string;
  qtyPcsPerPallet: number;
  vendor?: string;
  poNumber?: string;
}

export function PrintLabelPage() {
  const [labelData, setLabelData] = useState<LabelData>({
    sku: '',
    receiveDate: new Date().toISOString().split('T')[0],
    noSuratJalan: '',
    location: '',
    qtyPcsPerPallet: 0,
    vendor: '',
    poNumber: ''
  });

  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Mock data
  const mockLocations = ['SA100', 'SA150', 'SA200', 'SA250', 'SA300', 'SA366'];
  const mockSKUs = ['99001A', '99002B', '99003C', '88001X', '88002Y'];

  // Generate QR Code whenever data changes
  useEffect(() => {
    const generateQRCode = async () => {
      if (!labelData.sku || !labelData.location) {
        setQrCodeUrl('');
        return;
      }

      // Create comprehensive QR code data
      const qrData = JSON.stringify({
        sku: labelData.sku,
        location: labelData.location,
        receiveDate: labelData.receiveDate,
        noSuratJalan: labelData.noSuratJalan,
        qtyPcs: labelData.qtyPcsPerPallet,
        vendor: labelData.vendor || '',
        poNumber: labelData.poNumber || '',
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
  }, [labelData]);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: '2-digit'
    });
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Label - ${labelData.sku}</title>
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
                word-break: break-all;
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
                  <div><strong>SKU:</strong> ${labelData.sku || 'N/A'}</div>
                  <div><strong>Date:</strong> ${labelData.receiveDate ? formatDate(labelData.receiveDate) : 'N/A'}</div>
                  <div><strong>Surat Jalan:</strong> ${labelData.noSuratJalan || 'N/A'}</div>
                  <div><strong>Location:</strong> ${labelData.location || 'N/A'}</div>
                  <div><strong>QTY PCS:</strong> ${labelData.qtyPcsPerPallet || 0}</div>
                  ${labelData.vendor ? `<div><strong>Vendor:</strong> ${labelData.vendor}</div>` : ''}
                  ${labelData.poNumber ? `<div><strong>PO:</strong> ${labelData.poNumber}</div>` : ''}
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

  const handleDownload = () => {
    if (!qrCodeUrl) {
      alert('Please fill in SKU and Location to generate QR code');
      return;
    }

    const element = document.createElement('a');
    element.href = qrCodeUrl;
    element.download = `qrcode-${labelData.sku}-${labelData.location}.png`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const isFormValid = labelData.sku && labelData.location && labelData.qtyPcsPerPallet > 0;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Print Label</h1>
        <p className="text-gray-600">Generate and print labels with QR codes for warehouse items</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Label Form */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <QrCode className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Label Information</h3>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sku">SKU *</Label>
                <Select 
                  value={labelData.sku} 
                  onValueChange={(value) => setLabelData(prev => ({ ...prev, sku: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select SKU" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockSKUs.map((sku) => (
                      <SelectItem key={sku} value={sku}>
                        {sku}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="location">Location Rack *</Label>
                <Select 
                  value={labelData.location} 
                  onValueChange={(value) => setLabelData(prev => ({ ...prev, location: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockLocations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="receiveDate">Receive Date</Label>
                <Input
                  type="date"
                  id="receiveDate"
                  value={labelData.receiveDate}
                  onChange={(e) => setLabelData(prev => ({ ...prev, receiveDate: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="noSuratJalan">No. Surat Jalan</Label>
                <Input
                  id="noSuratJalan"
                  value={labelData.noSuratJalan}
                  onChange={(e) => setLabelData(prev => ({ ...prev, noSuratJalan: e.target.value }))}
                  placeholder="Enter delivery note"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="qtyPcs">QTY PCS *</Label>
                <Input
                  type="number"
                  id="qtyPcs"
                  min="1"
                  value={labelData.qtyPcsPerPallet}
                  onChange={(e) => setLabelData(prev => ({ ...prev, qtyPcsPerPallet: parseInt(e.target.value) || 0 }))}
                  placeholder="Enter quantity"
                />
              </div>

              <div>
                <Label htmlFor="vendor">Vendor (Optional)</Label>
                <Input
                  id="vendor"
                  value={labelData.vendor}
                  onChange={(e) => setLabelData(prev => ({ ...prev, vendor: e.target.value }))}
                  placeholder="Enter vendor name"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="poNumber">PO Number (Optional)</Label>
              <Input
                id="poNumber"
                value={labelData.poNumber}
                onChange={(e) => setLabelData(prev => ({ ...prev, poNumber: e.target.value }))}
                placeholder="Enter PO number"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                onClick={handlePrint} 
                disabled={!isFormValid}
                className="flex-1"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print Label
              </Button>
              <Button 
                variant="outline" 
                onClick={handleDownload}
                disabled={!qrCodeUrl}
              >
                <Download className="h-4 w-4 mr-2" />
                Download QR
              </Button>
            </div>

            <div className="text-sm text-gray-600 space-y-1">
              <p>• Label size: 10cm x 5cm</p>
              <p>• QR code contains: SKU, Location, Date, Qty, and more</p>
              <p>• Scan QR code to view complete item details</p>
            </div>
          </div>
        </Card>

        {/* Label Preview */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Label Preview</h3>
          
          <div className="flex justify-center">
            <div 
              className="border-2 border-gray-800 p-4 bg-white font-sans" 
              style={{ width: '400px', height: '200px' }}
            >
              <div className="text-center font-bold text-lg mb-3 border-b-2 border-gray-800 pb-2">
                WAREHOUSE LABEL
              </div>
              
              <div className="grid grid-cols-[1fr_100px] gap-3 h-[calc(100%-45px)]">
                <div className="space-y-1 text-sm">
                  <div className="flex">
                    <span className="font-medium w-24">SKU:</span>
                    <span className="font-bold">{labelData.sku || 'N/A'}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-24">Date:</span>
                    <span>{labelData.receiveDate ? formatDate(labelData.receiveDate) : 'N/A'}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-24">Surat Jalan:</span>
                    <span>{labelData.noSuratJalan || 'N/A'}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-24">Location:</span>
                    <span className="font-bold">{labelData.location || 'N/A'}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-24">QTY PCS:</span>
                    <span className="font-bold">{labelData.qtyPcsPerPallet || 0}</span>
                  </div>
                  {labelData.vendor && (
                    <div className="flex">
                      <span className="font-medium w-24">Vendor:</span>
                      <span className="text-xs">{labelData.vendor}</span>
                    </div>
                  )}
                  {labelData.poNumber && (
                    <div className="flex">
                      <span className="font-medium w-24">PO:</span>
                      <span className="text-xs">{labelData.poNumber}</span>
                    </div>
                  )}
                </div>
                
                <div className="border border-gray-800 flex items-center justify-center flex-col p-2">
                  {qrCodeUrl ? (
                    <>
                      <img src={qrCodeUrl} alt="QR Code" className="w-20 h-20" />
                      <div className="text-[8px] mt-1 text-center">Scan for details</div>
                    </>
                  ) : (
                    <div className="text-center">
                      <div className="w-16 h-16 border border-gray-400 flex items-center justify-center text-xs mb-1">
                        QR
                      </div>
                      <div className="text-[8px]">Fill form to generate</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* QR Code Data Info */}
          {qrCodeUrl && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">QR Code Data:</h4>
              <div className="text-sm space-y-1 text-gray-700">
                <p>• SKU: {labelData.sku}</p>
                <p>• Location: {labelData.location}</p>
                <p>• Receive Date: {labelData.receiveDate}</p>
                <p>• Surat Jalan: {labelData.noSuratJalan || 'N/A'}</p>
                <p>• Quantity: {labelData.qtyPcsPerPallet} pcs</p>
                {labelData.vendor && <p>• Vendor: {labelData.vendor}</p>}
                {labelData.poNumber && <p>• PO Number: {labelData.poNumber}</p>}
                <p className="text-xs text-gray-500 mt-2">
                  * Scan QR code dengan barcode scanner atau smartphone untuk melihat semua informasi
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}
