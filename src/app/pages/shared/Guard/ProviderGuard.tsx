import { Navigate } from 'react-router';

export default function ProviderGuard({ children }: { children: React.ReactNode }) {
  const token    = localStorage.getItem('access_token');
  const approved = localStorage.getItem('provider_approved');

  if (!token) return <Navigate to="/signin" replace />;
  if (approved !== 'true') return <Navigate to="/pending-approval" replace />;

  return <>{children}</>;
}