import { useState, useMemo } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Search, Package, MapPin, Minus } from 'lucide-react';

interface InventoryItem {
  id: number;
  sku: string;
  skuName: string;
  location: string;
  totalPallets: number;
  qtyPcsInPallets: number;
  poNumber: string;
  dateReceived: string;
  status: string;
}

export function ItemRetrieval() {
  const [searchSku, setSearchSku] = useState('');
  const [retrievalQty, setRetrievalQty] = useState<{ [key: number]: number }>({});

  const mockInventory: InventoryItem[] = [
    {
      id: 1,
      sku: '99001A',
      skuName: 'THERMAL SUGAR WATER',
      location: 'SA366',
      totalPallets: 1,
      qtyPcsInPallets: 300,
      poNumber: 'PO224662',
      dateReceived: '2025-01-03',
      status: 'AVAILABLE'
    },
    {
      id: 2,
      sku: '99002B',
      skuName: 'THERMAL SUGAR WATER+',
      location: 'SA200',
      totalPallets: 2,
      qtyPcsInPallets: 500,
      poNumber: 'PO224663',
      dateReceived: '2025-01-02',
      status: 'AVAILABLE'
    },
    {
      id: 3,
      sku: '99003C',
      skuName: 'THERMAL WATER',
      location: 'SA150',
      totalPallets: 1,
      qtyPcsInPallets: 250,
      poNumber: 'PO224664',
      dateReceived: '2025-01-01',
      status: 'AVAILABLE'
    },
    {
      id: 4,
      sku: '99001A',
      skuName: 'THERMAL SUGAR WATER',
      location: 'SA100',
      totalPallets: 1,
      qtyPcsInPallets: 300,
      poNumber: 'PO224665',
      dateReceived: '2024-12-30',
      status: 'RESERVED'
    }
  ];

  const filteredInventory = useMemo(() => {
    return mockInventory.filter(item =>
      item.sku.toLowerCase().includes(searchSku.toLowerCase()) ||
      item.skuName.toLowerCase().includes(searchSku.toLowerCase())
    );
  }, [searchSku]);

  // Group by SKU for summary (memoized)
  const skuSummary = useMemo(() => {
    return filteredInventory.reduce((acc, item) => {
      const key = item.sku;
      if (!acc[key]) {
        acc[key] = {
          sku: item.sku,
          skuName: item.skuName,
          totalPallets: 0,
          totalPcs: 0,
          locations: []
        };
      }
      acc[key].totalPallets += item.totalPallets;
      acc[key].totalPcs += item.qtyPcsInPallets;
      acc[key].locations.push({
        location: item.location,
        pallets: item.totalPallets,
        pcs: item.qtyPcsInPallets,
        status: item.status
      });
      return acc;
    }, {} as any);
  }, [filteredInventory]);

  const handleRetrieve = (itemId: number) => {
    const qty = retrievalQty[itemId] || 0;
    if (qty > 0) {
      // Here you would implement the retrieval logic
      alert(`Retrieved ${qty} PCS from item ${itemId}`);
      setRetrievalQty(prev => ({ ...prev, [itemId]: 0 }));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return <Badge variant="default" className="bg-green-500">AVAILABLE</Badge>;
      case 'RESERVED':
        return <Badge variant="outline" className="border-orange-500 text-orange-600">RESERVED</Badge>;
      case 'PICKED':
        return <Badge variant="outline" className="border-gray-500 text-gray-600">PICKED</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold">Item Retrieval</h1>
          <p className="text-gray-600">SKU → Rack Location → Total Pallets → Qty PCS in Pallets</p>
        </div>
      </div>

      {/* Search */}
      <Card className="p-6">
        <div className="flex gap-4 items-end">
          <div className="flex-1 max-w-md">
            <Label htmlFor="searchSku">Search SKU</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="searchSku"
                placeholder="Enter SKU or product name..."
                value={searchSku}
                onChange={(e) => setSearchSku(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Button>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
      </Card>

      {searchSku && Object.keys(skuSummary).length > 0 && (
        <>
          {/* SKU Summary */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">SKU Summary</h3>
            <div className="space-y-4">
              {Object.values(skuSummary).map((summary: any) => (
                <div key={summary.sku} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold">{summary.sku}</h4>
                      <p className="text-sm text-gray-600">{summary.skuName}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">Total: {summary.totalPcs} PCS</div>
                      <div className="text-sm text-gray-600">{summary.totalPallets} Pallets</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {summary.locations.map((loc: any, index: number) => (
                      <div key={index} className="bg-gray-50 rounded p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-600" />
                            <span className="font-medium">{loc.location}</span>
                          </div>
                          {getStatusBadge(loc.status)}
                        </div>
                        <div className="text-sm text-gray-600">
                          <div>{loc.pallets} Pallets</div>
                          <div>{loc.pcs} PCS</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Detailed Inventory */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Detailed Inventory</h3>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Rack Location</TableHead>
                    <TableHead>Total Pallets</TableHead>
                    <TableHead>Qty PCS</TableHead>
                    <TableHead>PO Number</TableHead>
                    <TableHead>Date Received</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Retrieve</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.sku}</TableCell>
                      <TableCell>{item.skuName}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-600" />
                          {item.location}
                        </div>
                      </TableCell>
                      <TableCell>{item.totalPallets}</TableCell>
                      <TableCell>{item.qtyPcsInPallets}</TableCell>
                      <TableCell>{item.poNumber}</TableCell>
                      <TableCell>{item.dateReceived}</TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell>
                        {item.status === 'AVAILABLE' ? (
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              placeholder="Qty"
                              className="w-20"
                              max={item.qtyPcsInPallets}
                              value={retrievalQty[item.id] || ''}
                              onChange={(e) => setRetrievalQty(prev => ({
                                ...prev,
                                [item.id]: parseInt(e.target.value) || 0
                              }))}
                            />
                            <Button 
                              size="sm" 
                              onClick={() => handleRetrieve(item.id)}
                              disabled={!retrievalQty[item.id] || retrievalQty[item.id] <= 0}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
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
        </>
      )}

      {searchSku && Object.keys(skuSummary).length === 0 && (
        <Card className="p-6">
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-600">
              No inventory items match your search criteria "{searchSku}"
            </p>
          </div>
        </Card>
      )}

      {!searchSku && (
        <Card className="p-6">
          <div className="text-center py-8">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Search for items</h3>
            <p className="text-gray-600">
              Enter a SKU or product name to view available inventory and retrieve items
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}