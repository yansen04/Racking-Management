import { useState, useEffect, useMemo, useCallback } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { CalendarDays, Package, Plus, Printer, AlertCircle } from 'lucide-react';
import { PrintLabel } from './PrintLabel';

interface PlacementForm {
  dateReceived: string;
  locationRack: string;
  poNumber: string;
  vendor: string;
  sku: string;
  qtyPo: number;
  trip: number;
  noSuratJalan: string;
  qtyPallet: number;
  qtyPcs: number;
  qtyOutstanding: number;
  totalReceived: number;
  status: string;
}

export function ItemPlacement() {
  const [formData, setFormData] = useState<PlacementForm>({
    dateReceived: new Date().toISOString().split('T')[0],
    locationRack: '',
    poNumber: '',
    vendor: '',
    sku: '',
    qtyPo: 0,
    trip: 1,
    noSuratJalan: '',
    qtyPallet: 0,
    qtyPcs: 0,
    qtyOutstanding: 0,
    totalReceived: 0,
    status: 'OPEN'
  });

  const [showPrintLabel, setShowPrintLabel] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentPlacements, setRecentPlacements] = useState([
    {
      id: 1,
      dateReceived: '2025-01-03',
      location: 'SA366',
      poNumber: 'PO224662',
      vendor: 'PT TRESNO BUKO',
      sku: '99001A',
      qtyPo: 300,
      trip: 1,
      noSuratJalan: '5001',
      qtyPallet: 1,
      qtyPcs: 300,
      qtyOutstanding: 0,
      totalReceived: 300,
      status: 'CLOSED'
    }
  ]);

  // Mock data
  const mockLocations = ['SA100', 'SA150', 'SA200', 'SA250', 'SA300', 'SA366'];
  const mockPOs = [
    { number: 'PO224662', vendor: 'PT TRESNO BUKO', skus: [{ code: '99001A', name: 'THERMAL SUGAR WATER', qty: 300 }] },
    { number: 'PO224663', vendor: 'PT THERMAL INDO', skus: [{ code: '99002B', name: 'THERMAL SUGAR WATER+', qty: 500 }] },
    { number: 'PO224664', vendor: 'PT SUGAR WORKS', skus: [{ code: '99003C', name: 'THERMAL WATER', qty: 250 }] }
  ];

  // Get current PO and SKU data
  const currentPO = useMemo(() => 
    mockPOs.find(po => po.number === formData.poNumber), 
    [formData.poNumber]
  );
  
  const currentSKU = useMemo(() => 
    currentPO?.skus.find(sku => sku.code === formData.sku), 
    [currentPO, formData.sku]
  );

  // Calculate trip number
  const calculateTrip = useMemo(() => {
    if (!formData.poNumber || !formData.dateReceived) return 1;
    const existingTrips = recentPlacements.filter(p => 
      p.poNumber === formData.poNumber && p.dateReceived === formData.dateReceived
    ).length;
    return existingTrips + 1;
  }, [formData.poNumber, formData.dateReceived, recentPlacements]);

  // Calculate quantities and status
  const calculations = useMemo(() => {
    if (!currentSKU || !formData.sku || !formData.poNumber) {
      return {
        qtyOutstanding: 0,
        totalReceived: 0,
        status: 'OPEN'
      };
    }

    const totalPreviousReceived = recentPlacements
      .filter(p => p.poNumber === formData.poNumber && p.sku === formData.sku)
      .reduce((sum, p) => sum + p.qtyPcs, 0);
    
    const outstanding = currentSKU.qty - totalPreviousReceived;
    const newTotalReceived = totalPreviousReceived + formData.qtyPcs;
    const newStatus = newTotalReceived >= currentSKU.qty ? 'CLOSED' : 'OPEN';

    return {
      qtyOutstanding: Math.max(0, outstanding - formData.qtyPcs),
      totalReceived: newTotalReceived,
      status: newStatus
    };
  }, [currentSKU, formData.sku, formData.poNumber, formData.qtyPcs, recentPlacements]);

  // Handle PO selection
  const handlePOChange = useCallback((poNumber: string) => {
    const po = mockPOs.find(p => p.number === poNumber);
    setFormData(prev => ({
      ...prev,
      poNumber,
      vendor: po?.vendor || '',
      sku: '',
      qtyPo: 0,
      trip: 1,
      qtyOutstanding: 0,
      totalReceived: 0,
      status: 'OPEN'
    }));
    if (errors.poNumber) setErrors(prev => ({ ...prev, poNumber: '' }));
  }, [errors.poNumber]);

  // Handle SKU selection
  const handleSKUChange = useCallback((skuCode: string) => {
    const sku = currentPO?.skus.find(s => s.code === skuCode);
    setFormData(prev => ({
      ...prev,
      sku: skuCode,
      qtyPo: sku?.qty || 0,
      trip: calculateTrip
    }));
    if (errors.sku) setErrors(prev => ({ ...prev, sku: '' }));
  }, [currentPO, calculateTrip, errors.sku]);

  // Update calculated fields when dependencies change
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      trip: calculateTrip,
      qtyOutstanding: calculations.qtyOutstanding,
      totalReceived: calculations.totalReceived,
      status: calculations.status
    }));
  }, [calculateTrip, calculations]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.locationRack) newErrors.locationRack = 'Location is required';
    if (!formData.poNumber) newErrors.poNumber = 'PO Number is required';
    if (!formData.sku) newErrors.sku = 'SKU is required';
    if (!formData.noSuratJalan.trim()) newErrors.noSuratJalan = 'Surat Jalan number is required';
    if (formData.qtyPcs <= 0) newErrors.qtyPcs = 'Quantity must be greater than 0';
    if (formData.qtyPallet <= 0) newErrors.qtyPallet = 'Pallet quantity must be greater than 0';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newPlacement = {
        id: Date.now(),
        dateReceived: formData.dateReceived,
        location: formData.locationRack,
        poNumber: formData.poNumber,
        vendor: formData.vendor,
        sku: formData.sku,
        qtyPo: formData.qtyPo,
        trip: calculateTrip,
        noSuratJalan: formData.noSuratJalan,
        qtyPallet: formData.qtyPallet,
        qtyPcs: formData.qtyPcs,
        qtyOutstanding: formData.qtyOutstanding,
        totalReceived: formData.totalReceived,
        status: formData.status
      };

      setRecentPlacements(prev => [newPlacement, ...prev]);
      setErrors({});
      
      // Reset form after successful submission
      setFormData(prev => ({
        ...prev,
        locationRack: '',
        noSuratJalan: '',
        qtyPallet: 0,
        qtyPcs: 0
      }));
    } catch (error) {
      console.error('Failed to submit placement:', error);
      setErrors({ submit: 'Failed to submit placement. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    return status === 'CLOSED' 
      ? <Badge variant="default" className="bg-green-500">CLOSED</Badge>
      : <Badge variant="outline" className="border-orange-500 text-orange-600">OPEN</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold">Item Placement</h1>
          <p className="text-gray-600">Location → PO (CPCF) only → Subscribe when complete</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Placement Form */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Plus className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Placement Form</h3>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dateReceived">Date Received</Label>
                <Input
                  type="date"
                  id="dateReceived"
                  value={formData.dateReceived}
                  onChange={(e) => setFormData(prev => ({ ...prev, dateReceived: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="locationRack">Location Rack *</Label>
                <Select 
                  value={formData.locationRack} 
                  onValueChange={(value) => {
                    setFormData(prev => ({ ...prev, locationRack: value }));
                    if (errors.locationRack) setErrors(prev => ({ ...prev, locationRack: '' }));
                  }}
                >
                  <SelectTrigger className={errors.locationRack ? 'border-red-500' : ''}>
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
                {errors.locationRack && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.locationRack}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="poNumber">PO Number *</Label>
                <Select 
                  value={formData.poNumber} 
                  onValueChange={handlePOChange}
                >
                  <SelectTrigger className={errors.poNumber ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select PO" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockPOs.map((po) => (
                      <SelectItem key={po.number} value={po.number}>
                        {po.number}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.poNumber && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.poNumber}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="vendor">Vendor (Auto)</Label>
                <Input
                  id="vendor"
                  value={formData.vendor}
                  disabled
                  className="bg-gray-50"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sku">SKU *</Label>
                <Select 
                  value={formData.sku}
                  onValueChange={handleSKUChange}
                  disabled={!formData.poNumber}
                >
                  <SelectTrigger className={errors.sku ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select SKU" />
                  </SelectTrigger>
                  <SelectContent>
                    {currentPO?.skus.map((sku) => (
                      <SelectItem key={sku.code} value={sku.code}>
                        {sku.code} - {sku.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.sku && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.sku}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="qtyPo">QTY PO (Auto)</Label>
                <Input
                  id="qtyPo"
                  type="number"
                  value={formData.qtyPo}
                  disabled
                  className="bg-gray-50"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="trip">Trip (Auto)</Label>
                <Input
                  id="trip"
                  type="number"
                  value={formData.trip}
                  disabled
                  className="bg-gray-50"
                />
              </div>

              <div>
                <Label htmlFor="noSuratJalan">No. Surat Jalan *</Label>
                <Input
                  id="noSuratJalan"
                  value={formData.noSuratJalan}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, noSuratJalan: e.target.value }));
                    if (errors.noSuratJalan) setErrors(prev => ({ ...prev, noSuratJalan: '' }));
                  }}
                  placeholder="Enter delivery note number"
                  className={errors.noSuratJalan ? 'border-red-500' : ''}
                />
                {errors.noSuratJalan && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.noSuratJalan}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="qtyPallet">QTY Pallet *</Label>
                <Input
                  id="qtyPallet"
                  type="number"
                  min="1"
                  value={formData.qtyPallet}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    setFormData(prev => ({ ...prev, qtyPallet: value }));
                    if (errors.qtyPallet) setErrors(prev => ({ ...prev, qtyPallet: '' }));
                  }}
                  className={errors.qtyPallet ? 'border-red-500' : ''}
                />
                {errors.qtyPallet && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.qtyPallet}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="qtyPcs">QTY PCS *</Label>
                <Input
                  id="qtyPcs"
                  type="number"
                  min="1"
                  value={formData.qtyPcs}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    setFormData(prev => ({ ...prev, qtyPcs: value }));
                    if (errors.qtyPcs) setErrors(prev => ({ ...prev, qtyPcs: '' }));
                  }}
                  className={errors.qtyPcs ? 'border-red-500' : ''}
                />
                {errors.qtyPcs && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.qtyPcs}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="qtyOutstanding">Qty Outstanding</Label>
                <Input
                  id="qtyOutstanding"
                  type="number"
                  value={formData.qtyOutstanding}
                  disabled
                  className="bg-gray-50"
                />
              </div>

              <div>
                <Label htmlFor="totalReceived">Total Received</Label>
                <Input
                  id="totalReceived"
                  type="number"
                  value={formData.totalReceived}
                  disabled
                  className="bg-gray-50"
                />
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <div className="pt-2">
                  {getStatusBadge(formData.status)}
                </div>
              </div>
            </div>

            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded p-3 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="text-red-700">{errors.submit}</span>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                <Package className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Placing Item...' : 'Place Item'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowPrintLabel(true)}
                disabled={!formData.sku}
              >
                <Printer className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </Card>

        {/* PO Progress */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">PO Progress</h3>
          <div className="text-sm text-gray-600 mb-4">PO Receipts</div>
          
          {formData.poNumber && currentPO && (
            <div className="space-y-4">
              {currentPO.skus.map((sku) => {
                const received = recentPlacements
                  .filter(p => p.poNumber === formData.poNumber && p.sku === sku.code)
                  .reduce((sum, p) => sum + p.qtyPcs, 0);
                const progress = (received / sku.qty) * 100;
                
                return (
                  <div key={sku.code} className="border rounded p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{sku.code}</span>
                      <span className="text-sm text-gray-600">{received}/{sku.qty}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">{progress.toFixed(1)}% completed</div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      {/* Recent Placements */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Placements</h3>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>PO Number</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Trip</TableHead>
                <TableHead>QTY PCS</TableHead>
                <TableHead>Outstanding</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentPlacements.map((placement) => (
                <TableRow key={placement.id}>
                  <TableCell>{placement.dateReceived}</TableCell>
                  <TableCell className="font-medium">{placement.location}</TableCell>
                  <TableCell>{placement.poNumber}</TableCell>
                  <TableCell>{placement.sku}</TableCell>
                  <TableCell>{placement.trip}</TableCell>
                  <TableCell>{placement.qtyPcs}</TableCell>
                  <TableCell>{placement.qtyOutstanding}</TableCell>
                  <TableCell>{getStatusBadge(placement.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Print Label Modal */}
      {showPrintLabel && (
        <PrintLabel
          data={{
            sku: formData.sku || '99001A',
            receiveDate: formData.dateReceived,
            noSuratJalan: formData.noSuratJalan || '5001',
            location: formData.locationRack || 'SA366',
            qtyPcsPerPallet: formData.qtyPcs || 300,
            vendor: formData.vendor,
            poNumber: formData.poNumber
          }}
          onClose={() => setShowPrintLabel(false)}
        />
      )}
    </div>
  );
}