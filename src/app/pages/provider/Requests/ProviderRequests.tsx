import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Calendar, MapPin, Clock, Eye, FileX, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import ProviderNavbar from '../../../components/layout/ProviderNavbar';
import Footer from '../../../components/layout/Footer';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';
import EmptyState from '../../../components/ui/EmptyState';
import { SkeletonCard } from '../../../components/ui/Skeleton';
import {
  getProviderRequests,
  acceptRequest,
  rejectRequest,
  cancelRequest,
} from './ProviderRequestsActions';

type TabStatus = 'all' | 'waiting' | 'pending' | 'confirmed' | 'completed' | 'refused';

const DEFAULT_AVATAR = 'https://i.pravatar.cc/150?img=1';

const tabs: { value: TabStatus; label: string }[] = [
  { value: 'all',       label: 'All'       },
  { value: 'waiting',   label: 'Waiting'   },
  { value: 'pending',   label: 'Pending'   },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'completed', label: 'Completed' },
  { value: 'refused',   label: 'Refused'   },
];

export default function ProviderRequests() {
  const navigate = useNavigate();

  const [requests,          setRequests]          = useState<any[]>([]);
  const [activeTab,         setActiveTab]         = useState<TabStatus>('all');
  const [loading,           setLoading]           = useState(true);
  const [showAcceptModal,   setShowAcceptModal]   = useState(false);
  const [selectedRequest,   setSelectedRequest]   = useState<any | null>(null);
  const [offerData,         setOfferData]         = useState({ price: '', endTime: '' });
  const [isAccepting,       setIsAccepting]       = useState(false);
  const [isRejecting,       setIsRejecting]       = useState<string | null>(null);
  const [isCancelling,      setIsCancelling]      = useState<string | null>(null);

  // ============ FETCH ============
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const result = await getProviderRequests();
      setLoading(false);

      if (result.success) {
        setRequests(result.data);
      } else {
        toast.error(result.error || 'Failed to load requests');
      }
    };

    load();
  }, []);

  // ============ FILTER ============
  const filtered =
    activeTab === 'all'
      ? requests
      : requests.filter(
          (r) => r.status?.toLowerCase() === activeTab
        );

  // ============ ACCEPT ============
  const handleSubmitOffer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRequest || !offerData.price || !offerData.endTime) {
      toast.error('Please fill all fields');
      return;
    }

    setIsAccepting(true);
    const result = await acceptRequest(
      selectedRequest._id || selectedRequest.id,
      Number(offerData.price),
      offerData.endTime
    );
    setIsAccepting(false);

    if (result.success) {
      toast.success(result.message || 'Offer submitted successfully!');
      setRequests((prev) =>
        prev.map((r) =>
          (r._id || r.id) === (selectedRequest._id || selectedRequest.id)
            ? { ...r, status: 'PENDING' }
            : r
        )
      );
      setShowAcceptModal(false);
      setOfferData({ price: '', endTime: '' });
    } else {
      toast.error(result.error || 'Failed to submit offer');
    }
  };

  // ============ REJECT ============
  const handleReject = async (request: any) => {
    const id = request._id || request.id;
    setIsRejecting(id);

    const result = await rejectRequest(id);
    setIsRejecting(null);

    if (result.success) {
      toast.success(result.message || 'Request rejected');
      setRequests((prev) =>
        prev.map((r) =>
          (r._id || r.id) === id ? { ...r, status: 'REFUSED' } : r
        )
      );
    } else {
      toast.error(result.error || 'Failed to reject request');
    }
  };

  // ============ CANCEL ============
  const handleCancel = async (request: any) => {
    const id = request._id || request.id;
    setIsCancelling(id);

    const result = await cancelRequest(id);
    setIsCancelling(null);

    if (result.success) {
      toast.success(result.message || 'Request cancelled');
      setRequests((prev) =>
        prev.map((r) =>
          (r._id || r.id) === id ? { ...r, status: 'REFUSED' } : r
        )
      );
    } else {
      toast.error(result.error || 'Failed to cancel request');
    }
  };

  // ============ HELPERS ============
  const getName = (customer: any) =>
    customer?.userName ||
    (customer?.firstName && customer?.lastName
      ? `${customer.firstName} ${customer.lastName}`
      : null) ||
    '—';

  return (
    <div className="min-h-screen bg-background">
      <ProviderNavbar />

      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Service Requests</h1>
          <p className="text-muted-foreground">Manage your incoming service requests</p>
        </div>

        {/* Tabs */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex gap-2 pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.value
                    ? 'bg-primary text-white'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {tab.label}
                <span className="ml-2 text-xs opacity-70">
                  {tab.value === 'all'
                    ? requests.length
                    : requests.filter(
                        (r) => r.status?.toLowerCase() === tab.value
                      ).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="space-y-4">
          {loading ? (
            <><SkeletonCard /><SkeletonCard /><SkeletonCard /></>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={<FileX className="w-10 h-10 text-muted-foreground" />}
              title="No requests found"
              description={`You don't have any ${activeTab === 'all' ? '' : activeTab + ' '}requests yet.`}
            />
          ) : (
            filtered.map((request) => {
              const id     = request._id || request.id;
              const status = (request.status || '').toLowerCase();
              const customer = request.customer;

              return (
                <Card key={id}>
                  <div className="flex flex-col md:flex-row gap-6">
                    <img
                      src={customer?.profileURL || DEFAULT_AVATAR}
                      alt={getName(customer)}
                      className="w-24 h-24 rounded-xl object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = DEFAULT_AVATAR;
                      }}
                    />
                    <div className="flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                        <div>
                          <h3 className="text-xl font-semibold mb-1">{getName(customer)}</h3>
                          <p className="text-sm text-muted-foreground">{request.serviceNeeded}</p>
                        </div>
                        <Badge variant={status as any}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </Badge>
                      </div>

                      <div className="grid md:grid-cols-2 gap-2 mb-4 text-sm text-muted-foreground">
                        {request.dateNeeded && (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(request.dateNeeded).toLocaleDateString()}</span>
                          </div>
                        )}
                        {request.startTime && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>
                              {request.startTime}
                              {request.endTime ? ` → ${request.endTime}` : ''}
                            </span>
                          </div>
                        )}
                        {(request.city || request.governorate) && (
                          <div className="flex items-center gap-2 md:col-span-2">
                            <MapPin className="w-4 h-4" />
                            <span>
                              {[request.exactLocation, request.street, request.city, request.governorate]
                                .filter(Boolean)
                                .join(', ')}
                            </span>
                          </div>
                        )}
                      </div>

                      {request.price > 0 && (
                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4 text-primary" />
                            <span className="font-bold text-lg">EGP {request.price}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            Earnings: EGP {request.earnings}
                          </span>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            navigate(`/provider/requests/${id}`, { state: { request } })
                          }
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </Button>

                        {status === 'waiting' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedRequest(request);
                                setShowAcceptModal(true);
                              }}
                            >
                              Accept
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              disabled={isRejecting === id}
                              onClick={() => handleReject(request)}
                            >
                              {isRejecting === id ? 'Rejecting...' : 'Reject'}
                            </Button>
                          </>
                        )}

                        {status === 'confirmed' && (
                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={isCancelling === id}
                            onClick={() => handleCancel(request)}
                          >
                            {isCancelling === id ? 'Cancelling...' : 'Cancel'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>

      {/* Accept Modal */}
      <Modal
        isOpen={showAcceptModal}
        onClose={() => setShowAcceptModal(false)}
        title="Accept Request & Submit Offer"
      >
        <form onSubmit={handleSubmitOffer} className="space-y-4">
          <Input
            type="number"
            label="Price (EGP)"
            placeholder="Enter your price"
            value={offerData.price}
            onChange={(e) => setOfferData({ ...offerData, price: e.target.value })}
            required
          />
          <Input
            type="time"
            label="Estimated End Time"
            value={offerData.endTime}
            onChange={(e) => setOfferData({ ...offerData, endTime: e.target.value })}
            required
          />
          <Button type="submit" className="w-full" disabled={isAccepting}>
            {isAccepting ? 'Submitting...' : 'Submit Offer'}
          </Button>
        </form>
      </Modal>

      <Footer />
    </div>
  );
}