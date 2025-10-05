import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Package, MapPin, TrendingUp, AlertTriangle } from 'lucide-react';

export function Dashboard() {
  const stats = [
    {
      title: 'Total Locations',
      value: '48',
      icon: MapPin,
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Active POs',
      value: '23',
      icon: Package,
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Occupancy Rate',
      value: '87%',
      icon: TrendingUp,
      change: '+5%',
      changeType: 'positive'
    },
    {
      title: 'Outstanding Items',
      value: '156',
      icon: AlertTriangle,
      change: '-3%',
      changeType: 'negative'
    }
  ];

  const recentActivities = [
    { id: 1, action: 'Item Placement', location: 'SA366', sku: '99001A', time: '10 mins ago' },
    { id: 2, action: 'Transfer', location: 'SA100 → SA200', sku: '99002B', time: '25 mins ago' },
    { id: 3, action: 'Item Retrieval', location: 'SA150', sku: '99003C', time: '1 hour ago' },
    { id: 4, action: 'New PO', location: 'Multiple', sku: 'Various', time: '2 hours ago' },
  ];

  const locationStatus = [
    { level: 'Level 1', total: 10, occupied: 8, utilization: 80 },
    { level: 'Level 2', total: 12, occupied: 10, utilization: 83 },
    { level: 'Level 3', total: 8, occupied: 6, utilization: 75 },
    { level: 'Level 4', total: 10, occupied: 9, utilization: 90 },
    { level: 'Level 5', total: 8, occupied: 7, utilization: 87 },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Overview of warehouse racking system</p>
        </div>
        <Badge variant="outline" className="text-green-600 border-green-600">
          System Online
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-semibold">{stat.value}</p>
                  <p className={`text-sm ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div>
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-gray-600">
                    Location: {activity.location} | SKU: {activity.sku}
                  </p>
                </div>
                <p className="text-sm text-gray-500">{activity.time}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Location Status */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Location Status by Level</h3>
          <div className="space-y-4">
            {locationStatus.map((location) => (
              <div key={location.level} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{location.level}</span>
                  <span className="text-sm text-gray-600">
                    {location.occupied}/{location.total} occupied
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${location.utilization}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Utilization</span>
                  <span>{location.utilization}%</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}