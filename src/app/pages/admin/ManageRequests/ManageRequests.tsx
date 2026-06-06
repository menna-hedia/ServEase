import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Eye, FileX, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import AdminSidebar from '../../../components/layout/AdminSidebar';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Modal from '../../../components/ui/Modal';
import EmptyState from '../../../components/ui/EmptyState';
import { SkeletonCard } from '../../../components/ui/Skeleton';
import { getAdminRequests, cancelAdminRequest } from './ManageRequestsActions';

type RequestStatus = 'confirmed' | 'waiting' | 'pending' | 'completed' | 'refused' | 'outdated';

const STATUS_OPTIONS = [
  { value: '',          label: 'All Statuses' },
  { value: 'waiting',   label: 'Waiting'      },
  { value: 'pending',   label: 'Pending'      },
  { value: 'confirmed', label: 'Confirmed'    },
  { value: 'completed', label: 'Completed'    },
  { value: 'refused',  label: 'Refused'     },
  { value: 'outdated',  label: 'Outdated'     },
];

export default function ManageRequests() {
  const navigate = useNavigate();

  const [requests,        setRequests]        = useState<any[]>([]);
  const [allRequests,     setAllRequests]     = useState<any[]>([]); // للـ client-side filter
  const [loading,         setLoading]         = useState(true);
  const [statusFilter,    setStatusFilter]    = useState('');
  const [minPrice,        setMinPrice]        = useState('');
  const [maxPrice,        setMaxPrice]        = useState('');
  const [currentPage,     setCurrentPage]     = useState(1);
  const [totalPages,      setTotalPages]      = useState(1);
  const [totalRequests,   setTotalRequests]   = useState(0);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [requestToCancel, setRequestToCancel] = useState<any | null>(null);
  const [isCancelling,    setIsCancelling]    = useState(false);

  // ============ FETCH ============
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const result = await getAdminRequests(currentPage, statusFilter, minPrice, maxPrice);
      setLoading(false);

      if (result.success) {
        const data = Array.isArray(result.data) ? result.data : [];
        setAllRequests(data);
        setTotalPages(result.totalPages    ?? 1);
        setTotalRequests(result.totalRequests ?? data.length);
      } else {
        toast.error(result.error || 'Failed to load requests');
      }
    };

    load();
  }, [currentPage, statusFilter, minPrice, maxPrice]);

  // reset page on filter change
  useEffect(() => { setCurrentPage(1); }, [statusFilter, minPrice, maxPrice]);

  // ============ CLIENT-SIDE FILTER  ============
  useEffect(() => {
    let filtered = [...allRequests];

    if (statusFilter) {
      filtered = filtered.filter(
        (r) => r.status?.toUpperCase() === statusFilter.toUpperCase()
      );
    }

    if (minPrice) {
      filtered = filtered.filter((r) => r.price >= Number(minPrice));
    }

    if (maxPrice) {
      filtered = filtered.filter((r) => r.price <= Number(maxPrice));
    }

    setRequests(filtered);
  }, [allRequests, statusFilter, minPrice, maxPrice]);

  // ============ CANCEL ============
  const handleCancel = async () => {
    if (!requestToCancel) return;
    setIsCancelling(true);

    const result = await cancelAdminRequest(requestToCancel._id || requestToCancel.id);
    setIsCancelling(false);

    if (result.success) {
      toast.success('Request cancelled successfully');
      setAllRequests((prev) =>
        prev.map((r) =>
          (r._id || r.id) === (requestToCancel._id || requestToCancel.id)
            ? { ...r, status: 'REFUSED' }
            : r
        )
      );
      setShowCancelModal(false);
      setRequestToCancel(null);
    } else {
      toast.error(result.error || 'Failed to cancel request');
    }
  };

  // ============ HELPERS ============
  const getName = (obj: any) =>
    obj?.fullName ||
    (obj?.firstName && obj?.lastName ? `${obj.firstName} ${obj.lastName}` : null) ||
    obj?.userName || obj?.email || '—';

  const getId = (obj: any) => obj?._id || obj?.id;

  const canCancel = (status: string) =>
    ['waiting', 'pending', 'confirmed'].includes(status?.toLowerCase());

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <div className="flex-1 p-8">

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Manage Requests</h1>
          <p className="text-muted-foreground">
            {requests.length} of {totalRequests} requests
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <div className="grid md:grid-cols-4 gap-4">
            <Select
              options={STATUS_OPTIONS}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Min price (EGP)"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Max price (EGP)"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
            <Button
              variant="outline"
              onClick={() => {
                setStatusFilter('');
                setMinPrice('');
                setMaxPrice('');
              }}
            >
              Clear Filters
            </Button>
          </div>
        </Card>

        <Card>
          {loading ? (
            <><SkeletonCard /><SkeletonCard /></>
          ) : requests.length === 0 ? (
            <EmptyState
              icon={<FileX className="w-10 h-10 text-muted-foreground" />}
              title="No requests found"
              description="There are no service requests matching your filter."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-3 font-medium">Customer</th>
                    <th className="text-left p-3 font-medium">Provider</th>
                    <th className="text-left p-3 font-medium">Service</th>
                    <th className="text-left p-3 font-medium ">Date</th>
                    <th className="text-left p-3 font-medium ">Status</th>
                    <th className="text-left p-3 font-medium">Price</th>
                    <th className="text-left p-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => {
                    const id     = request._id || request.id;
                    const status = (request.status || '').toLowerCase() as RequestStatus;

                    return (
                      <tr
                        key={id}
                        className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                      >
                        {/* Customer — clickable */}
                        <td
                          className="p-3 text-sm cursor-pointer hover:opacity-80 font-medium transition-opacity"
                          onClick={() => {
                            const cid = getId(request.customerId);
                            if (cid) navigate(`/admin/details/${cid}`);
                          }}
                        >
                          {getName(request.customerId)}
                        </td>

                        {/* Provider — clickable */}
                        <td
                          className={`p-3 text-sm ${request.providerId ? 'p-3 text-sm cursor-pointer hover:opacity-80 font-medium transition-opacity' : ''}`}
                          onClick={() => {
                            const pid = getId(request.providerId);
                            if (pid) navigate(`/admin/details/${pid}`);
                          }}
                        >
                          {request.providerId ? getName(request.providerId) : '—'}
                        </td>

                        <td className="p-3 text-sm">{request.serviceNeeded || '—'}</td>
                        <td className="p-3 text-sm">
                          {request.dateNeeded
                            ? new Date(request.dateNeeded).toLocaleDateString()
                            : '—'}
                        </td>
                        <td className="p-3">
                          <Badge variant={status} >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </Badge>
                        </td>
                        <td className="p-3 text-sm">
                          {request.price ? `EGP ${request.price}` : '—'}
                        </td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                navigate(`/admin/requests/${id}`, { state: { request } })
                              }
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {canCancel(status) && (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                  setRequestToCancel(request);
                                  setShowCancelModal(true);
                                }}
                              >
                                Cancel
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1 || loading}
            >
              <ChevronLeft className="w-4 h-4" />
              Prev
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || loading}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}

        <Modal
          isOpen={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          title="Cancel Request"
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to cancel this request? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowCancelModal(false)}
                className="flex-1"
                disabled={isCancelling}
              >
                Keep
              </Button>
              <Button
                variant="destructive"
                onClick={handleCancel}
                className="flex-1"
                disabled={isCancelling}
              >
                {isCancelling ? 'Cancelling...' : 'Yes, Cancel'}
              </Button>
            </div>
          </div>
        </Modal>

      </div>
    </div>
  );
}