import { useState, useMemo } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { ArrowRight, ArrowRightLeft, Package, MapPin, Search } from 'lucide-react';

interface TransferForm {
  fromLocation: string;
  toLocation: string;
  sku: string;
  transferQty: number;
  reason: string;
}

interface InventoryItem {
  id: number;
  sku: string;
  skuName: string;
  location: string;
  qtyPcs: number;
  poNumber: string;
  status: string;
}

export function TransferRack() {
  const [formData, setFormData] = useState<TransferForm>({
    fromLocation: '',
    toLocation: '',
    sku: '',
    transferQty: 0,
    reason: ''
  });

  const [searchLocation, setSearchLocation] = useState('');
  const [recentTransfers, setRecentTransfers] = useState([
    {
      id: 1,
      date: '2025-01-03',
      sku: '99001A',
      fromLocation: 'SA100',
      toLocation: 'SA366',
      qty: 150,
      reason: 'Optimization',
      status: 'COMPLETED'
    }
  ]);

  // Mock inventory data (both OPEN and CLOSED POs)
  const mockInventory: InventoryItem[] = [
    {
      id: 1,
      sku: '99001A',
      skuName: 'THERMAL SUGAR WATER',
      location: 'SA366',
      qtyPcs: 300,
      poNumber: 'PO224662',
      status: 'CLOSED'
    },
    {
      id: 2,
      sku: '99002B',
      skuName: 'THERMAL SUGAR WATER+',
      location: 'SA200',
      qtyPcs: 500,
      poNumber: 'PO224663',
      status: 'OPEN'
    },
    {
      id: 3,
      sku: '99003C',
      skuName: 'THERMAL WATER',
      location: 'SA150',
      qtyPcs: 250,
      poNumber: 'PO224664',
      status: 'OPEN'
    },
    {
      id: 4,
      sku: '99001A',
      skuName: 'THERMAL SUGAR WATER',
      location: 'SA100',
      qtyPcs: 300,
      poNumber: 'PO224665',
      status: 'CLOSED'
    }
  ];

  const mockLocations = ['SA100', 'SA150', 'SA200', 'SA250', 'SA300', 'SA366'];

  // Filter inventory by selected from location (memoized)
  const availableSkus = useMemo(() => {
    return mockInventory.filter(item => item.location === formData.fromLocation);
  }, [formData.fromLocation]);
  
  const selectedItem = useMemo(() => {
    return availableSkus.find(item => item.sku === formData.sku);
  }, [availableSkus, formData.sku]);

  // Filter inventory for search (memoized)
  const filteredInventory = useMemo(() => {
    return searchLocation 
      ? mockInventory.filter(item => 
          item.location.toLowerCase().includes(searchLocation.toLowerCase()) ||
          item.sku.toLowerCase().includes(searchLocation.toLowerCase())
        )
      : mockInventory;
  }, [searchLocation]);

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedItem || formData.transferQty > selectedItem.qtyPcs) {
      alert('Invalid transfer quantity');
      return;
    }

    const newTransfer = {
      id: recentTransfers.length + 1,
      date: new Date().toISOString().split('T')[0],
      sku: formData.sku,
      fromLocation: formData.fromLocation,
      toLocation: formData.toLocation,
      qty: formData.transferQty,
      reason: formData.reason,
      status: 'COMPLETED'
    };

    setRecentTransfers([newTransfer, ...recentTransfers]);
    
    // Reset form
    setFormData({
      fromLocation: '',
      toLocation: '',
      sku: '',
      transferQty: 0,
      reason: ''
    });

    alert('Transfer completed successfully!');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge variant="default" className="bg-green-500">COMPLETED</Badge>;
      case 'PENDING':
        return <Badge variant="outline" className="border-orange-500 text-orange-600">PENDING</Badge>;
      case 'OPEN':
        return <Badge variant="outline" className="border-blue-500 text-blue-600">OPEN</Badge>;
      case 'CLOSED':
        return <Badge variant="outline" className="border-gray-500 text-gray-600">CLOSED</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold">Transfer Rack</h1>
          <p className="text-gray-600">Transfer SKUs between racks (All inventory - OPEN & CLOSED POs)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transfer Form */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <ArrowRightLeft className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Transfer Form</h3>
          </div>
          
          <form onSubmit={handleTransfer} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fromLocation">From Location</Label>
                <Select onValueChange={(value) => setFormData(prev => ({ ...prev, fromLocation: value, sku: '' }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source location" />
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
              
              <div>
                <Label htmlFor="toLocation">To Location</Label>
                <Select onValueChange={(value) => setFormData(prev => ({ ...prev, toLocation: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockLocations
                      .filter(loc => loc !== formData.fromLocation)
                      .map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="sku">Available SKUs</Label>
              <Select 
                onValueChange={(value) => setFormData(prev => ({ ...prev, sku: value }))}
                disabled={!formData.fromLocation}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select SKU to transfer" />
                </SelectTrigger>
                <SelectContent>
                  {availableSkus.map((item) => (
                    <SelectItem key={item.id} value={item.sku}>
                      {item.sku} - {item.skuName} ({item.qtyPcs} PCS) - {item.status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedItem && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-800">Selected Item Details</span>
                </div>
                <div className="text-sm text-blue-700">
                  <p>SKU: {selectedItem.sku} - {selectedItem.skuName}</p>
                  <p>Available Quantity: {selectedItem.qtyPcs} PCS</p>
                  <p>PO: {selectedItem.poNumber} ({selectedItem.status})</p>
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="transferQty">Transfer Quantity (PCS)</Label>
              <Input
                id="transferQty"
                type="number"
                value={formData.transferQty}
                onChange={(e) => setFormData(prev => ({ ...prev, transferQty: parseInt(e.target.value) || 0 }))}
                max={selectedItem?.qtyPcs || 0}
                placeholder="Enter quantity to transfer"
              />
              {selectedItem && (
                <p className="text-xs text-gray-600 mt-1">
                  Maximum: {selectedItem.qtyPcs} PCS
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="reason">Transfer Reason</Label>
              <Select onValueChange={(value) => setFormData(prev => ({ ...prev, reason: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="optimization">Space Optimization</SelectItem>
                  <SelectItem value="consolidation">Inventory Consolidation</SelectItem>
                  <SelectItem value="maintenance">Rack Maintenance</SelectItem>
                  <SelectItem value="rotation">Stock Rotation</SelectItem>
                  <SelectItem value="damage">Damage Prevention</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={!formData.fromLocation || !formData.toLocation || !formData.sku || formData.transferQty <= 0}
            >
              <ArrowRightLeft className="h-4 w-4 mr-2" />
              Transfer Items
            </Button>
          </form>
        </Card>

        {/* Current Inventory Overview */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Current Inventory Overview</h3>
          
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by location or SKU..."
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredInventory.map((item) => (
              <div key={item.id} className="border rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-600" />
                      <span className="font-medium">{item.location}</span>
                      {getStatusBadge(item.status)}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{item.sku} - {item.skuName}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{item.qtyPcs} PCS</div>
                    <div className="text-xs text-gray-500">{item.poNumber}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Transfers */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Transfers</h3>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>From Location</TableHead>
                <TableHead>To Location</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTransfers.map((transfer) => (
                <TableRow key={transfer.id}>
                  <TableCell>{transfer.date}</TableCell>
                  <TableCell className="font-medium">{transfer.sku}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-600" />
                      {transfer.fromLocation}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <ArrowRight className="h-4 w-4 text-gray-600" />
                      <MapPin className="h-4 w-4 text-gray-600" />
                      {transfer.toLocation}
                    </div>
                  </TableCell>
                  <TableCell>{transfer.qty} PCS</TableCell>
                  <TableCell>{transfer.reason}</TableCell>
                  <TableCell>{getStatusBadge(transfer.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}