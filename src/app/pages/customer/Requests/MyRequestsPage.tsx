// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Calendar, MapPin, Clock, Eye, FileX, DollarSign, X, Check, CheckCircle } from 'lucide-react';
// import { toast } from 'sonner';
// import CustomerNavbar from '../../../components/layout/CustomerNavbar';
// import Card from '../../../components/ui/Card';
// import Footer from '../../../components/layout/Footer';
// import Button from '../../../components/ui/Button';
// import Modal from '../../../components/ui/Modal';
// import Input from '../../../components/ui/Input';
// import EmptyState from '../../../components/ui/EmptyState';
// import { SkeletonCard } from '../../../components/ui/Skeleton';
// import { getMyRequests, acceptOffer, rejectOffer } from './MyRequestsActions';
// import { getAllServices } from '../../shared/Services/ServicesActions';

// function mapStatus(apiStatus: string): RequestStatus {
//   const map: Record<string, RequestStatus> = {
//     WAITING: 'waiting',
//     PENDING: 'pending',
//     CONFIRMED: 'confirmed',
//     COMPLETED: 'completed',
//     REFUSED: 'refused',
//     OUTDATED: 'outdated',
//     IN_PROGRESS: 'in_progress',
//     OPEN: 'open',
//     PENDING_SELECTION: 'pending_selection',
//     CANCELLED: 'cancelled',
//   };
//   return map[apiStatus] ?? 'waiting';
// }

// type RequestStatus = 'all' | 'waiting' | 'pending' | 'confirmed' | 'completed'
//   | 'refused' | 'outdated' | 'in_progress' | 'open'
//   | 'pending_selection' | 'cancelled';

// const tabs: { value: RequestStatus; label: string }[] = [
//   { value: 'all', label: 'All' },
//   { value: 'open', label: 'Open' },
//   { value: 'waiting', label: 'Waiting' },
//   { value: 'pending', label: 'Pending' },
//   { value: 'confirmed', label: 'Confirmed' },
//   { value: 'completed', label: 'Completed' },
//   { value: 'refused', label: 'Refused' },
//   { value: 'cancelled', label: 'Cancelled' },
//   { value: 'outdated', label: 'Outdated' },
// ];

// const DEFAULT_AVATAR = 'https://i.pinimg.com/736x/07/fb/34/07fb3452c4640d881a16d08c2e314f3e.jpg';

// const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
//   confirmed:         { bg: 'bg-green-100',   text: 'text-green-700',   label: 'Confirmed'         },
//   waiting:           { bg: 'bg-orange-100',  text: 'text-orange-700',  label: 'Waiting'           },
//   pending:           { bg: 'bg-yellow-100',  text: 'text-yellow-700',  label: 'Pending'           },
//   completed:         { bg: 'bg-emerald-100', text: 'text-emerald-800', label: 'Completed'         },
//   refused:           { bg: 'bg-red-100',     text: 'text-red-700',     label: 'Refused'           },
//   outdated:          { bg: 'bg-gray-100',    text: 'text-gray-600',    label: 'Outdated'          },
//   cancelled:         { bg: 'bg-rose-100',    text: 'text-rose-700',    label: 'Cancelled'         },
//   open:              { bg: 'bg-blue-100',    text: 'text-blue-700',    label: 'Open'              },
//   in_progress:       { bg: 'bg-orange-100',  text: 'text-orange-700',  label: 'In Progress'       },
//   pending_selection: { bg: 'bg-yellow-100',  text: 'text-yellow-700',  label: 'Pending Selection' },
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

// export default function MyRequestsPage() {
//   const navigate = useNavigate();

//   const [requests,               setRequests]               = useState<any[]>([]);
//   const [services,               setServices]               = useState<any[]>([]);
//   const [activeTab,              setActiveTab]              = useState<RequestStatus>('all');
//   const [loading,                setLoading]                = useState(true);
//   const [selectedRequest,        setSelectedRequest]        = useState<any | null>(null);
//   const [acceptingId,            setAcceptingId]            = useState<string | null>(null);
//   const [rejectingId,            setRejectingId]            = useState<string | null>(null);
//   const [showCompleteModal,      setShowCompleteModal]      = useState(false);
//   const [showCompleteHourlyModal,setShowCompleteHourlyModal]= useState(false);
//   const [showCancelModal,        setShowCancelModal]        = useState(false);
//   const [completionCode,         setCompletionCode]         = useState('');
//   const [hoursWorked,            setHoursWorked]            = useState('');
//   const [isCompleting,           setIsCompleting]           = useState(false);

//   useEffect(() => {
//     const load = async () => {
//       setLoading(true);
//       const [requestsResult, servicesResult] = await Promise.all([
//         getMyRequests(),
//         getAllServices(),
//       ]);
//       setLoading(false);

//       if (requestsResult.success) setRequests(requestsResult.data);
//       else toast.error(requestsResult.error || 'Failed to load requests');

//       if (servicesResult.success) setServices(servicesResult.data ?? []);
//     };
//     load();
//   }, []);

//   const getServiceName = (serviceId: string) =>
//     services.find((s) => s._id === serviceId)?.name || serviceId;

//   const filtered =
//     activeTab === 'all'
//       ? requests
//       : requests.filter((r) => mapStatus(r.status) === activeTab);

//   // ── Accept Offer ─────────────────────────────────────────
//   const handleAcceptOffer = async (request: any) => {
//     const id = request._id || request.id;
//     setAcceptingId(id);
//     const result = await acceptOffer(id);
//     setAcceptingId(null);

//     if (result.success) {
//       toast.success(result.message || 'Offer accepted!');
//       setRequests((prev) =>
//         prev.map((r) => (r._id === id || r.id === id ? { ...r, status: 'CONFIRMED' } : r))
//       );
//     } else {
//       toast.error(result.error || 'Failed to accept offer');
//     }
//   };

//   // ── Reject Offer ─────────────────────────────────────────
//   const handleRejectOffer = async (request: any) => {
//     const id = request._id || request.id;
//     setRejectingId(id);
//     const result = await rejectOffer(id);
//     setRejectingId(null);

//     if (result.success) {
//       toast.success(result.message || 'Offer rejected');
//       setRequests((prev) =>
//         prev.map((r) => (r._id === id || r.id === id ? { ...r, status: 'REFUSED' } : r))
//       );
//     } else {
//       toast.error(result.error || 'Failed to reject offer');
//     }
//   };

//   // ── Complete Service (DIRECT / FIXED) ────────────────────
//   const handleCompleteService = async () => {
//     if (!selectedRequest || !completionCode.trim()) {
//       toast.error('Please enter the completion code');
//       return;
//     }

//     setIsCompleting(true);
//     try {
//       const token = localStorage.getItem('access_token');
//       const reqId = selectedRequest._id || selectedRequest.id;

//       const res = await fetch('/api/service-requests/complete', {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ id: reqId, completionCode }),
//       });
//       const result = await res.json();

//       if (res.ok) {
//         toast.success('Service completed successfully!');
//         setRequests((prev) =>
//           prev.map((r) =>
//             (r._id || r.id) === reqId ? { ...r, status: 'COMPLETED' } : r
//           )
//         );
//         setShowCompleteModal(false);
//         setCompletionCode('');
//         setSelectedRequest(null);
//       } else {
//         toast.error(result.message || 'Invalid completion code');
//       }
//     } catch {
//       toast.error('Failed to complete service');
//     } finally {
//       setIsCompleting(false);
//     }
//   };

//   // ── Complete Hourly Service (BROADCAST + HOURLY) ─────────
//   const handleCompleteHourlyService = async () => {
//     if (!selectedRequest || !completionCode.trim() || !hoursWorked) {
//       toast.error('Please fill all fields');
//       return;
//     }

//     setIsCompleting(true);
//     try {
//       const token = localStorage.getItem('access_token');
//       const reqId = selectedRequest._id || selectedRequest.id;

//       const res = await fetch('/api/service-requests/broadcast/complete-hourly', {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           requestId:     reqId,
//           completionCode,
//           hoursWorked:   Number(hoursWorked),
//         }),
//       });
//       const result = await res.json();

//       if (res.ok) {
//         toast.success('Service completed successfully!');
//         setRequests((prev) =>
//           prev.map((r) =>
//             (r._id || r.id) === reqId ? { ...r, status: 'COMPLETED' } : r
//           )
//         );
//         setShowCompleteHourlyModal(false);
//         setCompletionCode('');
//         setHoursWorked('');
//         setSelectedRequest(null);
//       } else {
//         toast.error(result.message || 'Failed to complete service');
//       }
//     } catch {
//       toast.error('Failed to complete service');
//     } finally {
//       setIsCompleting(false);
//     }
//   };

//   // ── Helpers ───────────────────────────────────────────────
//   const getProviderName = (provider: any) =>
//     provider?.userName ||
//     (provider?.firstName && provider?.lastName
//       ? `${provider.firstName} ${provider.lastName}`
//       : null);

//   const calcHourlyPrice = (start: string, end: string, hourPrice: number) => {
//     if (!start || !end || !hourPrice) return null;
//     const [sh, sm] = start.split(':').map(Number);
//     const [eh, em] = end.split(':').map(Number);
//     const hours = (Math.ceil((eh * 60 + em) - (sh * 60 + sm))) / 60;
//     if (hours <= 0) return null;
//     return Math.ceil(hours * hourPrice);
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <CustomerNavbar />

//       <div className="container mx-auto px-4 lg:px-8 py-8">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold mb-2">My Requests</h1>
//           <p className="text-muted-foreground">Track and manage your service requests</p>
//         </div>

//         {/* Tabs */}
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
//                 <span className="ml-2 text-xs opacity-70">
//                   {tab.value === 'all'
//                     ? requests.length
//                     : requests.filter((r) => mapStatus(r.status) === tab.value).length}
//                 </span>
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* List */}
//         <div className="space-y-4">
//           {loading ? (
//             <><SkeletonCard /><SkeletonCard /><SkeletonCard /></>
//           ) : filtered.length === 0 ? (
//             <EmptyState
//               icon={<FileX className="w-10 h-10 text-muted-foreground" />}
//               title="No requests found"
//               description={`You don't have any ${activeTab === 'all' ? '' : activeTab + ' '}requests yet.`}
//               action={{
//                 label: 'Browse Services',
//                 onClick: () => navigate('/customer/services'),
//               }}
//             />
//           ) : (
//             filtered.map((request) => {
//               const id           = request._id || request.id;
//               const status       = mapStatus(request.status);
//               const provider     = request.provider;
//               const providerName = getProviderName(provider);
//               const isBroadcast  = request.requestType === 'BROADCAST';
//               const isHourly     = request.paymentMode === 'HOURLY';

//               return (
//                 <Card key={id}>
//                   <div className="flex flex-col md:flex-row gap-6">

//                     {/* Provider photo */}
//                     <div className="flex flex-col items-center gap-2 shrink-0 w-30">
//                       <img
//                         src={provider?.profileURL || DEFAULT_AVATAR}
//                         alt={providerName || 'Provider'}
//                         className="w-30 h-30 rounded-xl object-cover"
//                         onError={(e) => {
//                           (e.currentTarget as HTMLImageElement).src = DEFAULT_AVATAR;
//                         }}
//                       />
//                       {providerName && (
//                         <p className="text-s font-medium text-center text-muted-foreground leading-tight">
//                           {providerName}
//                         </p>
//                       )}
//                     </div>

//                     <div className="flex-1">
//                       {/* Title row */}
//                       <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
//                         <div>
//                           <h3 className="text-xl font-semibold mb-1">
//                             {getServiceName(request.serviceNeeded)}
//                           </h3>
//                           <p className="text-sm text-muted-foreground">Request #{id?.slice(-6)}</p>
//                         </div>
//                         <StatusBadge status={status} />
//                       </div>

//                       {/* Meta */}
//                       <div className="grid md:grid-cols-2 gap-2 mb-4 text-sm text-muted-foreground">
//                         {request.dateNeeded && (
//                           <div className="flex items-center gap-2">
//                             <Calendar className="w-4 h-4" />
//                             <span>{new Date(request.dateNeeded).toLocaleDateString()}</span>
//                           </div>
//                         )}
//                         {request.startTime && (
//                           <div className="flex items-center gap-2">
//                             <Clock className="w-4 h-4" />
//                             <span>
//                               {request.startTime}
//                               {request.endTime ? ` → ${request.endTime}` : ''}
//                             </span>
//                           </div>
//                         )}
//                         {(request.city || request.governorate) && (
//                           <div className="flex items-center gap-2 md:col-span-2">
//                             <MapPin className="w-4 h-4" />
//                             <span>
//                               {[request.city, request.governorate].filter(Boolean).join(', ')}
//                             </span>
//                           </div>
//                         )}
//                       </div>

//                       {/* Price */}
//                       {request.price > 0 ? (
//                         <div className="flex items-center gap-1 mb-4">
//                           <DollarSign className="w-4 h-4 text-primary" />
//                           <span className="font-bold text-lg">EGP {request.price}</span>
//                         </div>
//                       ) : isHourly ? (
//                         <div className="flex items-center gap-1 mb-4">
//                           <Clock className="w-4 h-4 text-muted-foreground" />
//                           {(() => {
//                             const estimated = calcHourlyPrice(
//                               request.startTime,
//                               request.endTime,
//                               request.provider?.hourPrice
//                             );
//                             return estimated ? (
//                               <span className="text-sm text-muted-foreground">
//                                 Est. <span className="font-bold text-foreground">EGP {estimated}</span>
//                                 <span className="ml-1 text-xs">(EGP {request.provider?.hourPrice}/hr)</span>
//                               </span>
//                             ) : (
//                               <span className="text-sm text-muted-foreground">
//                                 Hourly — EGP {request.provider?.hourPrice}/hr
//                               </span>
//                             );
//                           })()}
//                         </div>
//                       ) : request.preferredPrice > 0 ? (
//                         <div className="flex items-center gap-1 mb-4">
//                           <DollarSign className="w-4 h-4 text-muted-foreground" />
//                           <span className="font-bold text-lg text-muted-foreground">EGP {request.preferredPrice}</span>
//                           <span className="text-xs text-muted-foreground ml-1">(budget)</span>
//                         </div>
//                       ) : null}

//                       {/* Actions */}
//                       <div className="flex flex-wrap gap-2">
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() =>
//                             navigate(`/customer/requests/${id}`, { state: { request } })
//                           }
//                         >
//                           <Eye className="w-4 h-4" />
//                           View Details
//                         </Button>

//                         {/* Broadcast — view offers */}
//                         {(status === 'open' || status === 'pending_selection') && (
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => navigate(`/customer/broadcast/${id}/offers`)}
//                           >
//                             View Offers
//                           </Button>
//                         )}

//                         {/* Cancel broadcast */}
//                         {status === 'open' && (
//                           <Button
//                             variant="destructive"
//                             size="sm"
//                             onClick={() => {
//                               setSelectedRequest(request);
//                               setShowCancelModal(true);
//                             }}
//                           >
//                             <X className="w-4 h-4" />
//                             Cancel
//                           </Button>
//                         )}

//                         {/* Accept / Reject direct offer */}
//                         {status === 'pending' && (
//                           <>
//                             <Button
//                               variant="success"
//                               size="sm"
//                               disabled={acceptingId === id}
//                               onClick={() => handleAcceptOffer(request)}
//                             >
//                               <Check className="w-4 h-4" />
//                               {acceptingId === id ? 'Accepting...' : 'Accept Offer'}
//                             </Button>
//                             <Button
//                               variant="destructive"
//                               size="sm"
//                               disabled={rejectingId === id}
//                               onClick={() => handleRejectOffer(request)}
//                             >
//                               <X className="w-4 h-4" />
//                               {rejectingId === id ? 'Rejecting...' : 'Reject Offer'}
//                             </Button>
//                           </>
//                         )}

//                         {/* Complete — BROADCAST HOURLY */}
//                         {status === 'confirmed' && isBroadcast && isHourly && (
//                           <Button
//                             size="sm"
//                             onClick={() => {
//                               setSelectedRequest(request);
//                               setShowCompleteHourlyModal(true);
//                             }}
//                           >
//                             <CheckCircle className="w-4 h-4" />
//                             Complete Service
//                           </Button>
//                         )}

//                         {/* Complete — DIRECT or FIXED */}
//                         {status === 'confirmed' && !(isBroadcast && isHourly) && (
//                           <Button
//                             size="sm"
//                             onClick={() => {
//                               setSelectedRequest(request);
//                               setShowCompleteModal(true);
//                             }}
//                           >
//                             <CheckCircle className="w-4 h-4" />
//                             Complete Service
//                           </Button>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </Card>
//               );
//             })
//           )}
//         </div>
//       </div>

//       {/* Complete Modal — DIRECT / FIXED */}
//       <Modal
//         isOpen={showCompleteModal}
//         onClose={() => { setShowCompleteModal(false); setCompletionCode(''); }}
//         title="Complete Service"
//         size="sm"
//       >
//         <div className="space-y-4">
//           <p className="text-sm text-muted-foreground">
//             Enter the completion code provided by your service provider.
//           </p>
//           <Input
//             label="Completion Code"
//             placeholder="Enter code..."
//             value={completionCode}
//             onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCompletionCode(e.target.value)}
//           />
//           <div className="flex gap-3">
//             <Button
//               variant="outline"
//               onClick={() => { setShowCompleteModal(false); setCompletionCode(''); }}
//               className="flex-1"
//               disabled={isCompleting}
//             >
//               Cancel
//             </Button>
//             <Button
//               onClick={handleCompleteService}
//               className="flex-1"
//               disabled={isCompleting || !completionCode.trim()}
//             >
//               {isCompleting ? 'Completing...' : 'Confirm'}
//             </Button>
//           </div>
//         </div>
//       </Modal>

//       {/* Complete Modal — BROADCAST HOURLY */}
//       <Modal
//         isOpen={showCompleteHourlyModal}
//         onClose={() => { setShowCompleteHourlyModal(false); setCompletionCode(''); setHoursWorked(''); }}
//         title="Complete Hourly Service"
//         size="sm"
//       >
//         <div className="space-y-4">
//           <p className="text-sm text-muted-foreground">
//             Enter the completion code and total hours worked.
//           </p>
//           <Input
//             label="Completion Code"
//             placeholder="Enter code..."
//             value={completionCode}
//             onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCompletionCode(e.target.value)}
//           />
//           <Input
//             type="number"
//             label="Hours Worked"
//             placeholder="e.g. 2"
//             value={hoursWorked}
//             onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHoursWorked(e.target.value)}
//           />
//           <div className="flex gap-3">
//             <Button
//               variant="outline"
//               onClick={() => { setShowCompleteHourlyModal(false); setCompletionCode(''); setHoursWorked(''); }}
//               className="flex-1"
//               disabled={isCompleting}
//             >
//               Cancel
//             </Button>
//             <Button
//               onClick={handleCompleteHourlyService}
//               className="flex-1"
//               disabled={isCompleting || !completionCode.trim() || !hoursWorked}
//             >
//               {isCompleting ? 'Completing...' : 'Confirm'}
//             </Button>
//           </div>
//         </div>
//       </Modal>

//       <Footer />
//     </div>
//   );
// }

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, Eye, FileX, DollarSign, X, Check, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import CustomerNavbar from '../../../components/layout/CustomerNavbar';
import Card from '../../../components/ui/Card';
import Footer from '../../../components/layout/Footer';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';
import EmptyState from '../../../components/ui/EmptyState';
import { SkeletonCard } from '../../../components/ui/Skeleton';
import {
  getMyRequests,
  acceptOffer,
  rejectOffer,
  completeService,
  completeServiceHourly,
} from './MyRequestsActions';
import { getAllServices } from '../../shared/Services/ServicesActions';

function mapStatus(apiStatus: string): RequestStatus {
  const map: Record<string, RequestStatus> = {
    WAITING: 'waiting',
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    COMPLETED: 'completed',
    REFUSED: 'refused',
    OUTDATED: 'outdated',
    IN_PROGRESS: 'in_progress',
    OPEN: 'open',
    PENDING_SELECTION: 'pending_selection',
    CANCELLED: 'cancelled',
  };
  return map[apiStatus] ?? 'waiting';
}

type RequestStatus = 'all' | 'waiting' | 'pending' | 'confirmed' | 'completed'
  | 'refused' | 'outdated' | 'in_progress' | 'open'
  | 'pending_selection' | 'cancelled';

const tabs: { value: RequestStatus; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'open', label: 'Open' },
  { value: 'waiting', label: 'Waiting' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'completed', label: 'Completed' },
  { value: 'refused', label: 'Refused' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'outdated', label: 'Outdated' },
];

const DEFAULT_AVATAR = 'https://i.pinimg.com/736x/07/fb/34/07fb3452c4640d881a16d08c2e314f3e.jpg';

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  confirmed:         { bg: 'bg-green-100',   text: 'text-green-700',   label: 'Confirmed'         },
  waiting:           { bg: 'bg-orange-100',  text: 'text-orange-700',  label: 'Waiting'           },
  pending:           { bg: 'bg-yellow-100',  text: 'text-yellow-700',  label: 'Pending'           },
  completed:         { bg: 'bg-emerald-100', text: 'text-emerald-800', label: 'Completed'         },
  refused:           { bg: 'bg-red-100',     text: 'text-red-700',     label: 'Refused'           },
  outdated:          { bg: 'bg-gray-100',    text: 'text-gray-600',    label: 'Outdated'          },
  cancelled:         { bg: 'bg-rose-100',    text: 'text-rose-700',    label: 'Cancelled'         },
  open:              { bg: 'bg-blue-100',    text: 'text-blue-700',    label: 'Open'              },
  in_progress:       { bg: 'bg-orange-100',  text: 'text-orange-700',  label: 'In Progress'       },
  pending_selection: { bg: 'bg-yellow-100',  text: 'text-yellow-700',  label: 'Pending Selection' },
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

export default function MyRequestsPage() {
  const navigate = useNavigate();

  const [requests,               setRequests]               = useState<any[]>([]);
  const [services,               setServices]               = useState<any[]>([]);
  const [activeTab,              setActiveTab]              = useState<RequestStatus>('all');
  const [loading,                setLoading]                = useState(true);
  const [selectedRequest,        setSelectedRequest]        = useState<any | null>(null);
  const [acceptingId,            setAcceptingId]            = useState<string | null>(null);
  const [rejectingId,            setRejectingId]            = useState<string | null>(null);
  const [showCompleteModal,      setShowCompleteModal]      = useState(false);
  const [showCompleteHourlyModal,setShowCompleteHourlyModal]= useState(false);
  const [showCancelModal,        setShowCancelModal]        = useState(false);
  const [completionCode,         setCompletionCode]         = useState('');
  const [hoursWorked,            setHoursWorked]            = useState('');
  const [isCompleting,           setIsCompleting]           = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [requestsResult, servicesResult] = await Promise.all([
        getMyRequests(),
        getAllServices(),
      ]);
      setLoading(false);

      if (requestsResult.success) setRequests(requestsResult.data);
      else toast.error(requestsResult.error || 'Failed to load requests');

      if (servicesResult.success) setServices(servicesResult.data ?? []);
    };
    load();
  }, []);

  const getServiceName = (serviceId: string) =>
    services.find((s) => s._id === serviceId)?.name || serviceId;

  const filtered =
    activeTab === 'all'
      ? requests
      : requests.filter((r) => mapStatus(r.status) === activeTab);

  // ── Accept Offer ─────────────────────────────────────────
  const handleAcceptOffer = async (request: any) => {
    const id = request._id || request.id;
    setAcceptingId(id);
    const result = await acceptOffer(id);
    setAcceptingId(null);

    if (result.success) {
      toast.success(result.message || 'Offer accepted!');
      setRequests((prev) =>
        prev.map((r) => (r._id === id || r.id === id ? { ...r, status: 'CONFIRMED' } : r))
      );
    } else {
      toast.error(result.error || 'Failed to accept offer');
    }
  };

  // ── Reject Offer ─────────────────────────────────────────
  const handleRejectOffer = async (request: any) => {
    const id = request._id || request.id;
    setRejectingId(id);
    const result = await rejectOffer(id);
    setRejectingId(null);

    if (result.success) {
      toast.success(result.message || 'Offer rejected');
      setRequests((prev) =>
        prev.map((r) => (r._id === id || r.id === id ? { ...r, status: 'REFUSED' } : r))
      );
    } else {
      toast.error(result.error || 'Failed to reject offer');
    }
  };

  // ── Complete Service (FIXED) ─────────────────────────────
  // paymentMode === 'FIXED' uses /complete with { id, completionCode }
  const handleCompleteService = async () => {
    if (!selectedRequest || !completionCode.trim()) {
      toast.error('Please enter the completion code');
      return;
    }

    setIsCompleting(true);
    const reqId = selectedRequest._id || selectedRequest.id;
    const result = await completeService(reqId, completionCode);
    setIsCompleting(false);

    if (result.success) {
      toast.success(result.message || 'Service completed successfully!');
      setRequests((prev) =>
        prev.map((r) =>
          (r._id || r.id) === reqId ? { ...r, status: 'COMPLETED' } : r
        )
      );
      setShowCompleteModal(false);
      setCompletionCode('');
      setSelectedRequest(null);
    } else {
      toast.error(result.error || 'Invalid completion code');
    }
  };

  // ── Complete Service (HOURLY) ────────────────────────────
  // paymentMode === 'HOURLY' uses the generic /complete-hourly with { requestId, completionCode, hoursWorked },
  // regardless of whether the request is DIRECT or BROADCAST.
  const handleCompleteHourlyService = async () => {
    if (!selectedRequest || !completionCode.trim() || !hoursWorked) {
      toast.error('Please fill all fields');
      return;
    }

    setIsCompleting(true);
    const reqId = selectedRequest._id || selectedRequest.id;
    const result = await completeServiceHourly(reqId, completionCode, Number(hoursWorked));
    setIsCompleting(false);

    if (result.success) {
      toast.success(result.message || 'Service completed successfully!');
      setRequests((prev) =>
        prev.map((r) =>
          (r._id || r.id) === reqId ? { ...r, status: 'COMPLETED' } : r
        )
      );
      setShowCompleteHourlyModal(false);
      setCompletionCode('');
      setHoursWorked('');
      setSelectedRequest(null);
    } else {
      toast.error(result.error || 'Failed to complete service');
    }
  };

  // ── Helpers ───────────────────────────────────────────────
  const getProviderName = (provider: any) =>
    provider?.userName ||
    (provider?.firstName && provider?.lastName
      ? `${provider.firstName} ${provider.lastName}`
      : null);

  const calcHourlyPrice = (start: string, end: string, hourPrice: number) => {
    if (!start || !end || !hourPrice) return null;
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    const hours = (Math.ceil((eh * 60 + em) - (sh * 60 + sm))) / 60;
    if (hours <= 0) return null;
    return Math.ceil(hours * hourPrice);
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
                <span className="ml-2 text-xs opacity-70">
                  {tab.value === 'all'
                    ? requests.length
                    : requests.filter((r) => mapStatus(r.status) === tab.value).length}
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
              action={{
                label: 'Browse Services',
                onClick: () => navigate('/customer/services'),
              }}
            />
          ) : (
            filtered.map((request) => {
              const id           = request._id || request.id;
              const status       = mapStatus(request.status);
              const provider     = request.provider;
              const providerName = getProviderName(provider);
              const isHourly     = request.paymentMode === 'HOURLY';

              return (
                <Card key={id}>
                  <div className="flex flex-col md:flex-row gap-6">

                    {/* Provider photo */}
                    <div className="flex flex-col items-center gap-2 shrink-0 w-30">
                      <img
                        src={provider?.profileURL || DEFAULT_AVATAR}
                        alt={providerName || 'Provider'}
                        className="w-30 h-30 rounded-xl object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = DEFAULT_AVATAR;
                        }}
                      />
                      {providerName && (
                        <p className="text-s font-medium text-center text-muted-foreground leading-tight">
                          {providerName}
                        </p>
                      )}
                    </div>

                    <div className="flex-1">
                      {/* Title row */}
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                        <div>
                          <h3 className="text-xl font-semibold mb-1">
                            {getServiceName(request.serviceNeeded)}
                          </h3>
                          <p className="text-sm text-muted-foreground">Request #{id?.slice(-6)}</p>
                        </div>
                        <StatusBadge status={status} />
                      </div>

                      {/* Meta */}
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
                              {[request.city, request.governorate].filter(Boolean).join(', ')}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Price */}
                      {request.price > 0 ? (
                        <div className="flex items-center gap-1 mb-4">
                          <DollarSign className="w-4 h-4 text-primary" />
                          <span className="font-bold text-lg">EGP {request.price}</span>
                        </div>
                      ) : isHourly ? (
                        <div className="flex items-center gap-1 mb-4">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          {(() => {
                            const estimated = calcHourlyPrice(
                              request.startTime,
                              request.endTime,
                              request.provider?.hourPrice
                            );
                            return estimated ? (
                              <span className="text-sm text-muted-foreground">
                                Est. <span className="font-bold text-foreground">EGP {estimated}</span>
                                <span className="ml-1 text-xs">(EGP {request.provider?.hourPrice}/hr)</span>
                              </span>
                            ) : (
                              <span className="text-sm text-muted-foreground">
                                Hourly — EGP {request.provider?.hourPrice}/hr
                              </span>
                            );
                          })()}
                        </div>
                      ) : request.preferredPrice > 0 ? (
                        <div className="flex items-center gap-1 mb-4">
                          <DollarSign className="w-4 h-4 text-muted-foreground" />
                          <span className="font-bold text-lg text-muted-foreground">EGP {request.preferredPrice}</span>
                          <span className="text-xs text-muted-foreground ml-1">(budget)</span>
                        </div>
                      ) : null}

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            navigate(`/customer/requests/${id}`, { state: { request } })
                          }
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </Button>

                        {/* Broadcast — view offers */}
                        {(status === 'open' || status === 'pending_selection') && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/customer/broadcast/${id}/offers`)}
                          >
                            View Offers
                          </Button>
                        )}

                        {/* Cancel broadcast */}
                        {status === 'open' && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              setSelectedRequest(request);
                              setShowCancelModal(true);
                            }}
                          >
                            <X className="w-4 h-4" />
                            Cancel
                          </Button>
                        )}

                        {/* Accept / Reject direct offer */}
                        {status === 'pending' && (
                          <>
                            <Button
                              variant="success"
                              size="sm"
                              disabled={acceptingId === id}
                              onClick={() => handleAcceptOffer(request)}
                            >
                              <Check className="w-4 h-4" />
                              {acceptingId === id ? 'Accepting...' : 'Accept Offer'}
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              disabled={rejectingId === id}
                              onClick={() => handleRejectOffer(request)}
                            >
                              <X className="w-4 h-4" />
                              {rejectingId === id ? 'Rejecting...' : 'Reject Offer'}
                            </Button>
                          </>
                        )}

                        {/* Complete — HOURLY (DIRECT or BROADCAST) */}
                        {status === 'confirmed' && isHourly && (
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedRequest(request);
                              setShowCompleteHourlyModal(true);
                            }}
                          >
                            <CheckCircle className="w-4 h-4" />
                            Complete Service
                          </Button>
                        )}

                        {/* Complete — FIXED (DIRECT or BROADCAST) */}
                        {status === 'confirmed' && !isHourly && (
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedRequest(request);
                              setShowCompleteModal(true);
                            }}
                          >
                            <CheckCircle className="w-4 h-4" />
                            Complete Service
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

      {/* Complete Modal — FIXED */}
      <Modal
        isOpen={showCompleteModal}
        onClose={() => { setShowCompleteModal(false); setCompletionCode(''); }}
        title="Complete Service"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Enter the completion code provided by your service provider.
          </p>
          <Input
            label="Completion Code"
            placeholder="Enter code..."
            value={completionCode}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCompletionCode(e.target.value)}
          />
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => { setShowCompleteModal(false); setCompletionCode(''); }}
              className="flex-1"
              disabled={isCompleting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCompleteService}
              className="flex-1"
              disabled={isCompleting || !completionCode.trim()}
            >
              {isCompleting ? 'Completing...' : 'Confirm'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Complete Modal — HOURLY */}
      <Modal
        isOpen={showCompleteHourlyModal}
        onClose={() => { setShowCompleteHourlyModal(false); setCompletionCode(''); setHoursWorked(''); }}
        title="Complete Hourly Service"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Enter the completion code and total hours worked.
          </p>
          <Input
            label="Completion Code"
            placeholder="Enter code..."
            value={completionCode}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCompletionCode(e.target.value)}
          />
          <Input
            type="number"
            label="Hours Worked"
            placeholder="e.g. 2"
            value={hoursWorked}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHoursWorked(e.target.value)}
          />
          {selectedRequest?.provider?.hourPrice && hoursWorked && Number(hoursWorked) > 0 && (
            <p className="text-sm text-muted-foreground">
              Estimated total: EGP {Math.ceil(Number(hoursWorked) * selectedRequest.provider.hourPrice)}
            </p>
          )}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => { setShowCompleteHourlyModal(false); setCompletionCode(''); setHoursWorked(''); }}
              className="flex-1"
              disabled={isCompleting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCompleteHourlyService}
              className="flex-1"
              disabled={isCompleting || !completionCode.trim() || !hoursWorked || Number(hoursWorked) < 1}
            >
              {isCompleting ? 'Completing...' : 'Confirm'}
            </Button>
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  );
}