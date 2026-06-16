// // import { useState, useEffect } from 'react';
// // import { useParams, useNavigate } from 'react-router-dom';
// // import { ArrowLeft, Star, Clock, DollarSign, Check, X, Loader2 } from 'lucide-react';
// // import { toast } from 'sonner';
// // import CustomerNavbar from '../../../components/layout/CustomerNavbar';
// // import Card from '../../../components/ui/Card';
// // import Button from '../../../components/ui/Button';
// // import Badge from '../../../components/ui/Badge';
// // import Modal from '../../../components/ui/Modal';
// // import {
// //   getBroadcastOffers,
// //   selectBroadcastOffer,
// //   cancelBroadcastRequest,
// // } from './BroadcastActions';

// // export default function BroadcastOffersPage() {
// //   const { requestId } = useParams<{ requestId: string }>();
// //   const navigate = useNavigate();

// //   const [offers, setOffers] = useState<any[]>([]);
// //   const [requestStatus, setRequestStatus] = useState('');
// //   const [loading, setLoading] = useState(true);
// //   const [selecting, setSelecting] = useState<string | null>(null);
// //   const [showCancelModal, setShowCancelModal] = useState(false);
// //   const [cancelling, setCancelling] = useState(false);

// //   const fetchOffers = async () => {
// //     if (!requestId) return;
// //     setLoading(true);
// //     const res = await getBroadcastOffers(requestId);
// //     if (res.success) {
// //       setOffers(res.data.offers);
// //       setRequestStatus(res.data.requestStatus);
// //     } else {
// //       toast.error(res.error);
// //     }
// //     setLoading(false);
// //   };

// //   useEffect(() => {
// //     fetchOffers();
// //     const interval = setInterval(fetchOffers, 15000);
// //     return () => clearInterval(interval);
// //   }, [requestId]);

// //   const handleSelect = async (offerId: string) => {
// //     if (!requestId) return;
// //     setSelecting(offerId);
// //     const res = await selectBroadcastOffer(requestId, offerId);
// //     if (res.success) {
// //       toast.success('Offer selected successfully');
// //       navigate('/customer/my-requests');
// //     } else {
// //       toast.error(res.error);
// //     }
// //     setSelecting(null);
// //   };

// //   const handleCancel = async () => {
// //     if (!requestId) return;
// //     setCancelling(true);
// //     const res = await cancelBroadcastRequest(requestId);
// //     if (res.success) {
// //       toast.success('Request cancelled');
// //       navigate('/customer/my-requests');
// //     } else {
// //       toast.error(res.error);
// //     }
// //     setCancelling(false);
// //     setShowCancelModal(false);
// //   };

// //   const getOfferBadge = (status: string) => {
// //     switch (status) {
// //       case 'ACCEPTED': return <Badge variant="success">Accepted Original Price</Badge>;
// //       case 'COUNTER_OFFER': return <Badge variant="warning">Counter Offer</Badge>;
// //       default: return <Badge variant="secondary">{status}</Badge>;
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-50">
// //       <CustomerNavbar />
// //       <div className="max-w-3xl mx-auto px-4 py-8">
// //         <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 mb-6">
// //           <ArrowLeft size={18} /> Back
// //         </button>

// //         <div className="flex items-center justify-between mb-6">
// //           <h1 className="text-2xl font-bold">Incoming Offers</h1>
// //           {requestStatus === 'PENDING' && (
// //             <Button variant="danger" onClick={() => setShowCancelModal(true)}>
// //               Cancel Request
// //             </Button>
// //           )}
// //         </div>

// //         {loading ? (
// //           <div className="flex justify-center py-16">
// //             <Loader2 className="animate-spin" size={32} />
// //           </div>
// //         ) : offers.length === 0 ? (
// //           <Card className="p-8 text-center text-gray-500">
// //             No offers yet. Please wait...
// //           </Card>
// //         ) : (
// //           <div className="space-y-4">
// //             {offers.map((offer) => (
// //               <Card key={offer.id} className="p-5">
// //                 <div className="flex items-start justify-between">
// //                   <div>
// //                     <p className="font-semibold text-lg">{offer.provider?.name || 'Service Provider'}</p>
// //                     <div className="flex items-center gap-1 text-yellow-500 text-sm mt-1">
// //                       <Star size={14} fill="currentColor" />
// //                       <span>{offer.provider?.rating?.toFixed(1) || '—'}</span>
// //                     </div>
// //                   </div>
// //                   {getOfferBadge(offer.status)}
// //                 </div>

// //                 {offer.status === 'COUNTER_OFFER' && (
// //                   <p className="text-sm text-amber-600 bg-amber-50 rounded p-2 mt-3">
// //                     ⚠️ The provider suggested a different price — review details before accepting.
// //                   </p>
// //                 )}

// //                 <div className="flex gap-4 mt-3 text-sm text-gray-600">
// //                   <span className="flex items-center gap-1">
// //                     <DollarSign size={14} />
// //                     {offer.offeredPrice ?? offer.price ?? '—'} EGP
// //                   </span>
// //                   <span className="flex items-center gap-1">
// //                     <Clock size={14} />
// //                     End time: {offer.offeredEndTime || '—'}
// //                   </span>
// //                 </div>

// //                 {requestStatus === 'PENDING' && (
// //                   <div className="mt-4 flex gap-2">
// //                     <Button
// //                       onClick={() => handleSelect(offer.id)}
// //                       disabled={selecting === offer.id}
// //                       className="flex items-center gap-1"
// //                     >
// //                       {selecting === offer.id
// //                         ? <Loader2 size={14} className="animate-spin" />
// //                         : <Check size={14} />}
// //                       Accept Offer
// //                     </Button>
// //                   </div>
// //                 )}
// //               </Card>
// //             ))}
// //           </div>
// //         )}

// //         <Modal
// //           isOpen={showCancelModal}
// //           onClose={() => setShowCancelModal(false)}
// //           title="Confirm Cancellation"
// //         >
// //           <p className="text-gray-600 mb-6">Are you sure you want to cancel this request?</p>
// //           <div className="flex gap-3 justify-end">
// //             <Button variant="ghost" onClick={() => setShowCancelModal(false)}>
// //               No, Go Back
// //             </Button>
// //             <Button variant="danger" onClick={handleCancel} disabled={cancelling}>
// //               {cancelling ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
// //               Yes, Cancel
// //             </Button>
// //           </div>
// //         </Modal>
// //       </div>
// //     </div>
// //   );
// // }

// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { ArrowLeft, Star, Clock, DollarSign, Check, Loader2, X } from 'lucide-react';
// import { toast } from 'sonner';
// import CustomerNavbar from '../../../components/layout/CustomerNavbar';
// import Card from '../../../components/ui/Card';
// import Badge from '../../../components/ui/Badge';
// import Button from '../../../components/ui/Button';
// import Modal from '../../../components/ui/Modal';
// import Input from '../../../components/ui/Input';
// import {
//   getBroadcastOffers,
//   selectBroadcastOffer,
//   cancelBroadcastRequest,
//   completeHourlyBroadcast,
// } from './BroadcastActions';

// const DEFAULT_AVATAR = 'https://i.pravatar.cc/150?img=1';

// export default function BroadcastOffersPage() {
//   const { id }   = useParams<{ id: string }>();
//   const navigate = useNavigate();

//   const [data,           setData]           = useState<any>(null);
//   const [loading,        setLoading]        = useState(true);
//   const [selectingId,    setSelectingId]    = useState<string | null>(null);
//   const [showCancel,     setShowCancel]     = useState(false);
//   const [isCancelling,   setIsCancelling]   = useState(false);
//   const [showComplete,   setShowComplete]   = useState(false);
//   const [completionCode, setCompletionCode] = useState('');
//   const [hoursWorked,    setHoursWorked]    = useState('');
//   const [isCompleting,   setIsCompleting]   = useState(false);

//   const fetchOffers = async () => {
//     if (!id) return;
//     const result = await getBroadcastOffers(id);
//     if (result.success) setData(result.data);
//     else toast.error(result.error || 'Failed to load offers');
//   };

//   useEffect(() => {
//     const load = async () => {
//       setLoading(true);
//       await fetchOffers();
//       setLoading(false);
//     };
//     load();

//     // auto-refresh كل 15 ثانية
//     const interval = setInterval(fetchOffers, 15000);
//     return () => clearInterval(interval);
//   }, [id]);

//   const handleSelect = async (offerId: string) => {
//     setSelectingId(offerId);
//     const result = await selectBroadcastOffer(id!, offerId);
//     setSelectingId(null);

//     if (result.success) {
//       toast.success('Offer selected! Request confirmed.');
//       navigate('/customer/requests');
//     } else {
//       toast.error(result.error || 'Failed to select offer');
//     }
//   };

//   const handleCancel = async () => {
//     setIsCancelling(true);
//     const result = await cancelBroadcastRequest(id!);
//     setIsCancelling(false);

//     if (result.success) {
//       toast.success('Request cancelled');
//       navigate('/customer/requests');
//     } else {
//       toast.error(result.error || 'Failed to cancel');
//     }
//     setShowCancel(false);
//   };

//   const handleComplete = async () => {
//     if (!completionCode || !hoursWorked) {
//       toast.error('Please fill all fields');
//       return;
//     }
//     setIsCompleting(true);
//     const result = await completeHourlyBroadcast({
//       requestId:    id!,
//       completionCode,
//       hoursWorked:  Number(hoursWorked),
//     });
//     setIsCompleting(false);

//     if (result.success) {
//       toast.success('Service completed!');
//       setShowComplete(false);
//       navigate('/customer/requests');
//     } else {
//       toast.error(result.error || 'Failed to complete');
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-background">
//         <CustomerNavbar />
//         <div className="flex items-center justify-center py-40">
//           <Loader2 className="w-8 h-8 animate-spin text-primary" />
//         </div>
//       </div>
//     );
//   }

//   const offers      = data?.offers || [];
//   const status      = data?.requestStatus || '';
//   const isHourly    = data?.paymentMode === 'HOURLY';
//   const needsSelect = data?.selectionRequired;
//   const canCancel   = status === 'OPEN' || status === 'PENDING_SELECTION';
//   const canComplete = status === 'CONFIRMED' && isHourly;

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

//         {/* Header */}
//         <div className="flex items-start justify-between mb-6">
//           <div>
//             <h1 className="text-3xl font-bold mb-1">Broadcast Offers</h1>
//             <p className="text-muted-foreground">
//               {offers.length} provider{offers.length !== 1 ? 's' : ''} responded
//             </p>
//           </div>
//           <div className="flex items-center gap-3">
//             <Badge variant={status.toLowerCase() as any}>{status}</Badge>
//             {canCancel && (
//               <Button variant="destructive" size="sm" onClick={() => setShowCancel(true)}>
//                 Cancel Request
//               </Button>
//             )}
//             {canComplete && (
//               <Button onClick={() => setShowComplete(true)}>
//                 Complete Service
//               </Button>
//             )}
//           </div>
//         </div>

//         {/* Budget card */}
//         {data?.preferredPrice && (
//           <Card className="mb-6 bg-primary/5 border-primary/20">
//             <div className="flex items-center gap-4">
//               <DollarSign className="w-6 h-6 text-primary" />
//               <div>
//                 <p className="text-sm text-muted-foreground">Your Budget</p>
//                 <p className="text-2xl font-bold text-primary">EGP {data.preferredPrice}</p>
//               </div>
//               <div className="ml-auto">
//                 <Badge variant="pending">{isHourly ? 'HOURLY' : 'FIXED'}</Badge>
//               </div>
//             </div>
//           </Card>
//         )}

//         {/* Offers */}
//         {offers.length === 0 ? (
//           <Card className="text-center py-16">
//             <p className="text-lg text-muted-foreground mb-2">No offers yet</p>
//             <p className="text-sm text-muted-foreground">
//               Providers will respond to your request shortly. This page refreshes automatically.
//             </p>
//           </Card>
//         ) : (
//           <div className="space-y-4">
//             {offers.map((offer: any) => {
//               const provider     = offer.providerId || offer.provider || {};
//               const providerName = provider.userName ||
//                 (provider.firstName ? `${provider.firstName} ${provider.lastName}` : '—');
//               const offerId      = offer._id || offer.id;
//               const isAccepted   = offer.status === 'ACCEPTED';
//               const isCounter    = offer.status === 'COUNTER_OFFER';

//               return (
//                 <Card
//                   key={offerId}
//                   className={isAccepted ? 'border-green-400 bg-green-50/30' : ''}
//                 >
//                   <div className="flex flex-col md:flex-row gap-6">
//                     <img
//                       src={provider.profileURL || DEFAULT_AVATAR}
//                       alt={providerName}
//                       className="w-20 h-20 rounded-xl object-cover shrink-0"
//                       onError={(e) => {
//                         (e.currentTarget as HTMLImageElement).src = DEFAULT_AVATAR;
//                       }}
//                     />
//                     <div className="flex-1">
//                       <div className="flex items-start justify-between gap-4 mb-3">
//                         <div>
//                           <h3 className="text-lg font-semibold">{providerName}</h3>
//                           {provider.averageRating > 0 && (
//                             <div className="flex items-center gap-1 mt-1">
//                               <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
//                               <span className="text-sm font-medium">
//                                 {Number(provider.averageRating).toFixed(1)}
//                               </span>
//                               <span className="text-xs text-muted-foreground">
//                                 ({provider.reviewsCount})
//                               </span>
//                             </div>
//                           )}
//                         </div>
//                         <Badge
//                           variant={
//                             isAccepted ? 'completed' :
//                             isCounter  ? 'pending'   : 'waiting'
//                           }
//                         >
//                           {isAccepted ? 'Accepted Price' :
//                            isCounter  ? 'Counter Offer' : offer.status}
//                         </Badge>
//                       </div>

//                       {isCounter && (
//                         <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3">
//                           <p className="text-sm text-amber-700">
//                             ⚠️ Provider suggested a different price — review before accepting.
//                           </p>
//                         </div>
//                       )}

//                       <div className="flex flex-wrap gap-4 mb-4">
//                         {(offer.offeredPrice || offer.price) && (
//                           <div className="flex items-center gap-2">
//                             <DollarSign className="w-4 h-4 text-primary" />
//                             <span className="font-bold text-lg">
//                               EGP {offer.offeredPrice || offer.price}
//                             </span>
//                           </div>
//                         )}
//                         {offer.offeredEndTime && (
//                           <div className="flex items-center gap-2 text-muted-foreground">
//                             <Clock className="w-4 h-4" />
//                             <span className="text-sm">Until {offer.offeredEndTime}</span>
//                           </div>
//                         )}
//                       </div>

//                       {needsSelect && !isAccepted && (
//                         <Button
//                           size="sm"
//                           disabled={selectingId === offerId}
//                           onClick={() => handleSelect(offerId)}
//                         >
//                           <Check className="w-4 h-4" />
//                           {selectingId === offerId ? 'Selecting...' : 'Select This Offer'}
//                         </Button>
//                       )}

//                       {isAccepted && (
//                         <div className="flex items-center gap-2 text-green-600">
//                           <Check className="w-4 h-4" />
//                           <span className="text-sm font-medium">Offer Confirmed</span>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </Card>
//               );
//             })}
//           </div>
//         )}
//       </div>

//       {/* Cancel Modal */}
//       <Modal isOpen={showCancel} onClose={() => setShowCancel(false)} title="Cancel Request" size="sm">
//         <div className="space-y-4">
//           <p className="text-sm text-muted-foreground">
//             Are you sure you want to cancel this broadcast request?
//           </p>
//           <div className="flex gap-3">
//             <Button variant="outline" onClick={() => setShowCancel(false)} className="flex-1" disabled={isCancelling}>
//               No, Keep It
//             </Button>
//             <Button variant="destructive" onClick={handleCancel} className="flex-1" disabled={isCancelling}>
//               {isCancelling ? 'Cancelling...' : 'Yes, Cancel'}
//             </Button>
//           </div>
//         </div>
//       </Modal>

//       {/* Complete Hourly Modal */}
//       <Modal isOpen={showComplete} onClose={() => setShowComplete(false)} title="Complete Hourly Service" size="sm">
//         <div className="space-y-4">
//           <p className="text-sm text-muted-foreground">
//             Enter the completion code from your provider and the hours worked.
//           </p>
//           <Input
//             label="Completion Code"
//             placeholder="Enter code..."
//             value={completionCode}
//             onChange={(e) => setCompletionCode(e.target.value)}
//           />
//           <Input
//             type="number"
//             label="Hours Worked"
//             placeholder="e.g. 2"
//             value={hoursWorked}
//             onChange={(e) => setHoursWorked(e.target.value)}
//           />
//           <div className="flex gap-3">
//             <Button variant="outline" onClick={() => setShowComplete(false)} className="flex-1" disabled={isCompleting}>
//               Cancel
//             </Button>
//             <Button onClick={handleComplete} className="flex-1" disabled={isCompleting}>
//               {isCompleting ? 'Completing...' : 'Confirm'}
//             </Button>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// }

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Clock, DollarSign, Check, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import CustomerNavbar from '../../../components/layout/CustomerNavbar';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';
import {
  getBroadcastOffers,
  selectBroadcastOffer,
  cancelBroadcastRequest,
  completeHourlyBroadcast,
} from './BroadcastActions';

const DEFAULT_AVATAR = 'https://i.pravatar.cc/150?img=1';

export default function BroadcastOffersPage() {
  const { id }   = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [data,           setData]           = useState<any>(null);
  const [loading,        setLoading]        = useState(true);
  const [selectingId,    setSelectingId]    = useState<string | null>(null);
  const [showCancel,     setShowCancel]     = useState(false);
  const [isCancelling,   setIsCancelling]   = useState(false);
  const [showComplete,   setShowComplete]   = useState(false);
  const [completionCode, setCompletionCode] = useState('');
  const [hoursWorked,    setHoursWorked]    = useState('');
  const [isCompleting,   setIsCompleting]   = useState(false);

  const fetchOffers = async () => {
    if (!id) return;
    const result = await getBroadcastOffers(id);
    if (result.success) setData(result.data);
    else toast.error(result.error || 'Failed to load offers');
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchOffers();
      setLoading(false);
    };
    load();
    const interval = setInterval(fetchOffers, 15000);
    return () => clearInterval(interval);
  }, [id]);

  const handleSelect = async (offerId: string) => {
    setSelectingId(offerId);
    const result = await selectBroadcastOffer(id!, offerId);
    setSelectingId(null);
    if (result.success) {
      toast.success('Offer selected! Request confirmed.');
      navigate('/customer/requests');
    } else {
      toast.error(result.error || 'Failed to select offer');
    }
  };

  const handleCancel = async () => {
    setIsCancelling(true);
    const result = await cancelBroadcastRequest(id!);
    setIsCancelling(false);
    if (result.success) {
      toast.success('Request cancelled');
      navigate('/customer/requests');
    } else {
      toast.error(result.error || 'Failed to cancel');
    }
    setShowCancel(false);
  };

  const handleComplete = async () => {
    if (!completionCode || !hoursWorked) {
      toast.error('Please fill all fields');
      return;
    }
    setIsCompleting(true);
    const result = await completeHourlyBroadcast({
      requestId:   id!,
      completionCode,
      hoursWorked: Number(hoursWorked),
    });
    setIsCompleting(false);
    if (result.success) {
      toast.success('Service completed!');
      setShowComplete(false);
      navigate('/customer/requests');
    } else {
      toast.error(result.error || 'Failed to complete');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <CustomerNavbar />
        <div className="flex items-center justify-center py-40">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  const offers      = data?.offers      || [];
  const status      = data?.requestStatus || 'OPEN';   // fallback OPEN
  const isHourly    = data?.paymentMode === 'HOURLY';
  const needsSelect = data?.selectionRequired ?? true;  // fallback true
  const canCancel   = !data || status === 'OPEN' || status === 'PENDING_SELECTION';
  const canComplete = status === 'CONFIRMED' && isHourly;

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

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-1">Broadcast Offers</h1>
            <p className="text-muted-foreground">
              {offers.length} provider{offers.length !== 1 ? 's' : ''} responded
            </p>
          </div>
          <div className="flex items-center gap-3">
            {status && (
              <Badge variant={status.toLowerCase() as any}>{status}</Badge>
            )}
            {canCancel && (
              <Button variant="destructive" size="sm" onClick={() => setShowCancel(true)}>
                Cancel Request
              </Button>
            )}
            {canComplete && (
              <Button onClick={() => setShowComplete(true)}>
                Complete Service
              </Button>
            )}
          </div>
        </div>

        {/* Budget card */}
        {data?.preferredPrice && (
          <Card className="mb-6 bg-primary/5 border-primary/20">
            <div className="flex items-center gap-4">
              <DollarSign className="w-6 h-6 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Your Budget</p>
                <p className="text-2xl font-bold text-primary">EGP {data.preferredPrice}</p>
              </div>
              <div className="ml-auto">
                <Badge variant="pending">{isHourly ? 'HOURLY' : 'FIXED'}</Badge>
              </div>
            </div>
          </Card>
        )}

        {/* Offers */}
        {offers.length === 0 ? (
          <Card className="text-center py-16">
            <p className="text-lg text-muted-foreground mb-2">No offers yet</p>
            <p className="text-sm text-muted-foreground">
              Providers will respond to your request shortly. This page refreshes automatically.
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {offers.map((offer: any) => {
              const provider     = offer.providerId || offer.provider || {};
              const providerName = provider.userName ||
                (provider.firstName ? `${provider.firstName} ${provider.lastName}` : '—');
                const offerId    = offer.offerId || offer._id || offer.id; 
              const isAccepted = offer.status === 'ACCEPTED';
              const isCounter  = offer.status === 'COUNTER_OFFER';

              return (
                <Card
                  key={offerId}
                  className={isAccepted ? 'border-green-400 bg-green-50/30' : ''}
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    <img
                      src={provider.profileURL || DEFAULT_AVATAR}
                      alt={providerName}
                      className="w-20 h-20 rounded-xl object-cover shrink-0"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = DEFAULT_AVATAR;
                      }}
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <h3 className="text-lg font-semibold">{providerName}</h3>
                          {provider.averageRating > 0 && (
                            <div className="flex items-center gap-1 mt-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">
                                {Number(provider.averageRating).toFixed(1)}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                ({provider.reviewsCount})
                              </span>
                            </div>
                          )}
                        </div>
                        <Badge
                          variant={
                            isAccepted ? 'completed' :
                            isCounter  ? 'pending'   : 'waiting'
                          }
                        >
                          {isAccepted ? 'Accepted Price' :
                           isCounter  ? 'Counter Offer' : offer.status}
                        </Badge>
                      </div>

                      {isCounter && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3">
                          <p className="text-sm text-amber-700">
                             Provider suggested a different price — review before accepting.
                          </p>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-4 mb-4">
                        {(offer.offeredPrice || offer.price) && (
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-primary" />
                            <span className="font-bold text-lg">
                              EGP {offer.offeredPrice || offer.price}
                            </span>
                          </div>
                        )}
                        {offer.offeredEndTime && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm">Until {offer.offeredEndTime}</span>
                          </div>
                        )}
                      </div>

                      {/* Select offer button — لما الـ customer محتاج يختار */}
                     {needsSelect && !isAccepted && offer.status !== 'PENDING' && (
                        <Button
                          size="sm"
                          disabled={selectingId === offerId}
                          onClick={() => handleSelect(offerId)}
                        >
                          <Check className="w-4 h-4" />
                          {selectingId === offerId ? 'Selecting...' : 'Select This Offer'}
                        </Button>
                      )}

                      {isAccepted && (
                        <div className="flex items-center gap-2 text-green-600">
                          <Check className="w-4 h-4" />
                          <span className="text-sm font-medium">Offer Confirmed</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Cancel Modal */}
      <Modal
        isOpen={showCancel}
        onClose={() => setShowCancel(false)}
        title="Cancel Request"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Are you sure you want to cancel this broadcast request?
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowCancel(false)}
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

      {/* Complete Hourly Modal */}
      <Modal
        isOpen={showComplete}
        onClose={() => { setShowComplete(false); setCompletionCode(''); setHoursWorked(''); }}
        title="Complete Hourly Service"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Enter the completion code from your provider and the hours worked.
          </p>
          <Input
            label="Completion Code"
            placeholder="Enter code..."
            value={completionCode}
            onChange={(e) => setCompletionCode(e.target.value)}
          />
          <Input
            type="number"
            label="Hours Worked"
            placeholder="e.g. 2"
            value={hoursWorked}
            onChange={(e) => setHoursWorked(e.target.value)}
          />
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => { setShowComplete(false); setCompletionCode(''); setHoursWorked(''); }}
              className="flex-1"
              disabled={isCompleting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleComplete}
              className="flex-1"
              disabled={isCompleting || !completionCode.trim() || !hoursWorked}
            >
              {isCompleting ? 'Completing...' : 'Confirm'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}