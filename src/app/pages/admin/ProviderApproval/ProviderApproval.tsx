// import { useState, useEffect } from 'react';
// import { FileText, CheckCircle, X, AlertCircle } from 'lucide-react';
// import { toast } from 'sonner';
// import AdminSidebar from '../../../components/layout/AdminSidebar';
// import Card from '../../../components/ui/Card';
// import Button from '../../../components/ui/Button';
// import Modal from '../../../components/ui/Modal';
// import Textarea from '../../../components/ui/Textarea';
// import { SkeletonCard } from '../../../components/ui/Skeleton';
// import {
//   getPendingProviders,
//   approveProvider,
//   rejectProvider,
// } from './ProviderApprovalActions';
// import { getDetails } from '../Details/DetailsActions';

// interface Provider {
//   id?: string;
//   _id?: string;
//   name?: string;
//   cvUrl?: string;
//   userName?: string;
//   email: string;
//   age?: string | number;
//   mobileNumber?: string;
//   service?: string | { _id: string; name: string };
//   specialization?: string;
//   nationalNumber?: string;
//   cvFile?: string;
//   writtenCv?: string;
//   profileURL?: string;
//   createdAt?: string;
//   status?: string;
//   location?: string;
//   city?: string;
//   state?: string;
//   hourPrice?: number | string;
// }

// const DEFAULT_AVATAR = 'https://i.pravatar.cc/150?img=3';

// export default function ProviderApproval() {
//   const [providers,          setProviders]          = useState<Provider[]>([]);
//   const [loading,            setLoading]            = useState(true);
//   const [showRejectModal,    setShowRejectModal]    = useState(false);
//   const [rejectionReason,    setRejectionReason]    = useState('');
//   const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);
//   const [isApproving,        setIsApproving]        = useState(false);
//   const [isRejecting,        setIsRejecting]        = useState(false);

//   useEffect(() => {
//     loadPendingProviders();
//   }, []);

//   // ============ LOAD ============
//   const loadPendingProviders = async () => {
//     try {
//       setLoading(true);
//       const result = await getPendingProviders();

//       if (result.success) {
//         const pendingList = Array.isArray(result.data) ? result.data : [];

//         const detailed = await Promise.all(
//           pendingList.map(async (p: any) => {
//             const details = await getDetails(p.id || p._id);
//             if (details.success) {
//               return {
//                 ...details.data,
//                 service:
//                   typeof p.service === 'object'
//                     ? p.service
//                     : details.data.service,
//                 id: p.id || p._id,
//               };
//             }
//             return { ...p, id: p.id || p._id };
//           })
//         );

//         setProviders(detailed);
//         if (detailed.length === 0) toast.info('No pending providers to review');
//       } else {
//         toast.error(result.error || 'Failed to load pending providers');
//         setProviders([]);
//       }
//     } catch {
//       toast.error('Error loading pending providers');
//       setProviders([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ============ APPROVE ============
//   const handleApprove = async (provider: Provider) => {
//     const providerId = provider.id || provider._id;
//     if (!providerId) { toast.error('Invalid provider ID'); return; }

//     setIsApproving(true);
//     const result = await approveProvider(providerId);
//     setIsApproving(false);

//     if (result.success) {
//       toast.success(result.message || 'Provider approved successfully');
//       setProviders((prev) => prev.filter((p) => (p.id || p._id) !== providerId));
//     } else {
//       toast.error(result.error || 'Failed to approve provider');
//     }
//   };

//   // ============ REJECT ============
//   const handleReject = async () => {
//     if (!selectedProviderId)     { toast.error('Invalid provider ID');     return; }
//     if (!rejectionReason.trim()) { toast.error('Please provide a reason'); return; }

//     setIsRejecting(true);
//     const result = await rejectProvider(selectedProviderId, rejectionReason);
//     setIsRejecting(false);

//     if (result.success) {
//       toast.success(result.message || 'Provider rejected successfully');
//       setProviders((prev) =>
//         prev.filter((p) => (p.id || p._id) !== selectedProviderId)
//       );
//       setShowRejectModal(false);
//       setRejectionReason('');
//       setSelectedProviderId(null);
//     } else {
//       toast.error(result.error || 'Failed to reject provider');
//     }
//   };

//   // ============ HELPERS ============
//   const getName     = (p: Provider) => p.userName || p.name || p.email || 'Provider';
//   const getPhoto    = (p: Provider) => p.profileURL || DEFAULT_AVATAR;
//   const getCategory = (p: Provider) => {
//     if (typeof p.service === 'object' && p.service !== null)
//       return (p.service as any).name || '—';
//     return (p.service as string) || '—';
//   };
//   const getLocation = (p: Provider) => {
//     if (p.city && p.state) return `${p.city}, ${p.state}`;
//     return p.city || p.location || 'Not specified';
//   };

//   return (
//     <div className="flex min-h-screen bg-background">
//       <AdminSidebar />

//       <div className="flex-1 p-8">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold mb-2">Provider Approval</h1>
//           <p className="text-muted-foreground">
//             Review and approve pending provider applications
//           </p>
//         </div>

//         <div className="space-y-6">
//           {loading ? (
//             <><SkeletonCard /><SkeletonCard /><SkeletonCard /></>
//           ) : providers.length === 0 ? (
//             <Card>
//               <div className="text-center py-8">
//                 <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
//                 <p className="text-muted-foreground mb-4">No pending providers to review</p>
//                 <Button variant="outline" onClick={loadPendingProviders}>Refresh</Button>
//               </div>
//             </Card>
//           ) : (
//             providers.map((provider) => (
//               <Card key={provider.id || provider._id}>

//                 {/* HEADER */}
//                 <div className="flex items-start gap-6 mb-8 pb-6 border-b">
//                   <img
//                     src={getPhoto(provider)}
//                     alt={getName(provider)}
//                     className="w-28 h-28 rounded-full object-cover flex-shrink-0"
//                     onError={(e) => {
//                       (e.currentTarget as HTMLImageElement).src = DEFAULT_AVATAR;
//                     }}
//                   />
//                   <div className="flex-1">
//                     <h3 className="text-2xl font-bold mb-4">{getName(provider)}</h3>
//                     <div className="grid grid-cols-2 gap-4">
//                       <div>
//                         <p className="text-xs text-muted-foreground font-semibold">EMAIL</p>
//                         <p className="text-sm">{provider.email || '—'}</p>
//                       </div>
//                       <div>
//                         <p className="text-xs text-muted-foreground font-semibold">AGE</p>
//                         <p className="text-sm">{provider.age || '—'}</p>
//                       </div>
//                       <div>
//                         <p className="text-xs text-muted-foreground font-semibold">PHONE</p>
//                         <p className="text-sm">{provider.mobileNumber || '—'}</p>
//                       </div>
//                       <div>
//                         <p className="text-xs text-muted-foreground font-semibold">CATEGORY</p>
//                         <p className="text-sm">{getCategory(provider)}</p>
//                       </div>
//                       <div>
//                         <p className="text-xs text-muted-foreground font-semibold">NATIONAL ID</p>
//                         <p className="text-sm">{provider.nationalNumber || '—'}</p>
//                       </div>
//                       <div>
//                         <p className="text-xs text-muted-foreground font-semibold">LOCATION</p>
//                         <p className="text-sm">{getLocation(provider)}</p>
//                       </div>
//                       <div>
//                         <p className="text-xs text-muted-foreground font-semibold">HOUR PRICE</p>
//                         <p className="text-sm">
//                           {provider.hourPrice ? `${provider.hourPrice} EGP/hr` : '—'}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* SPECIALIZATION */}
//                 {provider.specialization && (
//                   <div className="mb-6">
//                     <h4 className="font-semibold text-lg mb-2">Specialization</h4>
//                     <p className="text-muted-foreground leading-relaxed">
//                       {provider.specialization}
//                     </p>
//                   </div>
//                 )}

//                 {/* CV FILE */}
//                 {provider.cvUrl && (
//                   <div className="mb-6">
//                     <h4 className="font-semibold text-lg mb-2">CV Document</h4>
//                     <div className="flex items-center gap-3 p-4 bg-muted rounded-lg hover:bg-muted/80 transition">
//                       <FileText className="w-6 h-6 text-blue-600 flex-shrink-0" />
//                       <a
//                         href={provider.cvUrl}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-blue-600 hover:underline font-medium flex-1"
//                       >
//                         Open CV
//                       </a>
//                     </div>
//                   </div>
//                 )}

//                 {/* WRITTEN CV */}
//                 {provider.writtenCv && provider.writtenCv !== 'No CV provided' && (
//                   <div className="mb-6">
//                     <h4 className="font-semibold text-lg mb-2">Written CV</h4>
//                     <div className="p-4 bg-muted rounded-lg">
//                       <p className="text-muted-foreground text-sm leading-relaxed line-clamp-4">
//                         {provider.writtenCv}
//                       </p>
//                     </div>
//                   </div>
//                 )}

//                 {/* ACTIONS */}
//                 <div className="flex gap-3 pt-6 border-t">
//                   <Button
//                     variant="success"
//                     onClick={() => handleApprove(provider)}
//                     disabled={isApproving || isRejecting}
//                     className="flex-1"
//                   >
//                     <CheckCircle className="w-4 h-4" />
//                     Approve Provider
//                   </Button>
//                   <Button
//                     variant="destructive"
//                     onClick={() => {
//                       setSelectedProviderId(provider.id || provider._id || null);
//                       setShowRejectModal(true);
//                     }}
//                     disabled={isApproving || isRejecting}
//                     className="flex-1"
//                   >
//                     <X className="w-4 h-4" />
//                     Reject Application
//                   </Button>
//                 </div>

//               </Card>
//             ))
//           )}
//         </div>

//         {/* REJECT MODAL */}
//         <Modal
//           isOpen={showRejectModal}
//           onClose={() => setShowRejectModal(false)}
//           title="Reject Application"
//         >
//           <div className="space-y-4">
//             <Textarea
//               label="Rejection Reason"
//               placeholder="Provide a reason for rejection..."
//               value={rejectionReason}
//               onChange={(e) => setRejectionReason(e.target.value)}
//               disabled={isRejecting}
//               required
//             />
//             <div className="flex gap-3">
//               <Button
//                 variant="outline"
//                 onClick={() => setShowRejectModal(false)}
//                 className="flex-1"
//                 disabled={isRejecting}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 variant="destructive"
//                 onClick={handleReject}
//                 className="flex-1"
//                 disabled={isRejecting}
//               >
//                 {isRejecting ? 'Rejecting...' : 'Reject'}
//               </Button>
//             </div>
//           </div>
//         </Modal>

//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from 'react';
import { FileText, CheckCircle, X, AlertCircle, IdCard } from 'lucide-react';
import { toast } from 'sonner';
import AdminSidebar from '../../../components/layout/AdminSidebar';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import Textarea from '../../../components/ui/Textarea';
import { SkeletonCard } from '../../../components/ui/Skeleton';
import {
  getPendingProviders,
  approveProvider,
  rejectProvider,
} from './ProviderApprovalActions';
import { getDetails } from '../Details/DetailsActions';

interface Provider {
  id?: string;
  _id?: string;
  name?: string;
  cvUrl?: string;
  idCardFrontUrl?: string;
  idCardBackUrl?: string;
  userName?: string;
  email: string;
  age?: string | number;
  mobileNumber?: string;
  service?: string | { _id: string; name: string };
  specialization?: string;
  nationalNumber?: string;
  cvFile?: string;
  writtenCv?: string;
  profileURL?: string;
  createdAt?: string;
  status?: string;
  location?: string;
  city?: string;
  state?: string;
  hourPrice?: number | string;
}

const DEFAULT_AVATAR = 'https://i.pravatar.cc/150?img=3';

export default function ProviderApproval() {
  const [providers,          setProviders]          = useState<Provider[]>([]);
  const [loading,            setLoading]            = useState(true);
  const [showRejectModal,    setShowRejectModal]    = useState(false);
  const [rejectionReason,    setRejectionReason]    = useState('');
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);
  const [isApproving,        setIsApproving]        = useState(false);
  const [isRejecting,        setIsRejecting]        = useState(false);
  const [lightboxUrl,        setLightboxUrl]        = useState<string | null>(null);

  useEffect(() => {
    loadPendingProviders();
  }, []);

  // ============ LOAD ============
  const loadPendingProviders = async () => {
    try {
      setLoading(true);
      const result = await getPendingProviders();

      if (result.success) {
        const pendingList = Array.isArray(result.data) ? result.data : [];

        const detailed = await Promise.all(
          pendingList.map(async (p: any) => {
            const details = await getDetails(p.id || p._id);
            if (details.success) {
              return {
                ...details.data,
                service:
                  typeof p.service === 'object'
                    ? p.service
                    : details.data.service,
                id: p.id || p._id,
              };
            }
            return { ...p, id: p.id || p._id };
          })
        );

        setProviders(detailed);
        if (detailed.length === 0) toast.info('No pending providers to review');
      } else {
        toast.error(result.error || 'Failed to load pending providers');
        setProviders([]);
      }
    } catch {
      toast.error('Error loading pending providers');
      setProviders([]);
    } finally {
      setLoading(false);
    }
  };

  // ============ APPROVE ============
  const handleApprove = async (provider: Provider) => {
    const providerId = provider.id || provider._id;
    if (!providerId) { toast.error('Invalid provider ID'); return; }

    setIsApproving(true);
    const result = await approveProvider(providerId);
    setIsApproving(false);

    if (result.success) {
      toast.success(result.message || 'Provider approved successfully');
      setProviders((prev) => prev.filter((p) => (p.id || p._id) !== providerId));
    } else {
      toast.error(result.error || 'Failed to approve provider');
    }
  };

  // ============ REJECT ============
  const handleReject = async () => {
    if (!selectedProviderId)     { toast.error('Invalid provider ID');     return; }
    if (!rejectionReason.trim()) { toast.error('Please provide a reason'); return; }

    setIsRejecting(true);
    const result = await rejectProvider(selectedProviderId, rejectionReason);
    setIsRejecting(false);

    if (result.success) {
      toast.success(result.message || 'Provider rejected successfully');
      setProviders((prev) =>
        prev.filter((p) => (p.id || p._id) !== selectedProviderId)
      );
      setShowRejectModal(false);
      setRejectionReason('');
      setSelectedProviderId(null);
    } else {
      toast.error(result.error || 'Failed to reject provider');
    }
  };

  // ============ HELPERS ============
  const getName     = (p: Provider) => p.userName || p.name || p.email || 'Provider';
  const getPhoto    = (p: Provider) => p.profileURL || DEFAULT_AVATAR;
  const getCategory = (p: Provider) => {
    if (typeof p.service === 'object' && p.service !== null)
      return (p.service as any).name || '—';
    return (p.service as string) || '—';
  };
  const getLocation = (p: Provider) => {
    if (p.city && p.state) return `${p.city}, ${p.state}`;
    return p.city || p.location || 'Not specified';
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Provider Approval</h1>
          <p className="text-muted-foreground">
            Review and approve pending provider applications
          </p>
        </div>

        <div className="space-y-6">
          {loading ? (
            <><SkeletonCard /><SkeletonCard /><SkeletonCard /></>
          ) : providers.length === 0 ? (
            <Card>
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No pending providers to review</p>
                <Button variant="outline" onClick={loadPendingProviders}>Refresh</Button>
              </div>
            </Card>
          ) : (
            providers.map((provider) => (
              <Card key={provider.id || provider._id}>

                {/* HEADER */}
                <div className="flex items-start gap-6 mb-8 pb-6 border-b">
                  <img
                    src={getPhoto(provider)}
                    alt={getName(provider)}
                    className="w-28 h-28 rounded-full object-cover flex-shrink-0"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = DEFAULT_AVATAR;
                    }}
                  />
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-4">{getName(provider)}</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground font-semibold">EMAIL</p>
                        <p className="text-sm">{provider.email || '—'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-semibold">AGE</p>
                        <p className="text-sm">{provider.age || '—'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-semibold">PHONE</p>
                        <p className="text-sm">{provider.mobileNumber || '—'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-semibold">CATEGORY</p>
                        <p className="text-sm">{getCategory(provider)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-semibold">NATIONAL ID</p>
                        <p className="text-sm">{provider.nationalNumber || '—'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-semibold">LOCATION</p>
                        <p className="text-sm">{getLocation(provider)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-semibold">HOUR PRICE</p>
                        <p className="text-sm">
                          {provider.hourPrice ? `${provider.hourPrice} EGP/hr` : '—'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SPECIALIZATION */}
                {provider.specialization && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-lg mb-2">Specialization</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {provider.specialization}
                    </p>
                  </div>
                )}

                {/* ID CARD IMAGES */}
                {(provider.idCardFrontUrl || provider.idCardBackUrl) && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <IdCard className="w-5 h-5" />
                      National ID Card
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      {/* FRONT */}
                      <div>
                        <p className="text-xs text-muted-foreground font-semibold mb-2">FRONT SIDE</p>
                        {provider.idCardFrontUrl ? (
                          <button
                            type="button"
                            onClick={() => setLightboxUrl(provider.idCardFrontUrl!)}
                            className="w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
                          >
                            <img
                              src={provider.idCardFrontUrl}
                              alt="ID card front"
                              className="w-full h-40 object-cover rounded-lg border hover:opacity-90 transition cursor-zoom-in"
                            />
                          </button>
                        ) : (
                          <div className="w-full h-40 rounded-lg border bg-muted flex items-center justify-center">
                            <p className="text-xs text-muted-foreground">Not provided</p>
                          </div>
                        )}
                      </div>

                      {/* BACK */}
                      <div>
                        <p className="text-xs text-muted-foreground font-semibold mb-2">BACK SIDE</p>
                        {provider.idCardBackUrl ? (
                          <button
                            type="button"
                            onClick={() => setLightboxUrl(provider.idCardBackUrl!)}
                            className="w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
                          >
                            <img
                              src={provider.idCardBackUrl}
                              alt="ID card back"
                              className="w-full h-40 object-cover rounded-lg border hover:opacity-90 transition cursor-zoom-in"
                            />
                          </button>
                        ) : (
                          <div className="w-full h-40 rounded-lg border bg-muted flex items-center justify-center">
                            <p className="text-xs text-muted-foreground">Not provided</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* CV FILE */}
                {provider.cvUrl && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-lg mb-2">CV Document</h4>
                    <div className="flex items-center gap-3 p-4 bg-muted rounded-lg hover:bg-muted/80 transition">
                      <FileText className="w-6 h-6 text-blue-600 flex-shrink-0" />
                      <a
                        href={provider.cvUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-medium flex-1"
                      >
                        Open CV
                      </a>
                    </div>
                  </div>
                )}

                {/* WRITTEN CV */}
                {provider.writtenCv && provider.writtenCv !== 'No CV provided' && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-lg mb-2">Written CV</h4>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-4">
                        {provider.writtenCv}
                      </p>
                    </div>
                  </div>
                )}

                {/* ACTIONS */}
                <div className="flex gap-3 pt-6 border-t">
                  <Button
                    variant="success"
                    onClick={() => handleApprove(provider)}
                    disabled={isApproving || isRejecting}
                    className="flex-1"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve Provider
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setSelectedProviderId(provider.id || provider._id || null);
                      setShowRejectModal(true);
                    }}
                    disabled={isApproving || isRejecting}
                    className="flex-1"
                  >
                    <X className="w-4 h-4" />
                    Reject Application
                  </Button>
                </div>

              </Card>
            ))
          )}
        </div>

        {/* REJECT MODAL */}
        <Modal
          isOpen={showRejectModal}
          onClose={() => setShowRejectModal(false)}
          title="Reject Application"
        >
          <div className="space-y-4">
            <Textarea
              label="Rejection Reason"
              placeholder="Provide a reason for rejection..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              disabled={isRejecting}
              required
            />
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowRejectModal(false)}
                className="flex-1"
                disabled={isRejecting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                className="flex-1"
                disabled={isRejecting}
              >
                {isRejecting ? 'Rejecting...' : 'Reject'}
              </Button>
            </div>
          </div>
        </Modal>

        {/* ID CARD LIGHTBOX */}
        {lightboxUrl && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
            onClick={() => setLightboxUrl(null)}
          >
            <button
              type="button"
              className="absolute top-4 right-4 text-white hover:text-white/70 transition"
              onClick={() => setLightboxUrl(null)}
              aria-label="Close"
            >
              <X className="w-8 h-8" />
            </button>
            <img
              src={lightboxUrl}
              alt="ID card full size"
              className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-2xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}

      </div>
    </div>
  );
}
