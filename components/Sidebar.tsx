import { Home, Boxes, Package, MoveRight, MoveLeft, ArrowLeftRight, Search, Import, Printer } from 'lucide-react';
import React from 'react';

export type MenuKey =
  | 'dashboard'
  | 'location-master'
  | 'sku-master'
  | 'item-placement'
  | 'item-retrieval'
  | 'transfer-rack'
  | 'sku-search'
  | 'export-import'
  | 'print-label';

interface SidebarProps {
  activeMenu: MenuKey;
  setActiveMenu: (k: MenuKey) => void;
}

const MENU_ITEMS: Array<{ key: MenuKey; label: string; icon: React.ReactNode }> = [
  { key: 'dashboard', label: 'Dashboard', icon: <Home size={18} /> },
  { key: 'location-master', label: 'Location Master', icon: <Boxes size={18} /> },
  { key: 'sku-master', label: 'SKU Master', icon: <Package size={18} /> },
  { key: 'item-placement', label: 'Item Placement', icon: <MoveRight size={18} /> },
  { key: 'item-retrieval', label: 'Item Retrieval', icon: <MoveLeft size={18} /> },
  { key: 'transfer-rack', label: 'Transfer Rack', icon: <ArrowLeftRight size={18} /> },
  { key: 'sku-search', label: 'SKU Search', icon: <Search size={18} /> },
  { key: 'export-import', label: 'Export / Import', icon: <Import size={18} /> },
  { key: 'print-label', label: 'Print Label', icon: <Printer size={18} /> },
];

export function Sidebar({ activeMenu, setActiveMenu }: SidebarProps) {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      <div className="px-4 py-4 border-b border-gray-200">
        <div className="text-lg font-semibold">WMS</div>
        <div className="text-sm text-gray-500">Warehouse Management</div>
      </div>
      <nav className="flex-1 overflow-auto py-2">
        {MENU_ITEMS.map((item) => {
          const isActive = activeMenu === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setActiveMenu(item.key)}
              className={`w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-50 ${
                isActive ? 'bg-gray-100 font-medium border-l-2 border-blue-600' : ''
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="px-4 py-3 text-xs text-gray-500 border-t">© {new Date().getFullYear()} WMS</div>
    </aside>
  );
}
