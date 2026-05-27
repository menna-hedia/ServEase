import { Link, useLocation, useNavigate } from 'react-router';
import { Home, LayoutDashboard, Users, Briefcase, UserCheck, ClipboardList, UserCog, Settings, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { adminLogoutAction } from '../../pages/admin/Login/AdminLoginActions';

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/customers', label: 'Customers', icon: Users },
    { path: '/admin/providers', label: 'Providers', icon: Briefcase },
    { path: '/admin/provider-approval', label: 'Provider Approval', icon: UserCheck },
    { path: '/admin/requests', label: 'Requests', icon: ClipboardList },
    { path: '/admin/admins', label: 'Admins', icon: UserCog },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = () => {
    adminLogoutAction();

    toast.success('Logged out successfully');

    navigate('/admin/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-64 min-h-screen bg-secondary text-white p-6">
      <Link to="/admin/dashboard" className="flex items-center gap-2 mb-8">
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
          <Home className="w-6 h-6" />
        </div>
        <span className="text-xl font-bold">ServEase Admin</span>
      </Link>

      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive(item.path)
                ? 'bg-primary'
                : 'hover:bg-white/10'
              }`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <Link
        to="/"
        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors mt-8 text-red-300"
        onClick={handleLogout} >
        <LogOut className="w-5 h-5" />
        <span>Logout</span>
      </Link>
    </div>
  );
}
