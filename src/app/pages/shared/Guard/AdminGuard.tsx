import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function AdminGuard({

  children,
}: {
  children: React.ReactNode;
}) {
  const token = localStorage.getItem('admin_token');

  useEffect(() => {
    if (!token) {
      toast.error('Please sign in first');
    }
  }, [token]);

  if (!token) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
}