// import { useState, useEffect } from 'react';
// import { useParams, useNavigate, useLocation } from 'react-router-dom';
// import { ArrowLeft, MapPin, Star, ChevronLeft, ChevronRight, Briefcase, Loader2 } from 'lucide-react';
// import { toast } from 'sonner';
// import Card from '../../components/ui/Card';
// import Button from '../../components/ui/Button';
// import Modal from '../../components/ui/Modal';
// import Input from '../../components/ui/Input';
// import Select from '../../components/ui/Select';
// import { createServiceRequest } from '../customer/Services/ServicesActions';
// import { getStates, getCities } from '../../services/locationService';

// type StateOption = { value: string; label: string; iso2: string };

// const DEFAULT_AVATAR = 'https://i.pravatar.cc/150?img=1';

// export default function ProviderPublicProfile() {
//   const { id }     = useParams<{ id: string }>();
//   const navigate   = useNavigate();
//   const location   = useLocation();

//   const [provider,         setProvider]         = useState<any>(location.state?.provider || null);
//   const [reviews,          setReviews]          = useState<any[]>([]);
//   const [loading,          setLoading]          = useState(!location.state?.provider);
//   const [currentReview,    setCurrentReview]    = useState(0);
//   const [showRequestModal, setShowRequestModal] = useState(false);
//   const [isSubmitting,     setIsSubmitting]     = useState(false);
//   const [requestData,      setRequestData]      = useState({
//     date: '',
//     time: '',
//     governorate: '',
//     city: '',
//     street: '',
//     exactLocation: '',
//   });

//   // ── Governorate / City dropdown data ──────────────────────
//   const [requestStates,        setRequestStates]        = useState<StateOption[]>([]);
//   const [requestCities,        setRequestCities]        = useState<{ value: string; label: string }[]>([]);
//   const [loadingRequestStates, setLoadingRequestStates] = useState(false);
//   const [loadingRequestCities, setLoadingRequestCities] = useState(false);

//   // ── Fetch reviews (+ provider لو مفيش state) ────────────
//   useEffect(() => {
//     if (!id) return;

//     const token = localStorage.getItem('access_token');

//     const fetchReviews = () =>
//       fetch(`/api/review/provider-reviews/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//         .then((r) => r.json())
//         .then((data) => setReviews(Array.isArray(data) ? data : []))
//         .catch(console.error);

//     if (location.state?.provider) {
//       // عندنا الداتا — جيبي الـ reviews بس
//       fetchReviews();
//     } else {
//       // direct URL — مفيش provider endpoint، نعرض loading false بس مع reviews
//       setLoading(true);
//       fetchReviews().finally(() => setLoading(false));
//     }
//   }, [id]);

//   // ── Load governorates (states) ────────────────────────────
//   useEffect(() => {
//     const loadStates = async () => {
//       try {
//         setLoadingRequestStates(true);
//         const statesData = await getStates();
//         const mapped: StateOption[] = Array.isArray(statesData)
//           ? statesData.map((s: any) => ({
//               value: s.name,
//               label: s.name,
//               iso2: s.iso2,
//             }))
//           : [];
//         setRequestStates(mapped);
//       } catch {
//         toast.error('Failed to load governorates');
//       } finally {
//         setLoadingRequestStates(false);
//       }
//     };
//     loadStates();
//   }, []);

//   // ── Load cities whenever governorate changes ─────────────
//   useEffect(() => {
//     if (!requestData.governorate || requestStates.length === 0) {
//       setRequestCities([]);
//       return;
//     }

//     const loadCities = async () => {
//       try {
//         setLoadingRequestCities(true);
//         const stateObj = requestStates.find((s) => s.value === requestData.governorate);
//         if (!stateObj) return;

//         const data = await getCities(stateObj.iso2);
//         const mapped = Array.isArray(data)
//           ? data.map((c: any) => ({ value: c.name, label: c.name }))
//           : [];
//         setRequestCities(mapped);
//       } catch {
//         toast.error('Failed to load cities');
//       } finally {
//         setLoadingRequestCities(false);
//       }
//     };

//     loadCities();
//   }, [requestData.governorate, requestStates]);

//   // ── Submit request ───────────────────────────────────────
//   const handleSubmitRequest = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!provider) return;

//     setIsSubmitting(true);
//     const result = await createServiceRequest({
//       providerId:    provider._id || provider.id,
//       governorate:   requestData.governorate,
//       city:          requestData.city,
//       street:        requestData.street,
//       exactLocation: requestData.exactLocation,
//       serviceNeeded: provider.service?._id || provider.service?.id || '',
//       dateNeeded:    requestData.date,
//       startTime:     requestData.time,
//     });
//     setIsSubmitting(false);

//     if (result.success) {
//       toast.success('Service request submitted successfully!');
//       setShowRequestModal(false);
//       setRequestData({ date: '', time: '', governorate: '', city: '', street: '', exactLocation: '' });
//     } else {
//       toast.error(result.error || 'Failed to submit request');
//     }
//   };

//   const nextReview = () => setCurrentReview((prev) => (prev + 1) % reviews.length);
//   const prevReview = () => setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);

//   const getReviewerName = (review: any) =>
//     review.userId?.userName ||
//     (review.userId?.firstName && review.userId?.lastName
//       ? `${review.userId.firstName} ${review.userId.lastName}`
//       : 'Anonymous');

//   // ── Loading ──────────────────────────────────────────────
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <Loader2 className="w-8 h-8 animate-spin text-primary" />
//       </div>
//     );
//   }

//   if (!provider) {
//     return (
//       <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
//         <p className="text-muted-foreground">Provider not found.</p>
//         <Button onClick={() => navigate(-1)}>Go Back</Button>
//       </div>
//     );
//   }

//   const providerName = provider.userName ||
//     `${provider.firstName} ${provider.lastName}`;

//   const memberYears = provider.createdAt
//     ? new Date().getFullYear() - new Date(provider.createdAt).getFullYear()
//     : 0;

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="container mx-auto px-4 py-8 max-w-4xl">
//         <button
//           onClick={() => navigate(-1)}
//           className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
//         >
//           <ArrowLeft className="w-5 h-5" />
//           Back
//         </button>

//         <div className="grid lg:grid-cols-3 gap-6">

//           {/* ── Left column ── */}
//           <div className="lg:col-span-2 space-y-6">
//             <Card>
//               <div className="flex flex-col md:flex-row gap-6 mb-6">
//                 <img
//                   src={provider.profileURL || DEFAULT_AVATAR}
//                   alt={providerName}
//                   className="w-32 h-32 rounded-full object-cover border-4 border-primary flex-shrink-0"
//                   onError={(e) => {
//                     (e.currentTarget as HTMLImageElement).src = DEFAULT_AVATAR;
//                   }}
//                 />
//                 <div className="flex-1">
//                   <h1 className="text-3xl font-bold mb-2">{providerName}</h1>
//                   <div className="flex items-center gap-2 mb-3">
//                     <Briefcase className="w-4 h-4 text-muted-foreground" />
//                     <span className="text-muted-foreground">{provider.service?.name || '—'}</span>
//                     {provider.hourPrice && (
//                       <>
//                         <span className="text-muted-foreground">·</span>
//                         <span className="font-semibold text-primary">
//                           {provider.hourPrice} EGP/hr
//                         </span>
//                       </>
//                     )}
//                   </div>
//                   <div className="flex items-center gap-3 mb-4">
//                     <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1.5 rounded-full">
//                       <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
//                       <span className="font-semibold text-yellow-900">
//                         {provider.averageRating?.toFixed(1)}
//                       </span>
//                       <span className="text-sm text-yellow-800">({provider.reviewsCount})</span>
//                     </div>
//                     <div className="flex items-center gap-1 text-muted-foreground">
//                       <MapPin className="w-4 h-4" />
//                       <span>{[provider.city, provider.state].filter(Boolean).join(', ')}</span>
//                     </div>
//                   </div>
//                   {/* <Button
//                     onClick={() => setShowRequestModal(true)}
//                     size="lg"
//                     className="w-full md:w-auto"
//                   >
//                     Request Service
//                   </Button> */}
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4 py-4 border-y border-border">
//                 <div className="text-center">
//                   <p className="text-3xl font-bold text-primary mb-1">{provider.reviewsCount || 0}</p>
//                   <p className="text-sm text-muted-foreground">Reviews</p>
//                 </div>
//                 <div className="text-center">
//                   <p className="text-3xl font-bold text-primary mb-1">{memberYears}+ yrs</p>
//                   <p className="text-sm text-muted-foreground">On Platform</p>
//                 </div>
//               </div>

//               {provider.writtenCv && (
//                 <div className="mt-6">
//                   <h2 className="text-xl font-bold mb-3">About</h2>
//                   <p className="text-muted-foreground">{provider.writtenCv}</p>
//                 </div>
//               )}

//               {provider.specialization && (
//                 <div className="mt-4">
//                   <h2 className="text-xl font-bold mb-3">Specialization</h2>
//                   <p className="text-muted-foreground">{provider.specialization}</p>
//                 </div>
//               )}
//             </Card>

//             {/* Reviews */}
//             {reviews.length > 0 && (
//               <Card>
//                 <h2 className="text-xl font-bold mb-6">Customer Reviews</h2>
//                 <div className="space-y-4">
//                   <div className="p-4 bg-muted/50 rounded-xl">
//                     <div className="flex items-start gap-3 mb-3">
//                       <img
//                         src={DEFAULT_AVATAR}
//                         alt={getReviewerName(reviews[currentReview])}
//                         className="w-12 h-12 rounded-full object-cover"
//                       />
//                       <div className="flex-1">
//                         <p className="font-semibold">{getReviewerName(reviews[currentReview])}</p>
//                         <div className="flex items-center gap-2">
//                           <div className="flex gap-0.5">
//                             {[...Array(reviews[currentReview].rate)].map((_, i) => (
//                               <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
//                             ))}
//                           </div>
//                           <span className="text-sm text-muted-foreground">
//                             {new Date(reviews[currentReview].createdAt).toLocaleDateString()}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                     <p className="text-muted-foreground italic">
//                       "{reviews[currentReview].content}"
//                     </p>
//                   </div>

//                   {reviews.length > 1 && (
//                     <div className="flex items-center justify-center gap-4">
//                       <button
//                         onClick={prevReview}
//                         className="p-2 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors"
//                       >
//                         <ChevronLeft className="w-5 h-5" />
//                       </button>
//                       <span className="text-sm text-muted-foreground">
//                         {currentReview + 1} / {reviews.length}
//                       </span>
//                       <button
//                         onClick={nextReview}
//                         className="p-2 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors"
//                       >
//                         <ChevronRight className="w-5 h-5" />
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </Card>
//             )}
//           </div>

//           {/* ── Right column ── */}
//           <div className="space-y-6">
//             <Card className="bg-primary text-white sticky top-6">
//               <h3 className="text-xl font-bold mb-4">Ready to Book?</h3>
//               <p className="text-white/90 mb-4">
//                 Get professional {provider.service?.name?.toLowerCase() || 'service'} from {providerName}
//               </p>
//               <Button
//                 onClick={() => setShowRequestModal(true)}
//                 variant="secondary"
//                 className="w-full"
//               >
//                 Request Service Now
//               </Button>
//             </Card>
//           </div>
//         </div>
//       </div>

//       {/* Request Modal */}
//       <Modal
//         isOpen={showRequestModal}
//         onClose={() => setShowRequestModal(false)}
//         title={`Request Service from ${providerName}`}
//         size="lg"
//       >
//         <form onSubmit={handleSubmitRequest} className="space-y-4">
//           <div className="flex items-center gap-3 p-3 bg-muted rounded-lg mb-2">
//             <img
//               src={provider.profileURL || DEFAULT_AVATAR}
//               alt={providerName}
//               className="w-12 h-12 rounded-full object-cover"
//               onError={(e) => {
//                 (e.currentTarget as HTMLImageElement).src = DEFAULT_AVATAR;
//               }}
//             />
//             <div>
//               <p className="font-semibold">{providerName}</p>
//               <p className="text-sm text-muted-foreground">{provider.service?.name}</p>
//             </div>
//           </div>

//           <div className="grid md:grid-cols-2 gap-4">
//             <Input
//               type="date"
//               label="Preferred Date"
//               value={requestData.date}
//               onChange={(e) => setRequestData({ ...requestData, date: e.target.value })}
//               required
//             />
//             <Input
//               type="time"
//               label="Preferred Time"
//               value={requestData.time}
//               onChange={(e) => setRequestData({ ...requestData, time: e.target.value })}
//               required
//             />
//           </div>
//           <div className="grid md:grid-cols-2 gap-4">
//             <Select
//               label="Governorate"
//               value={requestData.governorate}
//               onChange={(e) =>
//                 setRequestData({ ...requestData, governorate: e.target.value, city: '' })
//               }
//               options={[
//                 {
//                   value: '',
//                   label: loadingRequestStates ? 'Loading...' : 'Select Governorate',
//                 },
//                 ...requestStates,
//               ]}
//               required
//             />
//             <Select
//               label="City"
//               value={requestData.city}
//               onChange={(e) => setRequestData({ ...requestData, city: e.target.value })}
//               disabled={!requestData.governorate || loadingRequestCities}
//               options={[
//                 {
//                   value: '',
//                   label: loadingRequestCities ? 'Loading...' : 'Select City',
//                 },
//                 ...requestCities,
//               ]}
//               required
//             />
//           </div>
//           <Input
//             label="Street"
//             placeholder="Enter street name"
//             value={requestData.street}
//             onChange={(e) => setRequestData({ ...requestData, street: e.target.value })}
//             required
//           />
//           <Input
//             label="Exact Location"
//             placeholder="Building number, floor, apartment"
//             value={requestData.exactLocation}
//             onChange={(e) => setRequestData({ ...requestData, exactLocation: e.target.value })}
//             required
//           />
//           <Button type="submit" className="w-full" disabled={isSubmitting}>
//             {isSubmitting ? 'Submitting...' : 'Submit Request'}
//           </Button>
//         </form>
//       </Modal>
//     </div>
//   );
// }

import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, ChevronLeft, ChevronRight, Briefcase, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { createServiceRequest } from '../customer/Services/ServicesActions';
import { getStates, getCities } from '../../services/locationService';

type StateOption = { value: string; label: string; iso2: string };

const DEFAULT_AVATAR = 'https://i.pravatar.cc/150?img=1';

export default function ProviderPublicProfile() {
  const { id }     = useParams<{ id: string }>();
  const navigate   = useNavigate();
  const location   = useLocation();

  const [provider,         setProvider]         = useState<any>(location.state?.provider || null);
  const [reviews,          setReviews]          = useState<any[]>([]);
  const [loading,          setLoading]          = useState(!location.state?.provider);
  const [currentReview,    setCurrentReview]    = useState(0);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [isSubmitting,     setIsSubmitting]     = useState(false);
  const [requestData,      setRequestData]      = useState({
    serviceNeeded: '',
    date: '',
    time: '',
    governorate: '',
    city: '',
    street: '',
    exactLocation: '',
    paymentMode: 'FIXED' as 'FIXED' | 'HOURLY',
    preferredPrice: '',
  });

  // ── Governorate / City dropdown data ──────────────────────
  const [requestStates,        setRequestStates]        = useState<StateOption[]>([]);
  const [requestCities,        setRequestCities]        = useState<{ value: string; label: string }[]>([]);
  const [loadingRequestStates, setLoadingRequestStates] = useState(false);
  const [loadingRequestCities, setLoadingRequestCities] = useState(false);

  // ── Fetch reviews (+ provider لو مفيش state) ────────────
  useEffect(() => {
    if (!id) return;

    const token = localStorage.getItem('access_token');

    const fetchReviews = () =>
      fetch(`/api/review/provider-reviews/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((data) => setReviews(Array.isArray(data) ? data : []))
        .catch(console.error);

    if (location.state?.provider) {
      // عندنا الداتا — جيبي الـ reviews بس
      fetchReviews();
    } else {
      // direct URL — مفيش provider endpoint، نعرض loading false بس مع reviews
      setLoading(true);
      fetchReviews().finally(() => setLoading(false));
    }
  }, [id]);

  // ── Load governorates (states) ────────────────────────────
  useEffect(() => {
    const loadStates = async () => {
      try {
        setLoadingRequestStates(true);
        const statesData = await getStates();
        const mapped: StateOption[] = Array.isArray(statesData)
          ? statesData.map((s: any) => ({
              value: s.name,
              label: s.name,
              iso2: s.iso2,
            }))
          : [];
        setRequestStates(mapped);
      } catch {
        toast.error('Failed to load governorates');
      } finally {
        setLoadingRequestStates(false);
      }
    };
    loadStates();
  }, []);

  // ── Load cities whenever governorate changes ─────────────
  useEffect(() => {
    if (!requestData.governorate || requestStates.length === 0) {
      setRequestCities([]);
      return;
    }

    const loadCities = async () => {
      try {
        setLoadingRequestCities(true);
        const stateObj = requestStates.find((s) => s.value === requestData.governorate);
        if (!stateObj) return;

        const data = await getCities(stateObj.iso2);
        const mapped = Array.isArray(data)
          ? data.map((c: any) => ({ value: c.name, label: c.name }))
          : [];
        setRequestCities(mapped);
      } catch {
        toast.error('Failed to load cities');
      } finally {
        setLoadingRequestCities(false);
      }
    };

    loadCities();
  }, [requestData.governorate, requestStates]);

  // ── Submit request ───────────────────────────────────────
  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!provider) return;

    if (!requestData.serviceNeeded.trim()) {
      toast.error('Please describe the service you need');
      return;
    }

    if (requestData.paymentMode === 'HOURLY' && !provider.hourPrice) {
      toast.error('This provider has not set an hourly rate yet. Please choose Fixed Price instead.');
      return;
    }

    setIsSubmitting(true);
    const result = await createServiceRequest({
      providerId:    provider._id || provider.id,
      governorate:   requestData.governorate,
      city:          requestData.city,
      street:        requestData.street,
      exactLocation: requestData.exactLocation,
      serviceNeeded: requestData.serviceNeeded.trim(),
      dateNeeded:    requestData.date,
      startTime:     requestData.time,
      paymentMode:   requestData.paymentMode,
      ...(requestData.paymentMode === 'FIXED' && requestData.preferredPrice
        ? { preferredPrice: Number(requestData.preferredPrice) }
        : {}),
    });
    setIsSubmitting(false);

    if (result.success) {
      toast.success('Service request submitted successfully!');
      setShowRequestModal(false);
      setRequestData({
        serviceNeeded: '',
        date: '',
        time: '',
        governorate: '',
        city: '',
        street: '',
        exactLocation: '',
        paymentMode: 'FIXED',
        preferredPrice: '',
      });
    } else {
      toast.error(result.error || 'Failed to submit request');
    }
  };

  const nextReview = () => setCurrentReview((prev) => (prev + 1) % reviews.length);
  const prevReview = () => setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);

  const getReviewerName = (review: any) =>
    review.userId?.userName ||
    (review.userId?.firstName && review.userId?.lastName
      ? `${review.userId.firstName} ${review.userId.lastName}`
      : 'Anonymous');

  // ── Loading ──────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Provider not found.</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  const providerName = provider.userName ||
    `${provider.firstName} ${provider.lastName}`;

  const memberYears = provider.createdAt
    ? new Date().getFullYear() - new Date(provider.createdAt).getFullYear()
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* ── Left column ── */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                <img
                  src={provider.profileURL || DEFAULT_AVATAR}
                  alt={providerName}
                  className="w-32 h-32 rounded-full object-cover border-4 border-primary flex-shrink-0"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = DEFAULT_AVATAR;
                  }}
                />
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">{providerName}</h1>
                  <div className="flex items-center gap-2 mb-3">
                    <Briefcase className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{provider.service?.name || '—'}</span>
                    {provider.hourPrice && (
                      <>
                        <span className="text-muted-foreground">·</span>
                        <span className="font-semibold text-primary">
                          {provider.hourPrice} EGP/hr
                        </span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1.5 rounded-full">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-yellow-900">
                        {provider.averageRating?.toFixed(1)}
                      </span>
                      <span className="text-sm text-yellow-800">({provider.reviewsCount})</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{[provider.city, provider.state].filter(Boolean).join(', ')}</span>
                    </div>
                  </div>
                  {/* <Button
                    onClick={() => setShowRequestModal(true)}
                    size="lg"
                    className="w-full md:w-auto"
                  >
                    Request Service
                  </Button> */}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-y border-border">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary mb-1">{provider.reviewsCount || 0}</p>
                  <p className="text-sm text-muted-foreground">Reviews</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary mb-1">{memberYears}+ yrs</p>
                  <p className="text-sm text-muted-foreground">On Platform</p>
                </div>
              </div>

              {provider.writtenCv && (
                <div className="mt-6">
                  <h2 className="text-xl font-bold mb-3">About</h2>
                  <p className="text-muted-foreground">{provider.writtenCv}</p>
                </div>
              )}

              {provider.specialization && (
                <div className="mt-4">
                  <h2 className="text-xl font-bold mb-3">Specialization</h2>
                  <p className="text-muted-foreground">{provider.specialization}</p>
                </div>
              )}
            </Card>

            {/* Reviews */}
            {reviews.length > 0 && (
              <Card>
                <h2 className="text-xl font-bold mb-6">Customer Reviews</h2>
                <div className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-xl">
                    <div className="flex items-start gap-3 mb-3">
                      <img
                        src={DEFAULT_AVATAR}
                        alt={getReviewerName(reviews[currentReview])}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-semibold">{getReviewerName(reviews[currentReview])}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex gap-0.5">
                            {[...Array(reviews[currentReview].rate)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {new Date(reviews[currentReview].createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-muted-foreground italic">
                      "{reviews[currentReview].content}"
                    </p>
                  </div>

                  {reviews.length > 1 && (
                    <div className="flex items-center justify-center gap-4">
                      <button
                        onClick={prevReview}
                        className="p-2 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <span className="text-sm text-muted-foreground">
                        {currentReview + 1} / {reviews.length}
                      </span>
                      <button
                        onClick={nextReview}
                        className="p-2 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>

          {/* ── Right column ── */}
          <div className="space-y-6">
            <Card className="bg-primary text-white sticky top-6">
              <h3 className="text-xl font-bold mb-4">Ready to Book?</h3>
              <p className="text-white/90 mb-4">
                Get professional {provider.service?.name?.toLowerCase() || 'service'} from {providerName}
              </p>
              <Button
                onClick={() => setShowRequestModal(true)}
                variant="secondary"
                className="w-full"
              >
                Request Service Now
              </Button>
            </Card>
          </div>
        </div>
      </div>

      {/* Request Modal */}
      <Modal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        title={`Request Service from ${providerName}`}
        size="lg"
      >
        <form onSubmit={handleSubmitRequest} className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg mb-2">
            <img
              src={provider.profileURL || DEFAULT_AVATAR}
              alt={providerName}
              className="w-12 h-12 rounded-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = DEFAULT_AVATAR;
              }}
            />
            <div>
              <p className="font-semibold">{providerName}</p>
              <p className="text-sm text-muted-foreground">{provider.service?.name}</p>
            </div>
          </div>

          <Input
            label="Service Needed"
            placeholder="e.g. plumbing repair"
            value={requestData.serviceNeeded}
            onChange={(e) => setRequestData({ ...requestData, serviceNeeded: e.target.value })}
            required
          />

          {/* Payment Mode */}
          <div>
            <label className="text-sm font-medium mb-2 block">Payment Mode</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRequestData({ ...requestData, paymentMode: 'FIXED' })}
                className={`px-4 py-3 rounded-lg border text-sm font-medium transition-colors ${
                  requestData.paymentMode === 'FIXED'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border text-muted-foreground hover:bg-muted'
                }`}
              >
                Fixed Price
              </button>
              <button
                type="button"
                disabled={!provider.hourPrice}
                onClick={() => setRequestData({ ...requestData, paymentMode: 'HOURLY' })}
                className={`px-4 py-3 rounded-lg border text-sm font-medium transition-colors ${
                  requestData.paymentMode === 'HOURLY'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border text-muted-foreground hover:bg-muted'
                } ${!provider.hourPrice ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Hourly Rate
              </button>
            </div>
            {!provider.hourPrice && (
              <p className="text-xs text-muted-foreground mt-2">
                This provider hasn't set an hourly rate, so only fixed-price requests are available.
              </p>
            )}
          </div>

          {requestData.paymentMode === 'FIXED' ? (
            <Input
              type="number"
              label="Preferred Price (EGP) — optional"
              placeholder="e.g. 400"
              value={requestData.preferredPrice}
              onChange={(e) => setRequestData({ ...requestData, preferredPrice: e.target.value })}
              min={50}
            />
          ) : (
            <div className="bg-muted rounded-lg p-3">
              <p className="text-sm text-muted-foreground">
                This provider charges{' '}
                <span className="font-semibold text-foreground">EGP {provider.hourPrice}/hr</span>.
                The final price will be calculated after completion based on hours worked.
              </p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <Input
              type="date"
              label="Preferred Date"
              value={requestData.date}
              onChange={(e) => setRequestData({ ...requestData, date: e.target.value })}
              required
            />
            <Input
              type="time"
              label="Preferred Time"
              value={requestData.time}
              onChange={(e) => setRequestData({ ...requestData, time: e.target.value })}
              required
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Select
              label="Governorate"
              value={requestData.governorate}
              onChange={(e) =>
                setRequestData({ ...requestData, governorate: e.target.value, city: '' })
              }
              options={[
                {
                  value: '',
                  label: loadingRequestStates ? 'Loading...' : 'Select Governorate',
                },
                ...requestStates,
              ]}
              required
            />
            <Select
              label="City"
              value={requestData.city}
              onChange={(e) => setRequestData({ ...requestData, city: e.target.value })}
              disabled={!requestData.governorate || loadingRequestCities}
              options={[
                {
                  value: '',
                  label: loadingRequestCities ? 'Loading...' : 'Select City',
                },
                ...requestCities,
              ]}
              required
            />
          </div>
          <Input
            label="Street"
            placeholder="Enter street name"
            value={requestData.street}
            onChange={(e) => setRequestData({ ...requestData, street: e.target.value })}
            required
          />
          <Input
            label="Exact Location"
            placeholder="Building number, floor, apartment"
            value={requestData.exactLocation}
            onChange={(e) => setRequestData({ ...requestData, exactLocation: e.target.value })}
            required
          />
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </Button>
        </form>
      </Modal>
    </div>
  );
}