import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Upload, Download, FileText, AlertCircle, CheckCircle, X } from 'lucide-react';

interface ImportResult {
  id: number;
  filename: string;
  type: string;
  status: 'success' | 'error' | 'processing';
  records: number;
  errors: string[];
  timestamp: string;
}

export function ExportImport() {
  const [importResults, setImportResults] = useState<ImportResult[]>([
    {
      id: 1,
      filename: 'master_po_20250103.csv',
      type: 'PO Master',
      status: 'success',
      records: 25,
      errors: [],
      timestamp: '2025-01-03 14:30:00'
    },
    {
      id: 2,
      filename: 'master_sku_20250102.csv',
      type: 'SKU Master',
      status: 'error',
      records: 0,
      errors: ['Invalid SKU format in row 5', 'Missing vendor information in row 12'],
      timestamp: '2025-01-02 16:15:00'
    }
  ]);

  const handleFileUpload = (type: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newResult: ImportResult = {
        id: importResults.length + 1,
        filename: file.name,
        type: type,
        status: 'processing',
        records: 0,
        errors: [],
        timestamp: new Date().toLocaleString()
      };
      
      setImportResults([newResult, ...importResults]);
      
      // Simulate processing
      setTimeout(() => {
        setImportResults(prev => prev.map(result => 
          result.id === newResult.id 
            ? { ...result, status: 'success', records: Math.floor(Math.random() * 50) + 10 }
            : result
        ));
      }, 2000);
    }
  };

  const exportMasterData = (type: string) => {
    // Mock export data
    let csvData = '';
    let filename = '';
    
    switch (type) {
      case 'po':
        csvData = `PO Number,Vendor,Date Created,Status,Total Items
PO224662,PT TRESNO BUKO,2025-01-01,ACTIVE,3
PO224663,PT THERMAL INDO,2025-01-02,ACTIVE,2
PO224664,PT SUGAR WORKS,2025-01-03,CLOSED,1`;
        filename = 'master_po_export.csv';
        break;
      
      case 'rack':
        csvData = `Location,Level,Max Pallets,Category,Status
SA100,Level 1,2,ACTIVE,AVAILABLE
SA150,Level 1,2,ACTIVE,FULL
SA200,Level 2,2,ACTIVE,AVAILABLE
SA250,Level 2,2,THERMAL,FULL
SA300,Level 3,2,FROZEN,FULL`;
        filename = 'master_rack_export.csv';
        break;
        
      case 'sku':
        csvData = `SKU ID,SKU Name,Category,Unit,Vendor
99001A,THERMAL SUGAR WATER,THERMAL,PCS,PT TRESNO BUKO
99002B,THERMAL SUGAR WATER+,THERMAL,PCS,PT THERMAL INDO
99003C,THERMAL WATER,ACTIVE,PCS,PT SUGAR WORKS
99004D,FROZEN SUGAR WATER,FROZEN,PCS,PT FROZEN INDO`;
        filename = 'master_sku_export.csv';
        break;
    }
    
    // Download CSV
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <X className="h-4 w-4 text-red-600" />;
      case 'processing':
        return <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-500">SUCCESS</Badge>;
      case 'error':
        return <Badge variant="destructive">ERROR</Badge>;
      case 'processing':
        return <Badge variant="outline" className="border-blue-500 text-blue-600">PROCESSING</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold">Export-Import Master</h1>
          <p className="text-gray-600">Manage master data for PO, Rack locations, and SKU information</p>
        </div>
      </div>

      <Tabs defaultValue="export" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="export">Export Data</TabsTrigger>
          <TabsTrigger value="import">Import Data</TabsTrigger>
        </TabsList>

        <TabsContent value="export">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Master PO Export */}
            <Card className="p-6">
              <div className="text-center space-y-4">
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Master PO</h3>
                  <p className="text-sm text-gray-600">Export all Purchase Order data</p>
                </div>
                <Button 
                  onClick={() => exportMasterData('po')}
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export PO Data
                </Button>
                <div className="text-xs text-gray-500">
                  Includes: PO Number, Vendor, Date, Status, Items
                </div>
              </div>
            </Card>

            {/* Master Rack Export */}
            <Card className="p-6">
              <div className="text-center space-y-4">
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Master Rack</h3>
                  <p className="text-sm text-gray-600">Export all rack location data</p>
                </div>
                <Button 
                  onClick={() => exportMasterData('rack')}
                  className="w-full"
                  variant="outline"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Rack Data
                </Button>
                <div className="text-xs text-gray-500">
                  Includes: Location, Level, Capacity, Category, Status
                </div>
              </div>
            </Card>

            {/* Master SKU Export */}
            <Card className="p-6">
              <div className="text-center space-y-4">
                <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto">
                  <FileText className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Master SKU</h3>
                  <p className="text-sm text-gray-600">Export all SKU master data</p>
                </div>
                <Button 
                  onClick={() => exportMasterData('sku')}
                  className="w-full"
                  variant="outline"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export SKU Data
                </Button>
                <div className="text-xs text-gray-500">
                  Includes: SKU ID, Name, Category, Unit, Vendor
                </div>
              </div>
            </Card>
          </div>

          {/* Export Templates */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Download Import Templates</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="justify-start">
                <Download className="h-4 w-4 mr-2" />
                PO Template.csv
              </Button>
              <Button variant="outline" className="justify-start">
                <Download className="h-4 w-4 mr-2" />
                Rack Template.csv
              </Button>
              <Button variant="outline" className="justify-start">
                <Download className="h-4 w-4 mr-2" />
                SKU Template.csv
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="import">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Master PO Import */}
            <Card className="p-6">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Upload className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold">Import Master PO</h3>
                  <p className="text-sm text-gray-600">Upload CSV file with PO data</p>
                </div>
                
                <div>
                  <Label htmlFor="po-upload">Choose CSV File</Label>
                  <Input
                    id="po-upload"
                    type="file"
                    accept=".csv"
                    onChange={(e) => handleFileUpload('PO Master', e)}
                  />
                </div>
                
                <div className="text-xs text-gray-500">
                  Format: PO Number, Vendor, Date, Status, Items
                </div>
              </div>
            </Card>

            {/* Master Rack Import */}
            <Card className="p-6">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Upload className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold">Import Master Rack</h3>
                  <p className="text-sm text-gray-600">Upload CSV file with rack data</p>
                </div>
                
                <div>
                  <Label htmlFor="rack-upload">Choose CSV File</Label>
                  <Input
                    id="rack-upload"
                    type="file"
                    accept=".csv"
                    onChange={(e) => handleFileUpload('Rack Master', e)}
                  />
                </div>
                
                <div className="text-xs text-gray-500">
                  Format: Location, Level, Capacity, Category, Status
                </div>
              </div>
            </Card>

            {/* Master SKU Import */}
            <Card className="p-6">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Upload className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="font-semibold">Import Master SKU</h3>
                  <p className="text-sm text-gray-600">Upload CSV file with SKU data</p>
                </div>
                
                <div>
                  <Label htmlFor="sku-upload">Choose CSV File</Label>
                  <Input
                    id="sku-upload"
                    type="file"
                    accept=".csv"
                    onChange={(e) => handleFileUpload('SKU Master', e)}
                  />
                </div>
                
                <div className="text-xs text-gray-500">
                  Format: SKU ID, Name, Category, Unit, Vendor
                </div>
              </div>
            </Card>
          </div>

          {/* Import History */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Import History</h3>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Filename</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Records</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Errors</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {importResults.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(result.status)}
                          {getStatusBadge(result.status)}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{result.filename}</TableCell>
                      <TableCell>{result.type}</TableCell>
                      <TableCell>{result.records}</TableCell>
                      <TableCell>{result.timestamp}</TableCell>
                      <TableCell>
                        {result.errors.length > 0 ? (
                          <div className="space-y-1">
                            {result.errors.map((error, index) => (
                              <div key={index} className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                                {error}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Guidelines */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 mb-2">Import Guidelines</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• File format must be CSV with UTF-8 encoding</li>
              <li>• First row should contain column headers</li>
              <li>• Maximum file size: 10MB</li>
              <li>• Duplicate records will be updated, not inserted</li>
              <li>• Download templates for correct format structure</li>
              <li>• Validate data before import to avoid errors</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}