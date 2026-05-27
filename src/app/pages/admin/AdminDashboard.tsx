import AdminSidebar from '../../components/layout/AdminSidebar';
import Card from '../../components/ui/Card';
import { Users, Briefcase, ClipboardList, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const stats = [
  { label: 'Total Users', value: '20,547', icon: Users, color: 'bg-blue-100 text-blue-600' },
  { label: 'Total Providers', value: '5,123', icon: Briefcase, color: 'bg-purple-100 text-purple-600' },
  { label: 'Total Requests', value: '12,890', icon: ClipboardList, color: 'bg-green-100 text-green-600' },
  { label: 'Revenue', value: '$425K', icon: TrendingUp, color: 'bg-orange-100 text-orange-600' },
];

const userGrowthData = [
  { month: 'Jan', users: 1200 },
  { month: 'Feb', users: 1500 },
  { month: 'Mar', users: 1800 },
  { month: 'Apr', users: 2100 },
  { month: 'May', users: 2500 },
];

const requestStatusData = [
  { name: 'Completed', value: 5234, color: '#22C55E' },
  { name: 'Confirmed', value: 3451, color: '#2563EB' },
  { name: 'Waiting', value: 2876, color: '#F59E0B' },
  { name: 'Rejected', value: 1329, color: '#EF4444' },
];

const recentActivity = [
  { type: 'User Registration', user: 'Sarah Johnson', time: '5 minutes ago' },
  { type: 'New Request', user: 'Mike Chen → Robert Johnson', time: '12 minutes ago' },
  { type: 'Provider Registration', user: 'James Wilson', time: '1 hour ago' },
];

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Overview of platform statistics and activity</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label} className="hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className={`w-14 h-14 rounded-xl ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-7 h-7" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <h2 className="text-xl font-bold mb-6">User Growth</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="users" fill="#2563EB" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <h2 className="text-xl font-bold mb-6">Request Status Distribution</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={requestStatusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {requestStatusData.map((entry) => (
                    <Cell key={`pie-cell-${entry.name}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <Card>
          <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <p className="font-semibold">{activity.type}</p>
                  <p className="text-sm text-muted-foreground">{activity.user}</p>
                </div>
                <p className="text-sm text-muted-foreground">{activity.time}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
