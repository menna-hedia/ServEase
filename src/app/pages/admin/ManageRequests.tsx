import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Eye, FileX } from 'lucide-react';
import { toast } from 'sonner';
import AdminSidebar from '../../components/layout/AdminSidebar';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import { SkeletonCard } from '../../components/ui/Skeleton';

type RequestStatus = 'confirmed' | 'waiting' | 'pending' | 'completed' | 'rejected' | 'outdated';

const requests = [
  { id: 1, customer: 'Sarah Johnson', provider: 'Robert Johnson', service: 'Electrician', date: '2026-05-18', status: 'confirmed' as RequestStatus, price: 200 },
  { id: 2, customer: 'Mike Chen', provider: 'Maria Garcia', service: 'Plumber', date: '2026-05-19', status: 'waiting' as RequestStatus, price: null },
  { id: 3, customer: 'Mike Chen', provider: 'Maria Garcia', service: 'Plumber', date: '2026-05-19', status: 'pending' as RequestStatus, price: null },
];

export default function ManageRequests() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleCancelRequest = () => {
    toast.success('Request cancelled successfully');
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Manage Requests</h1>
          <p className="text-muted-foreground">Monitor and manage service requests</p>
        </div>

        <Card>
          {loading ? (
            <SkeletonCard />
          ) : requests.length === 0 ? (
            <EmptyState
              icon={<FileX className="w-10 h-10 text-muted-foreground" />}
              title="No requests found"
              description="There are no service requests in the system yet."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-3 font-medium">Customer</th>
                    <th className="text-left p-3 font-medium">Provider</th>
                    <th className="text-left p-3 font-medium">Service</th>
                    <th className="text-left p-3 font-medium">Date</th>
                    <th className="text-left p-3 font-medium">Status</th>
                    <th className="text-left p-3 font-medium">Price</th>
                    <th className="text-left p-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr key={request.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                      <td className="p-3">{request.customer}</td>
                      <td className="p-3">{request.provider}</td>
                      <td className="p-3">{request.service}</td>
                      <td className="p-3">{new Date(request.date).toLocaleDateString()}</td>
                      <td className="p-3">
                        <Badge variant={request.status}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="p-3">{request.price ? `$${request.price}` : '-'}</td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <Link to={`/admin/requests/${request.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button variant="destructive" size="sm" onClick={handleCancelRequest}>
                            Cancel
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
