import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Calendar, DollarSign, Eye, FileX } from 'lucide-react';
import { toast } from 'sonner';
import ProviderNavbar from '../../components/layout/ProviderNavbar';
import Footer from '../../components/layout/Footer';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import EmptyState from '../../components/ui/EmptyState';
import { SkeletonCard } from '../../components/ui/Skeleton';

type RequestStatus = 'all' | 'waiting' | 'confirmed' | 'completed' | 'rejected' | 'outdated';

const mockRequests = [
  {
    id: 1,
    customerName: 'Sarah Johnson',
    customerPhoto: 'https://i.pravatar.cc/150?img=1',
    category: 'Electrician',
    requestDate: '2026-05-10',
    scheduledDate: '2026-05-20',
    status: 'waiting' as const,
    description: 'Fix electrical outlet in kitchen',
    price: null,
  },
  {
    id: 2,
    customerName: 'Mike Chen',
    customerPhoto: 'https://i.pravatar.cc/150?img=12',
    category: 'Electrician',
    requestDate: '2026-05-12',
    scheduledDate: '2026-05-18',
    status: 'confirmed' as const,
    description: 'Install ceiling fan',
    price: 200,
  },
];

export default function ProviderRequests() {
  const [activeTab, setActiveTab] = useState<RequestStatus>('all');
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<typeof mockRequests[0] | null>(null);
  const [offerData, setOfferData] = useState({ price: '', endTime: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const tabs: { value: RequestStatus; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'waiting', label: 'Waiting' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'completed', label: 'Completed' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'outdated', label: 'Outdated' },
  ];

  const filteredRequests =
    activeTab === 'all' ? mockRequests : mockRequests.filter((req) => req.status === activeTab);

  const handleAcceptRequest = (request: typeof mockRequests[0]) => {
    setSelectedRequest(request);
    setShowAcceptModal(true);
  };

  const handleSubmitOffer = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Offer submitted successfully!');
    setShowAcceptModal(false);
    setOfferData({ price: '', endTime: '' });
  };

  const handleRejectRequest = (request: typeof mockRequests[0]) => {
    toast.success('Request rejected');
  };

  return (
    <div className="min-h-screen bg-background">
      <ProviderNavbar />

      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Service Requests</h1>
          <p className="text-muted-foreground">Manage your incoming service requests</p>
        </div>

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
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : filteredRequests.length === 0 ? (
            <EmptyState
              icon={<FileX className="w-10 h-10 text-muted-foreground" />}
              title="No requests found"
              description={`You don't have any ${activeTab === 'all' ? '' : activeTab + ' '}requests yet.`}
            />
          ) : (
            filteredRequests.map((request) => (
            <Card key={request.id}>
              <div className="flex flex-col md:flex-row gap-6">
                <img
                  src={request.customerPhoto}
                  alt={request.customerName}
                  className="w-24 h-24 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                    <div>
                      <h3 className="text-xl font-semibold mb-1">{request.customerName}</h3>
                      <p className="text-sm text-muted-foreground">{request.category}</p>
                    </div>
                    <Badge variant={request.status}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-3">{request.description}</p>
                  <div className="flex items-center gap-2 text-sm mb-4">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>Scheduled: {new Date(request.scheduledDate).toLocaleDateString()}</span>
                  </div>
                  {request.price && (
                    <div className="flex items-center gap-2 mb-4">
                      <DollarSign className="w-5 h-5 text-primary" />
                      <span className="text-xl font-bold">${request.price}</span>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    <Link to={`/provider/requests/${request.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                        View Details
                      </Button>
                    </Link>
                    {request.status === 'waiting' && (
                      <>
                        <Button size="sm" onClick={() => handleAcceptRequest(request)}>
                          Accept Request
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRejectRequest(request)}
                        >
                          Reject Request
                        </Button>
                      </>
                    )}
                    {request.status === 'confirmed' && (
                      <Button variant="destructive" size="sm">
                        Cancel Service
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))
          )}
        </div>
      </div>

      <Modal
        isOpen={showAcceptModal}
        onClose={() => setShowAcceptModal(false)}
        title="Accept Request & Submit Offer"
      >
        <form onSubmit={handleSubmitOffer} className="space-y-4">
          <Input
            type="number"
            label="Price ($)"
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
          <Button type="submit" className="w-full">
            Submit Offer
          </Button>
        </form>
      </Modal>
      <Footer />
    </div>
  );
}
