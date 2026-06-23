import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function CustomerGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    if (!token) {
      toast.error('Please sign in first');
    }
  }, [token]);

  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
}