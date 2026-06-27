import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Menu, X, LogOut, Briefcase, User, Info } from 'lucide-react';
import ChatbotDrawer from '../shared/Chatbot/ChatbotDrawer';
import logo from "../../components/images/logoWhite.png"
import { logoutAction } from '../../pages/auth/logout';
import { toast } from 'sonner';

export default function CustomerNavbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const navItems = [
    { path: '/customer/home', label: 'Home', icon: Home },
    { path: '/customer/services', label: 'Services', icon: Briefcase },
    { path: '/customer/requests', label: 'My Requests', icon: Briefcase },
    { path: '/customer/about', label: 'About', icon: Info },
    { path: '/customer/profile', label: 'Profile', icon: User },
  ];
const [accessToken, setAccessToken] = useState<string | null>(null);

useEffect(() => {
  const token = localStorage.getItem("access_token"); 
  setAccessToken(token);
}, []);
  const isActive = (path: string) => location.pathname === path;
  const handleLogout = () => {
    logoutAction();

    toast.success('Logged out successfully');

    navigate('/admin/login');
  };
  return (
    <>
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/customer/home" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                <img
    src={logo}
    alt="ServEase"
    className="w-8 h-8 object-contain"
  />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              ServEase
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary text-white'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
            onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Link>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-white">
          <div className="container mx-auto px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary text-white'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            ))}
            <Link
              to="/"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-destructive hover:bg-muted"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Link>
          </div>
        </div>
      )}

      
    </nav>
   {accessToken && (
  <ChatbotDrawer token={accessToken} role="customer" />
)}
</>
  );
}

