import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Calendar, DollarSign, X, Check, Eye, Clock, FileX, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import CustomerNavbar from '../../../components/layout/CustomerNavbar';
import Card from '../../../components/ui/Card';
import Footer from '../../../components/layout/Footer';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import EmptyState from '../../../components/ui/EmptyState';
import { SkeletonCard } from '../../../components/ui/Skeleton';
import { getMyRequests, cancelRequest } from './MyRequestsActions';

type RequestStatus = 'all' | 'waiting' | 'pending' | 'confirmed' | 'completed' | 'rejected' | 'outdated';

// ✅ map API uppercase status → component lowercase status
function mapStatus(apiStatus: string): RequestStatus {
  const map: Record<string, RequestStatus> = {
    WAITING: 'waiting',
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    COMPLETED: 'completed',
    REFUSED: 'rejected',
    OUTDATED: 'outdated',
  };
  return map[apiStatus] ?? 'waiting';
}

export default function MyRequestsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<RequestStatus>('all');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  // ============ FETCH REQUESTS ============
  useEffect(() => {
    const loadRequests = async () => {
      setLoading(true);
      const result = await getMyRequests();
      setLoading(false);

      if (result.success) {
        setRequests(result.data);
      } else {
        toast.error(result.error || 'Failed to load requests');
      }
    };

    loadRequests();
  }, []);

  const tabs: { value: RequestStatus; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'waiting', label: 'Waiting' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'completed', label: 'Completed' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'outdated', label: 'Outdated' },
  ];

  const filteredRequests =
    activeTab === 'all'
      ? requests
      : requests.filter((req) => mapStatus(req.status) === activeTab);

  // ============ HANDLERS ============
  const handleCancelRequest = async () => {
    if (!selectedRequest) return;
    setCancelling(true);

    const result = await cancelRequest(selectedRequest._id);
    setCancelling(false);

    if (result.success) {
      toast.success('Request cancelled successfully');
      setRequests((prev) => prev.filter((r) => r._id !== selectedRequest._id));
      setShowCancelModal(false);
      setSelectedRequest(null);
    } else {
      toast.error(result.error || 'Failed to cancel request');
    }
  };

  const handleCompleteService = (request: any) => {
    navigate('/complete-service', { state: { requestId: request._id } });
  };

  return (
    <div className="min-h-screen bg-background">
      <CustomerNavbar />

      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Requests</h1>
          <p className="text-muted-foreground">Track and manage your service requests</p>
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
              </button>
            ))}
          </div>
        </div>

        {/* Requests */}
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
              action={{
                label: 'Browse Services',
                onClick: () => navigate('/customer/services'),
              }}
            />
          ) : (
            filteredRequests.map((request) => {
              const status = mapStatus(request.status);
              return (
                <Card
                  key={request._id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/customer/requests/${request._id}`)}
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-1">
                          {request.serviceNeeded}
                        </h3>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span>{request.governorate}, {request.city}</span>
                        </div>
                      </div>
                      <Badge variant={status === 'all' ? 'default' : status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </Badge>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>
                          {new Date(request.dateNeeded).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{request.startTime} - {request.endTime}</span>
                      </div>
                    </div>

                    {request.price && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-primary" />
                        <span className="text-xl font-bold">${request.price}</span>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div
                      className="flex flex-wrap gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {status === 'waiting' && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowCancelModal(true);
                          }}
                        >
                          <X className="w-4 h-4" />
                          Cancel Request
                        </Button>
                      )}
                      {status === 'pending' && (
                        <>
                          <Button variant="success" size="sm">
                            <Check className="w-4 h-4" />
                            Accept Offer
                          </Button>
                          <Button variant="destructive" size="sm">
                            <X className="w-4 h-4" />
                            Reject Offer
                          </Button>
                        </>
                      )}
                      {status === 'confirmed' && (
                        <>
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => handleCompleteService(request)}
                          >
                            Complete Service
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              setSelectedRequest(request);
                              setShowCancelModal(true);
                            }}
                          >
                            Cancel Service
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>

      {/* Cancel Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Request"
        size="sm"
      >
        <div className="space-y-4">
          <p>Are you sure you want to cancel this request?</p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowCancelModal(false)}
              className="flex-1"
              disabled={cancelling}
            >
              No, Keep It
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelRequest}
              className="flex-1"
              disabled={cancelling}
            >
              {cancelling ? 'Cancelling...' : 'Yes, Cancel'}
            </Button>
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  );
}

// import { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router';
// import { Calendar, DollarSign, X, Check, Eye, Clock, FileX } from 'lucide-react';
// import { toast } from 'sonner';
// import CustomerNavbar from '../../components/layout/CustomerNavbar';
// import Card from '../../components/ui/Card';
// import Footer from '../../components/layout/Footer';
// import Badge from '../../components/ui/Badge';
// import Button from '../../components/ui/Button';
// import Modal from '../../components/ui/Modal';
// import EmptyState from '../../components/ui/EmptyState';
// import { SkeletonCard } from '../../components/ui/Skeleton';

// type RequestStatus = 'all' | 'waiting' | 'pending' | 'confirmed' | 'completed' | 'rejected' | 'outdated';

// const mockRequests = [
//   {
//     id: 1,
//     providerName: 'Robert Johnson',
//     providerPhoto: 'https://i.pravatar.cc/150?img=12',
//     category: 'Electrician',
//     scheduledDate: '2026-05-20',
//     startTime: '09:00',
//     endTime: '11:00',
//     status: 'waiting' as const,
//     price: null,
//     description: 'Fix electrical outlet in kitchen',
//   },
//   {
//     id: 2,
//     providerName: 'Maria Garcia',
//     providerPhoto: 'https://i.pravatar.cc/150?img=5',
//     category: 'Plumber',
//     scheduledDate: '2026-05-18',
//     startTime: '14:00',
//     endTime: '16:00',
//     status: 'pending' as const,
//     price: 150,
//     description: 'Bathroom sink repair',
//   },
//   {
//     id: 3,
//     providerName: 'James Wilson',
//     providerPhoto: 'https://i.pravatar.cc/150?img=15',
//     category: 'Carpenter',
//     scheduledDate: '2026-05-16',
//     startTime: '10:00',
//     endTime: '15:00',
//     status: 'confirmed' as const,
//     price: 300,
//     description: 'Build custom bookshelf',
//   },
//   {
//     id: 4,
//     providerName: 'Sarah Anderson',
//     providerPhoto: 'https://i.pravatar.cc/150?img=9',
//     category: 'Painter',
//     scheduledDate: '2026-05-12',
//     startTime: '08:00',
//     endTime: '17:00',
//     status: 'completed' as const,
//     price: 250,
//     description: 'Living room wall painting',
//   },
// ];

// export default function MyRequestsPage() {
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState<RequestStatus>('all');
//   const [showCancelModal, setShowCancelModal] = useState(false);
//   const [selectedRequest, setSelectedRequest] = useState<typeof mockRequests[0] | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const timer = setTimeout(() => setLoading(false), 800);
//     return () => clearTimeout(timer);
//   }, []);

//   const tabs: { value: RequestStatus; label: string }[] = [
//     { value: 'all', label: 'All' },
//     { value: 'waiting', label: 'Waiting' },
//     { value: 'pending', label: 'Pending' },
//     { value: 'confirmed', label: 'Confirmed' },
//     { value: 'completed', label: 'Completed' },
//     { value: 'rejected', label: 'Rejected' },
//     { value: 'outdated', label: 'Outdated' },
//   ];

//   const filteredRequests =
//     activeTab === 'all'
//       ? mockRequests
//       : mockRequests.filter((req) => req.status === activeTab);

//   const handleCancelRequest = () => {
//     toast.success('Request cancelled successfully');
//     setShowCancelModal(false);
//     setSelectedRequest(null);
//   };

//   const handleAcceptOffer = (request: typeof mockRequests[0]) => {
//     toast.success('Offer accepted! Request confirmed.');
//   };

//   const handleRejectOffer = (request: typeof mockRequests[0]) => {
//     toast.success('Offer rejected');
//   };

//   const handleCompleteService = (request: typeof mockRequests[0]) => {
//     navigate('/complete-service', { state: { requestId: request.id } });
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <CustomerNavbar />

//       <div className="container mx-auto px-4 lg:px-8 py-8">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold mb-2">My Requests</h1>
//           <p className="text-muted-foreground">Track and manage your service requests</p>
//         </div>

//         <div className="mb-6 overflow-x-auto">
//           <div className="flex gap-2 pb-2">
//             {tabs.map((tab) => (
//               <button
//                 key={tab.value}
//                 onClick={() => setActiveTab(tab.value)}
//                 className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
//                   activeTab === tab.value
//                     ? 'bg-primary text-white'
//                     : 'bg-muted text-muted-foreground hover:bg-muted/80'
//                 }`}
//               >
//                 {tab.label}
//               </button>
//             ))}
//           </div>
//         </div>

//         <div className="space-y-4">
//           {loading ? (
//             <>
//               <SkeletonCard />
//               <SkeletonCard />
//               <SkeletonCard />
//             </>
//           ) : filteredRequests.length === 0 ? (
//             <EmptyState
//               icon={<FileX className="w-10 h-10 text-muted-foreground" />}
//               title="No requests found"
//               description={`You don't have any ${activeTab === 'all' ? '' : activeTab + ' '}requests yet. Book a service to get started!`}
//               action={{
//                 label: 'Browse Services',
//                 onClick: () => navigate('/customer/services'),
//               }}
//             />
//           ) : (
//             filteredRequests.map((request) => (
//               <Card
//                 key={request.id}
//                 className="hover:shadow-lg transition-shadow cursor-pointer"
//                 onClick={() => navigate(`/customer/requests/${request.id}`)}
//               >
//                 <div className="flex flex-col md:flex-row gap-6">
//                   <img
//                     src={request.providerPhoto}
//                     alt={request.providerName}
//                     className="w-24 h-24 rounded-xl object-cover"
//                   />
//                   <div className="flex-1">
//                     <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
//                       <div>
//                         <h3 className="text-xl font-semibold mb-1">{request.providerName}</h3>
//                         <p className="text-sm text-muted-foreground">{request.category}</p>
//                       </div>
//                       <Badge variant={request.status}>
//                         {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
//                       </Badge>
//                     </div>
//                     <p className="text-muted-foreground mb-3">{request.description}</p>
//                     <div className="grid sm:grid-cols-2 gap-3 mb-4">
//                       <div className="flex items-center gap-2 text-sm">
//                         <Calendar className="w-4 h-4 text-muted-foreground" />
//                         <span>Scheduled: {new Date(request.scheduledDate).toLocaleDateString()}</span>
//                       </div>
//                       <div className="flex items-center gap-2 text-sm">
//                         <Clock className="w-4 h-4 text-muted-foreground" />
//                         <span>{request.startTime} - {request.endTime}</span>
//                       </div>
//                     </div>
//                     {request.price && (
//                       <div className="flex items-center gap-2 mb-4">
//                         <DollarSign className="w-5 h-5 text-primary" />
//                         <span className="text-xl font-bold">${request.price}</span>
//                       </div>
//                     )}
//                     <div className="flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
//                       {request.status === 'waiting' && (
//                         <Button
//                           variant="destructive"
//                           size="sm"
//                           onClick={() => {
//                             setSelectedRequest(request);
//                             setShowCancelModal(true);
//                           }}
//                         >
//                           <X className="w-4 h-4" />
//                           Cancel Request
//                         </Button>
//                       )}
//                       {request.status === 'pending' && (
//                         <>
//                           <Button
//                             variant="success"
//                             size="sm"
//                             onClick={() => handleAcceptOffer(request)}
//                           >
//                             <Check className="w-4 h-4" />
//                             Accept Offer
//                           </Button>
//                           <Button
//                             variant="destructive"
//                             size="sm"
//                             onClick={() => handleRejectOffer(request)}
//                           >
//                             <X className="w-4 h-4" />
//                             Reject Offer
//                           </Button>
//                         </>
//                       )}
//                       {request.status === 'confirmed' && (
//                         <>
//                           <Button
//                             variant="success"
//                             size="sm"
//                             onClick={() => handleCompleteService(request)}
//                           >
//                             Complete Service
//                           </Button>
//                           <Button
//                             variant="destructive"
//                             size="sm"
//                             onClick={() => {
//                               setSelectedRequest(request);
//                               setShowCancelModal(true);
//                             }}
//                           >
//                             Cancel Service
//                           </Button>
//                         </>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </Card>
//             ))
//           )}
//         </div>
//       </div>

//       <Modal
//         isOpen={showCancelModal}
//         onClose={() => setShowCancelModal(false)}
//         title="Cancel Request"
//         size="sm"
//       >
//         <div className="space-y-4">
//           <p>Are you sure you want to cancel this request?</p>
//           <div className="flex gap-3">
//             <Button variant="outline" onClick={() => setShowCancelModal(false)} className="flex-1">
//               No, Keep It
//             </Button>
//             <Button variant="destructive" onClick={handleCancelRequest} className="flex-1">
//               Yes, Cancel
//             </Button>
//           </div>
//         </div>
//       </Modal>
//       <Footer />
//     </div>
//   );
// }