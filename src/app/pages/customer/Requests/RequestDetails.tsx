// import { useState } from 'react';
// import { useNavigate } from 'react-router';
// import { ArrowLeft, MapPin, Calendar, DollarSign, Clock, User, CheckCircle, X } from 'lucide-react';
// import { toast } from 'sonner';
// import CustomerNavbar from '../../../components/layout/CustomerNavbar';
// import Card from '../../../components/ui/Card';
// import Badge from '../../../components/ui/Badge';
// import Button from '../../../components/ui/Button';
// import Modal from '../../../components/ui/Modal';

// const mockRequest = {
//   id: 1,
//   customer: {
//     name: 'Sarah Johnson',
//     photo: 'https://i.pravatar.cc/150?img=1',
//     email: 'sarah@example.com',
//     phone: '+1 555-0101',
//     city: 'New York',
//     state: 'NY',
//   },
//   provider: {
//     name: 'Robert Johnson',
//     photo: 'https://i.pravatar.cc/150?img=12',
//     email: 'robert@example.com',
//     phone: '+1 555-0102',
//     rating: 4.9,
//     category: 'Electrician',
//   },
//   description: 'Fix electrical outlet in kitchen and check wiring in living room',
//   requestDate: '2026-05-10',
//   scheduledDate: '2026-05-20',
//   scheduledTime: '10:00 AM',
//   endTime: '12:00 PM',
//   status: 'confirmed' as const,
//   price: 200,
//   location: {
//     address: '123 Main Street',
//     city: 'New York',
//     state: 'NY',
//     zipCode: '10001',
//   },
//   timeline: [
//     { status: 'Request Submitted', date: '2026-05-10 09:30 AM', completed: true },
//     { status: 'Provider Accepted', date: '2026-05-10 02:15 PM', completed: true },
//     { status: 'Offer Accepted', date: '2026-05-10 03:00 PM', completed: true },
//     { status: 'Service Scheduled', date: '2026-05-20 10:00 AM', completed: false },
//     { status: 'Service Completed', date: 'Pending', completed: false },
//   ],
// };

// export default function CustomerRequestDetails() {
//   const navigate = useNavigate();
//   const [showCancelModal, setShowCancelModal] = useState(false);

//   const handleCancel = () => {
//     toast.success('Service cancelled successfully');
//     setShowCancelModal(false);
//     navigate('/customer/requests');
//   };

//   const handleComplete = () => {
//     navigate('/complete-service', { state: { requestId: mockRequest.id } });
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <CustomerNavbar />

//       <div className="container mx-auto px-4 lg:px-8 py-8">
//         <button
//           onClick={() => navigate('/customer/requests')}
//           className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
//         >
//           <ArrowLeft className="w-5 h-5" />
//           Back to Requests
//         </button>

//         <div className="grid lg:grid-cols-3 gap-6">
//           <div className="lg:col-span-2 space-y-6">
//             <Card>
//               <div className="flex items-center justify-between mb-6">
//                 <h1 className="text-2xl font-bold">Request Details</h1>
//                 <Badge variant={mockRequest.status}>
//                   {mockRequest.status.charAt(0).toUpperCase() + mockRequest.status.slice(1)}
//                 </Badge>
//               </div>

//               <div className="space-y-4">
//                 <div>
//                   <h3 className="font-semibold mb-2">Description</h3>
//                   <p className="text-muted-foreground">{mockRequest.description}</p>
//                 </div>

//                 <div className="grid md:grid-cols-2 gap-4">
//                   <div className="flex items-start gap-3">
//                     <Calendar className="w-5 h-5 text-primary mt-0.5" />
//                     <div>
//                       <p className="font-semibold">Scheduled Date</p>
//                       <p className="text-muted-foreground">
//                         {new Date(mockRequest.scheduledDate).toLocaleDateString('en-US', {
//                           weekday: 'long',
//                           year: 'numeric',
//                           month: 'long',
//                           day: 'numeric',
//                         })}
//                       </p>
//                     </div>
//                   </div>

//                   <div className="flex items-start gap-3">
//                     <Clock className="w-5 h-5 text-primary mt-0.5" />
//                     <div>
//                       <p className="font-semibold">Time</p>
//                       <p className="text-muted-foreground">
//                         {mockRequest.scheduledTime} - {mockRequest.endTime}
//                       </p>
//                     </div>
//                   </div>

//                   <div className="flex items-start gap-3">
//                     <DollarSign className="w-5 h-5 text-primary mt-0.5" />
//                     <div>
//                       <p className="font-semibold">Price</p>
//                       <p className="text-2xl font-bold text-primary">${mockRequest.price}</p>
//                     </div>
//                   </div>

//                   <div className="flex items-start gap-3">
//                     <MapPin className="w-5 h-5 text-primary mt-0.5" />
//                     <div>
//                       <p className="font-semibold">Location</p>
//                       <p className="text-muted-foreground">
//                         {mockRequest.location.address}
//                         <br />
//                         {mockRequest.location.city}, {mockRequest.location.state}{' '}
//                         {mockRequest.location.zipCode}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {mockRequest.status === 'confirmed' && (
//                 <div className="flex gap-3 mt-6 pt-6 border-t border-border">
//                   <Button className="flex-1" onClick={handleComplete}>
//                     <CheckCircle className="w-4 h-4" />
//                     Complete Service
//                   </Button>
//                   <Button
//                     variant="destructive"
//                     className="flex-1"
//                     onClick={() => setShowCancelModal(true)}
//                   >
//                     <X className="w-4 h-4" />
//                     Cancel Service
//                   </Button>
//                 </div>
//               )}
//             </Card>

//             {/* <Card>
//               <h2 className="text-xl font-bold mb-6">Status Timeline</h2>
//               <div className="space-y-4">
//                 {mockRequest.timeline.map((item, index) => (
//                   <div key={index} className="flex gap-4">
//                     <div className="flex flex-col items-center">
//                       <div
//                         className={`w-10 h-10 rounded-full flex items-center justify-center ${
//                           item.completed
//                             ? 'bg-success text-white'
//                             : 'bg-muted text-muted-foreground'
//                         }`}
//                       >
//                         {item.completed ? (
//                           <CheckCircle className="w-5 h-5" />
//                         ) : (
//                           <div className="w-3 h-3 rounded-full bg-current" />
//                         )}
//                       </div>
//                       {index < mockRequest.timeline.length - 1 && (
//                         <div className="w-0.5 h-12 bg-border" />
//                       )}
//                     </div>
//                     <div className="flex-1 pb-8">
//                       <p className="font-semibold">{item.status}</p>
//                       <p className="text-sm text-muted-foreground">{item.date}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </Card> */}
//           </div>

//           <div className="space-y-6">
//             <Card>
//               <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
//                 <User className="w-5 h-5" />
//                 Provider Information
//               </h2>
//               <div className="flex flex-col items-center text-center mb-4">
//                 <img
//                   src={mockRequest.provider.photo}
//                   alt={mockRequest.provider.name}
//                   className="w-20 h-20 rounded-full mb-3 border-4 border-primary"
//                 />
//                 <h3 className="font-semibold text-lg">{mockRequest.provider.name}</h3>
//                 <p className="text-sm text-muted-foreground mb-2">{mockRequest.provider.category}</p>
//                 <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-full">
//                   <span className="text-yellow-600 font-semibold">{mockRequest.provider.rating}</span>
//                   <span className="text-yellow-600">★</span>
//                 </div>
//               </div>
//               {/* <div className="space-y-2 pt-4 border-t border-border">
//                 <p className="text-sm">
//                   <span className="text-muted-foreground">Email:</span>
//                   <br />
//                   {mockRequest.provider.email}
//                 </p>
//                 <p className="text-sm">
//                   <span className="text-muted-foreground">Phone:</span>
//                   <br />
//                   {mockRequest.provider.phone}
//                 </p>
//               </div> */}
//             </Card>

//             <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
//               <h3 className="font-semibold mb-2 text-blue-900">Location Map</h3>
//               <div className="aspect-video bg-blue-200 rounded-lg flex items-center justify-center">
//                 <MapPin className="w-12 h-12 text-blue-600" />
//               </div>
//               <p className="text-sm text-blue-800 mt-3">
//                 {mockRequest.location.address}, {mockRequest.location.city}
//               </p>
//             </Card>
//           </div>
//         </div>
//       </div>

//       <Modal
//         isOpen={showCancelModal}
//         onClose={() => setShowCancelModal(false)}
//         title="Cancel Service"
//         size="sm"
//       >
//         <div className="space-y-4">
//           <p>Are you sure you want to cancel this service? This action cannot be undone.</p>
//           <div className="flex gap-3">
//             <Button variant="outline" onClick={() => setShowCancelModal(false)} className="flex-1">
//               No, Keep It
//             </Button>
//             <Button variant="destructive" onClick={handleCancel} className="flex-1">
//               Yes, Cancel
//             </Button>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// }

import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router';
import { ArrowLeft, MapPin, Calendar, Clock, User, DollarSign, CheckCircle, X, Loader2, Star } from 'lucide-react';
import { toast } from 'sonner';
import CustomerNavbar from '../../../components/layout/CustomerNavbar';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import { getRequestDetails, cancelRequest, acceptOffer, rejectOffer } from './MyRequestsActions';

const DEFAULT_AVATAR = 'https://i.pravatar.cc/150?img=1';

export default function CustomerRequestDetails() {
  const { id }   = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [request,        setRequest]        = useState<any>(location.state?.request || null);
  const [loadingRequest, setLoadingRequest] = useState(true);
  const [currentStatus,  setCurrentStatus]  = useState(location.state?.request?.status || '');

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling,    setIsCancelling]    = useState(false);
  const [isAccepting,     setIsAccepting]     = useState(false);
  const [isRejecting,     setIsRejecting]     = useState(false);

  // ── Fetch ────────────────────────────────────────────────
  useEffect(() => {
    if (!id) return;

    const load = async () => {
      setLoadingRequest(true);
      const result = await getRequestDetails(id);
      setLoadingRequest(false);

      if (result.success) {
        setRequest(result.data);
        setCurrentStatus(result.data?.status || '');
      } else {
        if (!request) toast.error(result.error || 'Failed to load request details');
      }
    };

    load();
  }, [id]);

  // ── Handlers ─────────────────────────────────────────────
  const handleAcceptOffer = async () => {
    setIsAccepting(true);
    const result = await acceptOffer(id!);
    setIsAccepting(false);

    if (result.success) {
      toast.success(result.message || 'Offer accepted!');
      setCurrentStatus('CONFIRMED');
    } else {
      toast.error(result.error || 'Failed to accept offer');
    }
  };

  const handleRejectOffer = async () => {
    setIsRejecting(true);
    const result = await rejectOffer(id!);
    setIsRejecting(false);

    if (result.success) {
      toast.success(result.message || 'Offer rejected');
      setCurrentStatus('REFUSED');
    } else {
      toast.error(result.error || 'Failed to reject offer');
    }
  };

  const handleCancel = async () => {
    setIsCancelling(true);
    const result = await cancelRequest(id!);
    setIsCancelling(false);

    if (result.success) {
      toast.success('Request cancelled successfully');
      setCurrentStatus('REFUSED');
      setShowCancelModal(false);
    } else {
      toast.error(result.error || 'Failed to cancel request');
    }
  };

  const handleComplete = () => {
    navigate('/complete-service', { state: { requestId: id } });
  };

  // ── Loading ───────────────────────────────────────────────
  if (loadingRequest && !request) {
    return (
      <div className="min-h-screen bg-background">
        <CustomerNavbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 py-40">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading request details...</p>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-background">
        <CustomerNavbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 py-20">
          <p className="text-muted-foreground">Request not found.</p>
          <Button onClick={() => navigate('/customer/requests')}>Back to Requests</Button>
        </div>
      </div>
    );
  }

  // ── Helpers ───────────────────────────────────────────────
  const status   = (currentStatus || '').toLowerCase();
  const provider = request.provider;

  const getProviderName = (p: any) =>
    p?.userName ||
    (p?.firstName && p?.lastName ? `${p.firstName} ${p.lastName}` : null) ||
    '—';

  const locationStr = [
    request.exactLocation,
    request.street,
    request.city,
    request.governorate,
  ].filter(Boolean).join(', ');

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      <CustomerNavbar />

      <div className="container mx-auto px-4 lg:px-8 py-8">
        <button
          onClick={() => navigate('/customer/requests')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Requests
        </button>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* ── Left column ── */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">
                  Request{' '}
                  <span className="text-muted-foreground text-lg">
                    #{(request._id || request.id)?.slice(-6)}
                  </span>
                </h1>
                <Badge variant={status as any}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Badge>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Service */}
                <div className="flex items-start gap-3">
                  <DollarSign className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Service</p>
                    <p className="text-muted-foreground text-sm">{request.serviceNeeded || '—'}</p>
                  </div>
                </div>

                {/* Date */}
                {request.dateNeeded && (
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-sm">Date Needed</p>
                      <p className="text-muted-foreground text-sm">
                        {new Date(request.dateNeeded).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                )}

                {/* Time */}
                {request.startTime && (
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-sm">Time</p>
                      <p className="text-muted-foreground text-sm">
                        {request.startTime}
                        {request.endTime ? ` → ${request.endTime}` : ''}
                      </p>
                    </div>
                  </div>
                )}

                {/* Location */}
                {locationStr && (
                  <div className="flex items-start gap-3 md:col-span-2">
                    <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-sm">Location</p>
                      <p className="text-muted-foreground text-sm">{locationStr}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Price */}
              {request.price > 0 && (
                <div className="mt-6 pt-6 border-t border-border">
                  <h3 className="font-semibold mb-3">Payment Details</h3>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Service Price</span>
                    <span className="font-bold text-lg text-primary">EGP {request.price}</span>
                  </div>
                </div>
              )}

              {/* Pending — Accept / Reject offer */}
              {status === 'pending' && (
                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-3">
                    The provider submitted an offer. Review and respond.
                  </p>
                  <div className="flex gap-3">
                    <Button
                      className="flex-1"
                      disabled={isAccepting}
                      onClick={handleAcceptOffer}
                    >
                      <CheckCircle className="w-4 h-4" />
                      {isAccepting ? 'Accepting...' : 'Accept Offer'}
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      disabled={isRejecting}
                      onClick={handleRejectOffer}
                    >
                      <X className="w-4 h-4" />
                      {isRejecting ? 'Rejecting...' : 'Reject Offer'}
                    </Button>
                  </div>
                </div>
              )}

              {/* Confirmed — Complete / Cancel */}
              {status === 'confirmed' && (
                <div className="flex gap-3 mt-6 pt-6 border-t border-border">
                  <Button className="flex-1" onClick={handleComplete}>
                    <CheckCircle className="w-4 h-4" />
                    Complete Service
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => setShowCancelModal(true)}
                  >
                    <X className="w-4 h-4" />
                    Cancel Service
                  </Button>
                </div>
              )}

     
            </Card>
          </div>

          {/* ── Right column ── */}
          <div className="space-y-6">

            {/* Provider */}
            <Card>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <User className="w-5 h-5" /> Provider
              </h2>
              <div className="flex flex-col items-center text-center">
                <img
                  src={provider?.profileURL || DEFAULT_AVATAR}
                  alt={getProviderName(provider)}
                  className="w-20 h-20 rounded-full mb-3 border-4 border-primary object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = DEFAULT_AVATAR;
                  }}
                />
                <h3 className="font-semibold text-lg">{getProviderName(provider)}</h3>

                {provider?.service?.name && (
                  <p className="text-sm text-muted-foreground mb-2">{provider.service.name}</p>
                )}

                {provider?.averageRating > 0 && (
                  <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-full mt-1">
                    <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                    <span className="text-yellow-700 font-semibold text-sm">
                      {provider.averageRating.toFixed(1)}
                    </span>
                  </div>
                )}

                {provider?.mobileNumber && status === 'confirmed' && (
                  <p className="text-sm text-muted-foreground mt-2">{provider.mobileNumber}</p>
                )}
                {provider?.email && status === 'confirmed' && (
                  <p className="text-sm text-muted-foreground">{provider.email}</p>
                )}
              </div>
            </Card>

            {/* Map */}
            {locationStr && (
              <Card>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Location
                </h3>
                <p className="text-sm text-muted-foreground mb-3">{locationStr}</p>
                <div className="rounded-xl overflow-hidden border border-border">
                  <iframe
                    title="Service Location"
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(locationStr)}&output=embed&iwloc=&z=15`}
                    className="w-full h-48 border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationStr)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 mt-3 text-sm text-primary hover:underline"
                >
                  <MapPin className="w-4 h-4" />
                  Open in Google Maps
                </a>
              </Card>
            )}
          </div>
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
              No, Keep It
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
  );
}