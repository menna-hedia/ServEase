import { useState, useEffect } from 'react';
import AdminSidebar from '../../components/layout/AdminSidebar';
import Card from '../../components/ui/Card';
import { Users, Briefcase, ClipboardList, TrendingUp, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const [stats,             setStats]             = useState<any>(null);
  const [loading,           setLoading]           = useState(true);
  const [recentActivity,    setRecentActivity]    = useState<any[]>([]);
  const [userGrowthData,    setUserGrowthData]    = useState<{ month: string; users: number }[]>([]);
  const [requestStatusData, setRequestStatusData] = useState([
    { name: 'Completed', value: 0, color: '#22C55E' },
    { name: 'Confirmed', value: 0, color: '#2563EB' },
    { name: 'Waiting',   value: 0, color: '#F59E0B' },
    { name: 'Pending',   value: 0, color: '#8B5CF6' },
    { name: 'Rejected',  value: 0, color: '#EF4444' },
  ]);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');

    // ── Stats ──────────────────────────────────────────────
    const loadStats = async () => {
      try {
        const res = await fetch('/api/admin/dashboard-stats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setStats(data);
        } else {
          toast.error(data.message || 'Failed to load stats');
        }
      } catch {
        toast.error('Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    };

    // ── User Growth ────────────────────────────────────────
    const loadGrowth = async () => {
      try {
        const res = await fetch('/api/common/users-growth', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && Array.isArray(data)) {
          setUserGrowthData(
            data.map((item: any) => ({
              month: item.label,
              users: item.users,
            }))
          );
        }
      } catch {
        // keep empty
      }
    };

    // ── Activity + Request Status ──────────────────────────
    const loadActivity = async () => {
      try {
        const [reqRes, provRes] = await Promise.all([
          fetch('/api/admin/requests?page=1', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/admin/providers?page=1', { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const reqData  = await reqRes.json();
        const provData = await provRes.json();

        const allRequests = Array.isArray(reqData) ? reqData : reqData.requests || reqData.data || [];

        const statusCount = allRequests.reduce((acc: any, r: any) => {
          const s = (r.status || '').toUpperCase();
          acc[s] = (acc[s] || 0) + 1;
          return acc;
        }, {});

        setRequestStatusData([
          { name: 'Completed', value: statusCount['COMPLETED'] || 0, color: '#22C55E' },
          { name: 'Confirmed', value: statusCount['CONFIRMED'] || 0, color: '#2563EB' },
          { name: 'Waiting',   value: statusCount['WAITING']   || 0, color: '#F59E0B' },
          { name: 'Pending',   value: statusCount['PENDING']   || 0, color: '#8B5CF6' },
          { name: 'Rejected',  value: statusCount['REFUSED']   || 0, color: '#EF4444' },
        ]);

        const requests = allRequests.slice(-3).reverse().map((r: any) => ({
          type: 'New Request',
          user: `${r.customerId?.userName || r.customerId?.firstName || 'Customer'} → ${r.providerId?.userName || r.providerId?.firstName || 'Provider'}`,
          time: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '—',
        }));

        const providers = (provData.providers || []).slice(-3).reverse().map((p: any) => ({
          type: 'Provider Registration',
          user: p.userName || `${p.firstName} ${p.lastName}`,
          time: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '—',
        }));

        const combined = [...requests, ...providers]
          .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
          .slice(0, 5);

        setRecentActivity(combined);
      } catch {
        // keep empty
      }
    };

    loadStats();
    loadGrowth();
    loadActivity();
  }, []);

  const statCards = [
    { label: 'Total Users',       value: stats?.totalUsers ?? '—',                                          icon: Users,         color: 'bg-blue-100 text-blue-600'   },
    { label: 'Total Providers',   value: stats?.totalProviders ?? '—',                                      icon: Briefcase,     color: 'bg-purple-100 text-purple-600' },
    { label: 'Total Requests',    value: stats?.totalServiceRequests ?? '—',                                 icon: ClipboardList, color: 'bg-green-100 text-green-600'  },
    { label: 'Revenue',           value: stats?.revenue !== undefined ? `EGP ${stats.revenue}` : '—',       icon: TrendingUp,    color: 'bg-orange-100 text-orange-600' },
    { label: 'Pending Approvals', value: stats?.pendingApprovals ?? '—',                                     icon: Clock,         color: 'bg-yellow-100 text-yellow-600' },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Overview of platform statistics and activity</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat) => (
            <Card key={stat.label} className="hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold">
                    {loading
                      ? <span className="animate-pulse text-muted-foreground">...</span>
                      : stat.value}
                  </p>
                </div>
                <div className={`w-14 h-14 rounded-xl ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-7 h-7" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {!loading && stats?.pendingApprovals > 0 && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <p className="text-yellow-800 font-medium">
              ⚠️ {stats.pendingApprovals} provider{stats.pendingApprovals > 1 ? 's' : ''} pending approval
            </p>
          </div>
        )}

        {/* Charts */}
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

        {/* Recent Activity */}
        <Card>
          <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent activity.</p>
            ) : (
              recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <p className="font-semibold">{activity.type}</p>
                    <p className="text-sm text-muted-foreground">{activity.user}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{activity.time}</p>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}