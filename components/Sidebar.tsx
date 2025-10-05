import { 
  LayoutDashboard, 
  MapPin, 
  Package, 
  Search, 
  ArrowRightLeft, 
  Barcode, 
  Download,
  Warehouse,
  Printer,
  Tag
} from 'lucide-react';

interface SidebarProps {
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
}

export function Sidebar({ activeMenu, setActiveMenu }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'location-master', label: 'Location Master', icon: MapPin },
    { id: 'sku-master', label: 'SKU Master', icon: Tag },
    { id: 'item-placement', label: 'Item Placement', icon: Package },
    { id: 'item-retrieval', label: 'Item Retrieval', icon: Search },
    { id: 'transfer-rack', label: 'Transfer Rack', icon: ArrowRightLeft },
    { id: 'sku-search', label: 'SKU Search', icon: Barcode },
    { id: 'export-import', label: 'Export-Import', icon: Download },
    { id: 'print-label', label: 'Print Label', icon: Printer },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <Warehouse className="h-8 w-8 text-blue-400" />
          <div>
            <h1 className="text-xl font-semibold">Racking Data</h1>
            <p className="text-gray-400 text-sm">UK V1.0</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveMenu(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    activeMenu === item.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}