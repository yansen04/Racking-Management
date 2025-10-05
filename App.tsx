import { useState, Suspense } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { LocationMaster } from './components/LocationMaster';
import { SkuMaster } from './components/SkuMaster';
import { ItemPlacement } from './components/ItemPlacement';
import { ItemRetrieval } from './components/ItemRetrieval';
import { TransferRack } from './components/TransferRack';
import { SkuSearch } from './components/SkuSearch';
import { ExportImport } from './components/ExportImport';
import { PrintLabelPage } from './components/PrintLabelPage';

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
    </div>
  );
}

export default function App() {
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const renderContent = () => {
    try {
      switch (activeMenu) {
        case 'dashboard':
          return <Dashboard />;
        case 'location-master':
          return <LocationMaster />;
        case 'sku-master':
          return <SkuMaster />;
        case 'item-placement':
          return <ItemPlacement />;
        case 'item-retrieval':
          return <ItemRetrieval />;
        case 'transfer-rack':
          return <TransferRack />;
        case 'sku-search':
          return <SkuSearch />;
        case 'export-import':
          return <ExportImport />;
        case 'print-label':
          return <PrintLabelPage />;
        default:
          return <Dashboard />;
      }
    } catch (error) {
      console.error('Error rendering component:', error);
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Something went wrong</h2>
            <p className="text-gray-600">Please try refreshing the page</p>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      <main className="flex-1 overflow-auto">
        <Suspense fallback={<LoadingSpinner />}>
          {renderContent()}
        </Suspense>
      </main>
    </div>
  );
}