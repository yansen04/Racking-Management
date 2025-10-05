import { useState, useMemo } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';

export function LocationMaster() {
  const [searchTerm, setSearchTerm] = useState('');

  const mockLocations = [
    { id: 1, location: 'SA100', level: 'Level 1', maxPallets: 2, currentPallets: 2, category: 'ACTIVE', status: 'FULL', utilization: 100 },
    { id: 2, location: 'SA150', level: 'Level 1', maxPallets: 2, currentPallets: 2, category: 'ACTIVE', status: 'FULL', utilization: 100 },
    { id: 3, location: 'SA200', level: 'Level 2', maxPallets: 2, currentPallets: 0, category: 'ACTIVE', status: 'AVAILABLE', utilization: 0 },
    { id: 4, location: 'SA250', level: 'Level 2', maxPallets: 2, currentPallets: 2, category: 'THERMAL', status: 'FULL', utilization: 100 },
    { id: 5, location: 'SA300', level: 'Level 3', maxPallets: 2, currentPallets: 2, category: 'FROZEN', status: 'FULL', utilization: 100 },
  ];

  const levelSummary = [
    { level: 'Level 1', occupied: '8 pallets', total: '10 pallets', utilization: 80 },
    { level: 'Level 2', occupied: '10 pallets', total: '12 pallets', utilization: 83 },
    { level: 'Level 3', occupied: '6 pallets', total: '8 pallets', utilization: 75 },
    { level: 'Level 4', occupied: '9 pallets', total: '10 pallets', utilization: 90 },
    { level: 'Level 5', occupied: '7 pallets', total: '8 pallets', utilization: 87 },
  ];

  const filteredLocations = useMemo(() => {
    return mockLocations.filter(location =>
      location.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.level.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'FULL':
        return <Badge variant="destructive">FULL</Badge>;
      case 'AVAILABLE':
        return <Badge variant="default" className="bg-green-500">AVAILABLE</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'ACTIVE':
        return <Badge variant="outline" className="border-blue-500 text-blue-600">ACTIVE</Badge>;
      case 'THERMAL':
        return <Badge variant="outline" className="border-orange-500 text-orange-600">THERMAL</Badge>;
      case 'FROZEN':
        return <Badge variant="outline" className="border-cyan-500 text-cyan-600">FROZEN</Badge>;
      default:
        return <Badge variant="outline">{category}</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold">Location Master</h1>
          <p className="text-gray-600">Manage warehouse rack locations (Pallet-based)</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Location
        </Button>
      </div>

      {/* Level Summary */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {levelSummary.map((level, index) => (
          <Card key={index} className="p-4">
            <h3 className="font-semibold mb-2">{level.level}</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">{level.occupied}</p>
              <p className="text-xs text-gray-500">{level.total}</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${level.utilization}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-600">{level.utilization}%</p>
            </div>
          </Card>
        ))}
      </div>

      {/* All Locations */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">All Locations</h3>
          <p className="text-sm text-gray-600">Details view of warehouse rack locations</p>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Location</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Max Pallets</TableHead>
                <TableHead>Current Pallets</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Utilization</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLocations.map((location) => (
                <TableRow key={location.id}>
                  <TableCell className="font-medium">{location.location}</TableCell>
                  <TableCell>{location.level}</TableCell>
                  <TableCell>{location.maxPallets}</TableCell>
                  <TableCell>{location.currentPallets}</TableCell>
                  <TableCell>{getCategoryBadge(location.category)}</TableCell>
                  <TableCell>{getStatusBadge(location.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${location.utilization}%` }}
                        ></div>
                      </div>
                      <span className="text-sm">{location.utilization}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}