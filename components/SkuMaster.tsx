import { useState, useMemo } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Plus, Search, Edit, Trash2, Tag, Package } from 'lucide-react';
import { toast } from 'sonner';

interface SKU {
  id: number;
  code: string;
  name: string;
  category: 'ACTIVE' | 'THERMAL' | 'FROZEN';
  unit: string;
  description: string;
}

export function SkuMaster() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedSKU, setSelectedSKU] = useState<SKU | null>(null);

  const [skus, setSkus] = useState<SKU[]>([
    { id: 1, code: '99001A', name: 'THERMAL SUGAR WATER', category: 'THERMAL', unit: 'PCS', description: 'Premium sugar water with thermal control' },
    { id: 2, code: '99002B', name: 'THERMAL SUGAR WATER+', category: 'THERMAL', unit: 'PCS', description: 'Enhanced formula with extra minerals' },
    { id: 3, code: '99003C', name: 'THERMAL WATER', category: 'THERMAL', unit: 'PCS', description: 'Pure thermal water' },
    { id: 4, code: '88001X', name: 'ACTIVE PRODUCT A', category: 'ACTIVE', unit: 'PCS', description: 'Standard active product line' },
    { id: 5, code: '88002Y', name: 'FROZEN PRODUCT B', category: 'FROZEN', unit: 'PCS', description: 'Frozen goods requiring cold storage' },
    { id: 6, code: '88003Z', name: 'ACTIVE PRODUCT C', category: 'ACTIVE', unit: 'BOX', description: 'Boxed active product' },
  ]);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    category: 'ACTIVE' as 'ACTIVE' | 'THERMAL' | 'FROZEN',
    unit: 'PCS',
    description: ''
  });

  const filteredSKUs = useMemo(() => {
    return skus.filter(sku =>
      sku.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sku.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sku.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, skus]);

  const categorySummary = useMemo(() => {
    const summary = {
      ACTIVE: 0,
      THERMAL: 0,
      FROZEN: 0,
      total: skus.length
    };
    skus.forEach(sku => {
      summary[sku.category]++;
    });
    return summary;
  }, [skus]);

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

  const handleAddSKU = () => {
    if (!formData.code || !formData.name) {
      toast.error('Please fill in required fields');
      return;
    }

    // Check for duplicate SKU code
    if (skus.some(sku => sku.code === formData.code)) {
      toast.error('SKU Code already exists');
      return;
    }

    const newSKU: SKU = {
      id: Math.max(...skus.map(s => s.id), 0) + 1,
      ...formData
    };

    setSkus([...skus, newSKU]);
    toast.success('SKU added successfully');
    setShowAddDialog(false);
    setFormData({
      code: '',
      name: '',
      category: 'ACTIVE',
      unit: 'PCS',
      description: ''
    });
  };

  const handleEditSKU = () => {
    if (!selectedSKU) return;

    setSkus(skus.map(sku =>
      sku.id === selectedSKU.id ? { ...selectedSKU, ...formData } : sku
    ));

    toast.success('SKU updated successfully');
    setShowEditDialog(false);
    setSelectedSKU(null);
  };

  const handleDeleteSKU = (id: number) => {
    if (confirm('Are you sure you want to delete this SKU?')) {
      setSkus(skus.filter(sku => sku.id !== id));
      toast.success('SKU deleted successfully');
    }
  };

  const openEditDialog = (sku: SKU) => {
    setSelectedSKU(sku);
    setFormData({
      code: sku.code,
      name: sku.name,
      category: sku.category,
      unit: sku.unit,
      description: sku.description
    });
    setShowEditDialog(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold">SKU Master</h1>
          <p className="text-gray-600">Manage SKU codes and product information</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add SKU
        </Button>
      </div>

      {/* Category Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total SKUs</p>
              <p className="text-2xl font-semibold">{categorySummary.total}</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Active</p>
              <p className="text-2xl font-semibold">{categorySummary.ACTIVE}</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Tag className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Thermal</p>
              <p className="text-2xl font-semibold">{categorySummary.THERMAL}</p>
            </div>
            <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Tag className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Frozen</p>
              <p className="text-2xl font-semibold">{categorySummary.FROZEN}</p>
            </div>
            <div className="h-12 w-12 bg-cyan-100 rounded-lg flex items-center justify-center">
              <Tag className="h-6 w-6 text-cyan-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* SKU List */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">All SKUs</h3>
          <div className="flex gap-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search SKU code, name, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU Code</TableHead>
                <TableHead>SKU Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSKUs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No SKUs found
                  </TableCell>
                </TableRow>
              ) : (
                filteredSKUs.map((sku) => (
                  <TableRow key={sku.id}>
                    <TableCell className="font-medium">{sku.code}</TableCell>
                    <TableCell>{sku.name}</TableCell>
                    <TableCell>{getCategoryBadge(sku.category)}</TableCell>
                    <TableCell>{sku.unit}</TableCell>
                    <TableCell className="max-w-xs truncate">{sku.description}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(sku)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteSKU(sku.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
          <p>Showing {filteredSKUs.length} of {skus.length} SKUs</p>
        </div>
      </Card>

      {/* Add SKU Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New SKU</DialogTitle>
            <DialogDescription>
              Create a new SKU by filling in the required information below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="code">SKU Code *</Label>
              <Input
                id="code"
                placeholder="e.g., 99001A"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              />
            </div>
            <div>
              <Label htmlFor="name">SKU Name *</Label>
              <Input
                id="name"
                placeholder="e.g., THERMAL SUGAR WATER"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value.toUpperCase() })}
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value: any) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                  <SelectItem value="THERMAL">THERMAL</SelectItem>
                  <SelectItem value="FROZEN">FROZEN</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="unit">Unit</Label>
              <Select
                value={formData.unit}
                onValueChange={(value) => setFormData({ ...formData, unit: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PCS">PCS</SelectItem>
                  <SelectItem value="BOX">BOX</SelectItem>
                  <SelectItem value="PALLET">PALLET</SelectItem>
                  <SelectItem value="KG">KG</SelectItem>
                  <SelectItem value="LITER">LITER</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Product description..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSKU}>Add SKU</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit SKU Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit SKU</DialogTitle>
            <DialogDescription>
              Update the SKU information below. SKU code cannot be changed.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-code">SKU Code *</Label>
              <Input
                id="edit-code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                disabled
              />
            </div>
            <div>
              <Label htmlFor="edit-name">SKU Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value.toUpperCase() })}
              />
            </div>
            <div>
              <Label htmlFor="edit-category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value: any) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                  <SelectItem value="THERMAL">THERMAL</SelectItem>
                  <SelectItem value="FROZEN">FROZEN</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-unit">Unit</Label>
              <Select
                value={formData.unit}
                onValueChange={(value) => setFormData({ ...formData, unit: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PCS">PCS</SelectItem>
                  <SelectItem value="BOX">BOX</SelectItem>
                  <SelectItem value="PALLET">PALLET</SelectItem>
                  <SelectItem value="KG">KG</SelectItem>
                  <SelectItem value="LITER">LITER</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSKU}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
