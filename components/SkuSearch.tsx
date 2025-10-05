import { useState, useMemo } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Search, Package, MapPin, Download, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface SkuItem {
  id: number;
  skuId: string;
  skuName: string;
  level: string;
  location: string;
  quantityPcs: number;
  poNumber: string;
  status: string;
  category: string;
  dateReceived: string;
}

export function SkuSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const mockSkuData: SkuItem[] = [
    {
      id: 1,
      skuId: '99001A',
      skuName: 'THERMAL SUGAR WATER',
      level: 'Level 1',
      location: 'SA366',
      quantityPcs: 300,
      poNumber: 'PO224662',
      status: 'CLOSED',
      category: 'THERMAL',
      dateReceived: '2025-01-03'
    },
    {
      id: 2,
      skuId: '99002B',
      skuName: 'THERMAL SUGAR WATER+',
      level: 'Level 2',
      location: 'SA200',
      quantityPcs: 500,
      poNumber: 'PO224663',
      status: 'OPEN',
      category: 'THERMAL',
      dateReceived: '2025-01-02'
    },
    {
      id: 3,
      skuId: '99003C',
      skuName: 'THERMAL WATER',
      level: 'Level 1',
      location: 'SA150',
      quantityPcs: 250,
      poNumber: 'PO224664',
      status: 'OPEN',
      category: 'ACTIVE',
      dateReceived: '2025-01-01'
    },
    {
      id: 4,
      skuId: '99001A',
      skuName: 'THERMAL SUGAR WATER',
      level: 'Level 1',
      location: 'SA100',
      quantityPcs: 300,
      poNumber: 'PO224665',
      status: 'CLOSED',
      category: 'THERMAL',
      dateReceived: '2024-12-30'
    },
    {
      id: 5,
      skuId: '99004D',
      skuName: 'FROZEN SUGAR WATER',
      level: 'Level 3',
      location: 'SA300',
      quantityPcs: 400,
      poNumber: 'PO224666',
      status: 'OPEN',
      category: 'FROZEN',
      dateReceived: '2024-12-28'
    }
  ];

  // Filter data based on search and filters (memoized for performance)
  const filteredData = useMemo(() => {
    return mockSkuData.filter(item => {
      const matchesSearch = !searchTerm || 
        item.skuId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.skuName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesLevel = !filterLevel || filterLevel === 'all' || item.level === filterLevel;
      const matchesStatus = !filterStatus || filterStatus === 'all' || item.status === filterStatus;
      
      return matchesSearch && matchesLevel && matchesStatus;
    });
  }, [searchTerm, filterLevel, filterStatus]);

  // Calculate summary statistics (memoized)
  const { totalSkus, totalQuantity, totalLocations } = useMemo(() => {
    const totalSkus = new Set(filteredData.map(item => item.skuId)).size;
    const totalQuantity = filteredData.reduce((sum, item) => sum + item.quantityPcs, 0);
    const totalLocations = new Set(filteredData.map(item => item.location)).size;
    
    return { totalSkus, totalQuantity, totalLocations };
  }, [filteredData]);

  // Group by SKU for consolidated view (memoized)
  const skuSummary = useMemo(() => {
    return filteredData.reduce((acc, item) => {
      const key = item.skuId;
      if (!acc[key]) {
        acc[key] = {
          skuId: item.skuId,
          skuName: item.skuName,
          totalQuantity: 0,
          locations: [],
          category: item.category,
          status: 'MIXED'
        };
      }
      acc[key].totalQuantity += item.quantityPcs;
      acc[key].locations.push({
        location: item.location,
        level: item.level,
        quantity: item.quantityPcs,
        status: item.status,
        poNumber: item.poNumber
      });
      
      // Determine overall status
      const statuses = acc[key].locations.map(l => l.status);
      if (statuses.every(s => s === 'CLOSED')) {
        acc[key].status = 'CLOSED';
      } else if (statuses.every(s => s === 'OPEN')) {
        acc[key].status = 'OPEN';
      } else {
        acc[key].status = 'MIXED';
      }
      
      return acc;
    }, {} as any);
  }, [filteredData]);

  const exportData = () => {
    // Create CSV data
    const headers = ['SKU ID', 'SKU Name', 'Level', 'Location', 'Quantity (PCS)', 'PO Number', 'Status', 'Category', 'Date Received'];
    const csvData = [
      headers.join(','),
      ...filteredData.map(item => [
        item.skuId,
        `"${item.skuName}"`,
        item.level,
        item.location,
        item.quantityPcs,
        item.poNumber,
        item.status,
        item.category,
        item.dateReceived
      ].join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sku-search-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CLOSED':
        return <Badge variant="default" className="bg-green-500">CLOSED</Badge>;
      case 'OPEN':
        return <Badge variant="outline" className="border-orange-500 text-orange-600">OPEN</Badge>;
      case 'MIXED':
        return <Badge variant="outline" className="border-purple-500 text-purple-600">MIXED</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'THERMAL':
        return <Badge variant="outline" className="border-orange-500 text-orange-600">THERMAL</Badge>;
      case 'FROZEN':
        return <Badge variant="outline" className="border-cyan-500 text-cyan-600">FROZEN</Badge>;
      case 'ACTIVE':
        return <Badge variant="outline" className="border-blue-500 text-blue-600">ACTIVE</Badge>;
      default:
        return <Badge variant="outline">{category}</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold">SKU Search</h1>
          <p className="text-gray-600">SKU ID, SKU Name, Level, Location, Quantity (PCS)</p>
        </div>
        <Button onClick={exportData} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="search">Search SKU</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="search"
                placeholder="Search by SKU ID, name, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="filterLevel">Filter by Level</Label>
            <Select value={filterLevel} onValueChange={setFilterLevel}>
              <SelectTrigger>
                <SelectValue placeholder="All levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All levels</SelectItem>
                <SelectItem value="Level 1">Level 1</SelectItem>
                <SelectItem value="Level 2">Level 2</SelectItem>
                <SelectItem value="Level 3">Level 3</SelectItem>
                <SelectItem value="Level 4">Level 4</SelectItem>
                <SelectItem value="Level 5">Level 5</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="filterStatus">Filter by Status</Label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="All status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="OPEN">Open</SelectItem>
                <SelectItem value="CLOSED">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total SKUs</p>
              <p className="text-2xl font-semibold">{totalSkus}</p>
            </div>
            <Package className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Quantity</p>
              <p className="text-2xl font-semibold">{totalQuantity.toLocaleString()}</p>
              <p className="text-sm text-gray-500">PCS</p>
            </div>
            <Package className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Active Locations</p>
              <p className="text-2xl font-semibold">{totalLocations}</p>
            </div>
            <MapPin className="h-8 w-8 text-orange-600" />
          </div>
        </Card>
      </div>

      {/* SKU Summary View */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">SKU Summary</h3>
        <div className="space-y-4">
          {Object.values(skuSummary).map((sku: any) => (
            <div key={sku.skuId} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold">{sku.skuId}</h4>
                  <p className="text-sm text-gray-600">{sku.skuName}</p>
                  <div className="flex gap-2 mt-2">
                    {getCategoryBadge(sku.category)}
                    {getStatusBadge(sku.status)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{sku.totalQuantity.toLocaleString()} PCS</div>
                  <div className="text-sm text-gray-600">{sku.locations.length} locations</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {sku.locations.map((loc: any, index: number) => (
                  <div key={index} className="bg-gray-50 rounded p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-600" />
                        <span className="font-medium">{loc.location}</span>
                      </div>
                      {getStatusBadge(loc.status)}
                    </div>
                    <div className="text-sm text-gray-600">
                      <div>{loc.level}</div>
                      <div>{loc.quantity.toLocaleString()} PCS</div>
                      <div className="text-xs">{loc.poNumber}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Detailed View */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Detailed View</h3>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU ID</TableHead>
                <TableHead>SKU Name</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Quantity (PCS)</TableHead>
                <TableHead>PO Number</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date Received</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.skuId}</TableCell>
                  <TableCell>{item.skuName}</TableCell>
                  <TableCell>{item.level}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-600" />
                      {item.location}
                    </div>
                  </TableCell>
                  <TableCell>{item.quantityPcs.toLocaleString()}</TableCell>
                  <TableCell>{item.poNumber}</TableCell>
                  <TableCell>{getCategoryBadge(item.category)}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell>{item.dateReceived}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {filteredData.length === 0 && (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600">
              Try adjusting your search terms or filters
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}