// import { useState, useEffect } from 'react';
// import { useParams, useNavigate, useLocation } from 'react-router-dom';
// import { ArrowLeft, MapPin, Calendar, Clock, User, DollarSign, Check, CheckCircle, X, Loader2, Star } from 'lucide-react';
// import { toast } from 'sonner';
// import CustomerNavbar from '../../../components/layout/CustomerNavbar';
// import Card from '../../../components/ui/Card';
// import Button from '../../../components/ui/Button';
// import Modal from '../../../components/ui/Modal';
// import { getRequestDetails, cancelRequest, acceptOffer, rejectOffer } from './MyRequestsActions';

// const DEFAULT_AVATAR = 'https://i.pinimg.com/736x/07/fb/34/07fb3452c4640d881a16d08c2e314f3e.jpg';

// const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
//   confirmed: { bg: 'bg-green-100',   text: 'text-green-700',   label: 'Confirmed'  },
//   waiting:   { bg: 'bg-orange-100',  text: 'text-orange-700',  label: 'Waiting'    },
//   pending:   { bg: 'bg-yellow-100',  text: 'text-yellow-700',  label: 'Pending'    },
//   completed: { bg: 'bg-emerald-100', text: 'text-emerald-800', label: 'Completed'  },
//   refused:   { bg: 'bg-red-100',     text: 'text-red-700',     label: 'Refused'    },
//   outdated:  { bg: 'bg-gray-100',    text: 'text-gray-600',    label: 'Outdated'   },
//   cancelled: { bg: 'bg-rose-100',    text: 'text-rose-700',    label: 'Cancelled'  },
//   open:      { bg: 'bg-blue-100',    text: 'text-blue-700',    label: 'Open'       },
// };

// function StatusBadge({ status }: { status: string }) {
//   const key = status?.toLowerCase() ?? '';
//   const style = STATUS_STYLES[key] ?? { bg: 'bg-gray-100', text: 'text-gray-600', label: status };
//   return (
//     <span className={`inline-flex items-center px-3 py-2 rounded-full text-xs font-semibold ${style.bg} ${style.text}`}>
//       {style.label}
//     </span>
//   );
// }

// export default function CustomerRequestDetails() {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [request,       setRequest]       = useState<any>(location.state?.request || null);
//   const [loadingRequest, setLoadingRequest] = useState(true);
//   const [currentStatus, setCurrentStatus] = useState(location.state?.request?.status || '');

//   const [showCancelModal, setShowCancelModal] = useState(false);
//   const [isCancelling,    setIsCancelling]    = useState(false);
//   const [isAccepting,     setIsAccepting]     = useState(false);
//   const [isRejecting,     setIsRejecting]     = useState(false);
//   const [providerHourPrice, setProviderHourPrice] = useState<number | null>(null);

//   useEffect(() => {
//     if (!request?.provider?._id || request?.paymentMode !== 'HOURLY') return;

//     const fetchProviderRate = async () => {
//       const token = localStorage.getItem('access_token');
//       const res = await fetch(`/api/customer/providers/rate/${request.provider._id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (!res.ok) return;
//       const data = await res.json();
//       if (data.hourPrice) setProviderHourPrice(data.hourPrice);
//     };

//     fetchProviderRate();
//   }, [request]);

//   // ── Fetch ────────────────────────────────────────────────
//   useEffect(() => {
//     if (!id) return;

//     const load = async () => {
//       setLoadingRequest(true);
//       const result = await getRequestDetails(id);
//       setLoadingRequest(false);

//       if (result.success) {
//         setRequest(result.data);
//         setCurrentStatus(result.data?.status || '');
//       } else {
//         if (!request) toast.error(result.error || 'Failed to load request details');
//       }
//     };

//     load();
//   }, [id]);

//   // ── Handlers ─────────────────────────────────────────────
//   const handleAcceptOffer = async () => {
//     setIsAccepting(true);
//     const result = await acceptOffer(id!);
//     setIsAccepting(false);

//     if (result.success) {
//       toast.success(result.message || 'Offer accepted!');
//       setCurrentStatus('CONFIRMED');
//     } else {
//       toast.error(result.error || 'Failed to accept offer');
//     }
//   };

//   const handleRejectOffer = async () => {
//     setIsRejecting(true);
//     const result = await rejectOffer(id!);
//     setIsRejecting(false);

//     if (result.success) {
//       toast.success(result.message || 'Offer rejected');
//       setCurrentStatus('REFUSED');
//     } else {
//       toast.error(result.error || 'Failed to reject offer');
//     }
//   };

//   const handleCancel = async () => {
//     setIsCancelling(true);
//     const result = await cancelRequest(id!);
//     setIsCancelling(false);

//     if (result.success) {
//       toast.success('Request cancelled successfully');
//       setCurrentStatus('REFUSED');
//       setShowCancelModal(false);
//     } else {
//       toast.error(result.error || 'Failed to cancel request');
//     }
//   };

//   const handleComplete = () => {
//     navigate('/complete-service', { state: { requestId: id } });
//   };

//   const calcHourlyPrice = (start: string, end: string, hourPrice: number) => {
//     if (!start || !end || !hourPrice) return null;
//     const [sh, sm] = start.split(':').map(Number);
//     const [eh, em] = end.split(':').map(Number);
//     const hours = (Math.ceil((eh * 60 + em) - (sh * 60 + sm))) / 60;
//     if (hours <= 0) return null;
//     return Math.ceil(hours * hourPrice);
//   };

//   // ── Loading ───────────────────────────────────────────────
//   if (loadingRequest && !request) {
//     return (
//       <div className="min-h-screen bg-background">
//         <CustomerNavbar />
//         <div className="flex-1 flex flex-col items-center justify-center gap-4 py-40">
//           <Loader2 className="w-8 h-8 animate-spin text-primary" />
//           <p className="text-muted-foreground">Loading request details...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!request) {
//     return (
//       <div className="min-h-screen bg-background">
//         <CustomerNavbar />
//         <div className="flex-1 flex flex-col items-center justify-center gap-4 py-20">
//           <p className="text-muted-foreground">Request not found.</p>
//           <Button onClick={() => navigate('/customer/requests')}>Back to Requests</Button>
//         </div>
//       </div>
//     );
//   }

//   // ── Helpers ───────────────────────────────────────────────
//   const status = (currentStatus || '').toLowerCase();
//   const provider = request.provider;

//   const getProviderName = (p: any) =>
//     p?.userName ||
//     (p?.firstName && p?.lastName ? `${p.firstName} ${p.lastName}` : null) ||
//     '—';

//   const locationStr = [
//     request.exactLocation,
//     request.street,
//     request.city,
//     request.governorate,
//   ].filter(Boolean).join(', ');

//   // ── Render ────────────────────────────────────────────────
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

//           {/* ── Left column ── */}
//           <div className="lg:col-span-2 space-y-6">
//             <Card>
//               <div className="flex items-center justify-between mb-6">
//                 <h1 className="text-2xl font-bold">
//                   Request{' '}
//                   <span className="text-muted-foreground text-lg">
//                     #{(request._id || request.id)?.slice(-6)}
//                   </span>
//                 </h1>
//                 <StatusBadge status={status} />
//               </div>

//               <div className="grid md:grid-cols-2 gap-4">
//                 {/* Service */}
//                 <div className="flex items-start gap-3">
//                   <DollarSign className="w-5 h-5 text-primary mt-0.5 shrink-0" />
//                   <div>
//                     <p className="font-semibold text-sm">Service</p>
//                     <p className="text-muted-foreground text-sm">{request.serviceNeeded || '—'}</p>
//                   </div>
//                 </div>

//                 {/* Date */}
//                 {request.dateNeeded && (
//                   <div className="flex items-start gap-3">
//                     <Calendar className="w-5 h-5 text-primary mt-0.5 shrink-0" />
//                     <div>
//                       <p className="font-semibold text-sm">Date Needed</p>
//                       <p className="text-muted-foreground text-sm">
//                         {new Date(request.dateNeeded).toLocaleDateString('en-US', {
//                           weekday: 'long',
//                           year: 'numeric',
//                           month: 'long',
//                           day: 'numeric',
//                         })}
//                       </p>
//                     </div>
//                   </div>
//                 )}

//                 {/* Time */}
//                 {request.startTime && (
//                   <div className="flex items-start gap-3">
//                     <Clock className="w-5 h-5 text-primary mt-0.5 shrink-0" />
//                     <div>
//                       <p className="font-semibold text-sm">Time</p>
//                       <p className="text-muted-foreground text-sm">
//                         {request.startTime}
//                         {request.endTime ? ` → ${request.endTime}` : ''}
//                       </p>
//                     </div>
//                   </div>
//                 )}

//                 {/* Location */}
//                 {locationStr && (
//                   <div className="flex items-start gap-3 md:col-span-2">
//                     <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
//                     <div>
//                       <p className="font-semibold text-sm">Location</p>
//                       <p className="text-muted-foreground text-sm">{locationStr}</p>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* Price */}
//               {request.price > 0 ? (
//                 <div className="flex items-start gap-3 md:col-span-2">
//                   <DollarSign className="w-5 h-5 text-primary mt-0.5 shrink-0" />
//                   <div>
//                     <p className="font-semibold text-sm">Price</p>
//                     <p className="text-muted-foreground text-sm">EGP {request.price}</p>
//                   </div>
//                 </div>
//               ) : request.paymentMode === 'HOURLY' ? (
//                 <div className="flex items-start gap-3 md:col-span-2">
//                   <DollarSign className="w-5 h-5 text-primary mt-0.5 shrink-0" />
//                   {(() => {
//                     const hourPrice = request.provider?.hourPrice;
//                     const estimated = calcHourlyPrice(
//                       request.startTime,
//                       request.endTime,
//                       hourPrice
//                     );

//                     return estimated ? (
//                       <div>
//                         <p className="font-semibold text-sm">Price</p>
//                         <p className="text-muted-foreground text-sm">EGP {estimated} (EGP {hourPrice}/hr)</p>
//                       </div>
//                     ) : (
//                       <span className="text-sm text-muted-foreground">
//                         Hourly rate — contact provider for pricing
//                       </span>
//                     );
//                   })()}
//                 </div>
//               ) : null}

//               {/* Pending — Accept / Reject offer */}
//               {status === 'pending' && (
//                 <div className="mt-6 pt-6 border-t border-border">
//                   <p className="text-sm text-muted-foreground mb-3">
//                     The provider submitted an offer. Review and respond.
//                   </p>
//                   <div className="flex gap-3">
//                     <Button
//                       variant="success"
//                       className="flex-1"
//                       disabled={isAccepting}
//                       onClick={handleAcceptOffer}
//                     >
//                       <Check className="w-4 h-4" />
//                       {isAccepting ? 'Accepting...' : 'Accept Offer'}
//                     </Button>
//                     <Button
//                       variant="destructive"
//                       className="flex-1"
//                       disabled={isRejecting}
//                       onClick={handleRejectOffer}
//                     >
//                       <X className="w-4 h-4" />
//                       {isRejecting ? 'Rejecting...' : 'Reject Offer'}
//                     </Button>
//                   </div>
//                 </div>
//               )}

//               {/* Confirmed — Complete / Cancel */}
//               {status === 'confirmed' && (
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
//           </div>

//           {/* ── Right column ── */}
//           <div className="space-y-6">

//             {/* Provider */}
//             <Card>
//               <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
//                 <User className="w-5 h-5" /> Provider
//               </h2>
//               <div className="flex flex-col items-center text-center">
//                 <img
//                   src={provider?.profileURL || DEFAULT_AVATAR}
//                   alt={getProviderName(provider)}
//                   className="w-20 h-20 rounded-full mb-3 border-4 border-primary object-cover"
//                   onError={(e) => {
//                     (e.currentTarget as HTMLImageElement).src = DEFAULT_AVATAR;
//                   }}
//                 />
//                 <h3 className="font-semibold text-lg">{getProviderName(provider)}</h3>

//                 {provider?.service?.name && (
//                   <p className="text-sm text-muted-foreground mb-2">{provider.service.name}</p>
//                 )}

//                 {provider?.averageRating > 0 && (
//                   <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-full mt-1">
//                     <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
//                     <span className="text-yellow-700 font-semibold text-sm">
//                       {provider.averageRating.toFixed(1)}
//                     </span>
//                   </div>
//                 )}

//                 {provider?.mobileNumber && status === 'confirmed' && (
//                   <p className="text-sm text-muted-foreground mt-2">{provider.mobileNumber}</p>
//                 )}
//                 {provider?.email && status === 'confirmed' && (
//                   <p className="text-sm text-muted-foreground">{provider.email}</p>
//                 )}
//               </div>
//             </Card>

//             {/* Map */}
//             {locationStr && (
//               <Card>
//                 <h3 className="font-semibold mb-3 flex items-center gap-2">
//                   <MapPin className="w-4 h-4" /> Location
//                 </h3>
//                 <p className="text-sm text-muted-foreground mb-3">{locationStr}</p>
//                 <div className="rounded-xl overflow-hidden border border-border">
//                   <iframe
//                     title="Service Location"
//                     src={`https://maps.google.com/maps?q=${encodeURIComponent(locationStr)}&output=embed&iwloc=&z=15`}
//                     className="w-full h-48 border-0"
//                     loading="lazy"
//                     referrerPolicy="no-referrer-when-downgrade"
//                   />
//                 </div>
//                 <a
//                   href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationStr)}`}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="flex items-center gap-2 mt-3 text-sm text-primary hover:underline"
//                 >
//                   <MapPin className="w-4 h-4" />
//                   Open in Google Maps
//                 </a>
//               </Card>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Cancel Modal */}
//       <Modal
//         isOpen={showCancelModal}
//         onClose={() => setShowCancelModal(false)}
//         title="Cancel Request"
//         size="sm"
//       >
//         <div className="space-y-4">
//           <p className="text-sm text-muted-foreground">
//             Are you sure you want to cancel this request? This action cannot be undone.
//           </p>
//           <div className="flex gap-3">
//             <Button
//               variant="outline"
//               onClick={() => setShowCancelModal(false)}
//               className="flex-1"
//               disabled={isCancelling}
//             >
//               No, Keep It
//             </Button>
//             <Button
//               variant="destructive"
//               onClick={handleCancel}
//               className="flex-1"
//               disabled={isCancelling}
//             >
//               {isCancelling ? 'Cancelling...' : 'Yes, Cancel'}
//             </Button>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// }

import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Clock, User, DollarSign, Check, CheckCircle, X, Loader2, Star } from 'lucide-react';
import { toast } from 'sonner';
import CustomerNavbar from '../../../components/layout/CustomerNavbar';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import { getRequestDetails, cancelRequest, acceptOffer, rejectOffer, getProviderHourPrice } from './MyRequestsActions';

const DEFAULT_AVATAR = 'https://i.pinimg.com/736x/07/fb/34/07fb3452c4640d881a16d08c2e314f3e.jpg';

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  confirmed: { bg: 'bg-green-100',   text: 'text-green-700',   label: 'Confirmed'  },
  waiting:   { bg: 'bg-orange-100',  text: 'text-orange-700',  label: 'Waiting'    },
  pending:   { bg: 'bg-yellow-100',  text: 'text-yellow-700',  label: 'Pending'    },
  completed: { bg: 'bg-emerald-100', text: 'text-emerald-800', label: 'Completed'  },
  refused:   { bg: 'bg-red-100',     text: 'text-red-700',     label: 'Refused'    },
  outdated:  { bg: 'bg-gray-100',    text: 'text-gray-600',    label: 'Outdated'   },
  cancelled: { bg: 'bg-rose-100',    text: 'text-rose-700',    label: 'Cancelled'  },
  open:      { bg: 'bg-blue-100',    text: 'text-blue-700',    label: 'Open'       },
};

function StatusBadge({ status }: { status: string }) {
  const key = status?.toLowerCase() ?? '';
  const style = STATUS_STYLES[key] ?? { bg: 'bg-gray-100', text: 'text-gray-600', label: status };
  return (
    <span className={`inline-flex items-center px-3 py-2 rounded-full text-xs font-semibold ${style.bg} ${style.text}`}>
      {style.label}
    </span>
  );
}

export default function CustomerRequestDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [request,       setRequest]       = useState<any>(location.state?.request || null);
  const [loadingRequest, setLoadingRequest] = useState(true);
  const [currentStatus, setCurrentStatus] = useState(location.state?.request?.status || '');

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling,    setIsCancelling]    = useState(false);
  const [isAccepting,     setIsAccepting]     = useState(false);
  const [isRejecting,     setIsRejecting]     = useState(false);
  const [providerHourPrice, setProviderHourPrice] = useState<number | null>(null);

  useEffect(() => {
    if (!request?.provider?._id || request?.paymentMode !== 'HOURLY') return;

    const fetchProviderRate = async () => {
      const hourPrice = await getProviderHourPrice(request.provider._id);
      if (hourPrice) setProviderHourPrice(hourPrice);
    };

    fetchProviderRate();
  }, [request]);

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

  // Pass paymentMode along so the completion screen knows whether to call
  // /complete (FIXED) or /complete-hourly (HOURLY) without re-fetching the request.
  const handleComplete = () => {
    navigate('/complete-service', {
      state: { requestId: id, paymentMode: request.paymentMode },
    });
  };

  const calcHourlyPrice = (start: string, end: string, hourPrice: number) => {
    if (!start || !end || !hourPrice) return null;
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    const hours = (Math.ceil((eh * 60 + em) - (sh * 60 + sm))) / 60;
    if (hours <= 0) return null;
    return Math.ceil(hours * hourPrice);
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
  const status = (currentStatus || '').toLowerCase();
  const provider = request.provider;
  const isHourly = request.paymentMode === 'HOURLY';

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
                <StatusBadge status={status} />
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
              {status === 'completed' && isHourly ? (
                <div className="flex items-start gap-3 md:col-span-2">
                  <DollarSign className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Price</p>
                    <p className="text-muted-foreground text-sm">
                      EGP {request.price}
                      {request.hoursWorked != null && ` (${request.hoursWorked} hours worked)`}
                    </p>
                  </div>
                </div>
              ) : request.price > 0 ? (
                <div className="flex items-start gap-3 md:col-span-2">
                  <DollarSign className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Price</p>
                    <p className="text-muted-foreground text-sm">EGP {request.price}</p>
                  </div>
                </div>
              ) : isHourly ? (
                // HOURLY before completion: price is expected to be null — this is normal, not an error.
                <div className="flex items-start gap-3 md:col-span-2">
                  <DollarSign className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  {(() => {
                    const hourPrice = request.provider?.hourPrice ?? providerHourPrice;
                    const estimated = calcHourlyPrice(
                      request.startTime,
                      request.endTime,
                      hourPrice
                    );

                    return estimated ? (
                      <div>
                        <p className="font-semibold text-sm">Estimated Price</p>
                        <p className="text-muted-foreground text-sm">EGP {estimated} (EGP {hourPrice}/hr)</p>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        Hourly rate — price will be calculated after completion
                      </span>
                    );
                  })()}
                </div>
              ) : null}

              {/* Pending — Accept / Reject offer */}
              {status === 'pending' && (
                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-3">
                    The provider submitted an offer. Review and respond.
                  </p>
                  <div className="flex gap-3">
                    <Button
                      variant="success"
                      className="flex-1"
                      disabled={isAccepting}
                      onClick={handleAcceptOffer}
                    >
                      <Check className="w-4 h-4" />
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