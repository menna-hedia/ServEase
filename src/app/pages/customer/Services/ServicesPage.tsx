import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Search, Star, MapPin, Users } from 'lucide-react';
import { toast } from 'sonner';
import CustomerNavbar from '../../../components/layout/CustomerNavbar';
import Footer from '../../../components/layout/Footer';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Modal from '../../../components/ui/Modal';
import EmptyState from '../../../components/ui/EmptyState';
import { SkeletonCard } from '../../../components/ui/Skeleton';
import { createServiceRequest } from './ServicesActions';
import { getAllServices } from '../../shared/Services/ServicesActions';
import { useLocation } from 'react-router';

export default function ServicesPage() {
  const [services,         setServices]         = useState<{ _id: string; name: string }[]>([]);
  const [providers,        setProviders]        = useState<any[]>([]);
  const [selectedService,  setSelectedService]  = useState<{ _id: string; name: string } | null>(null);
  const [searchTerm,       setSearchTerm]       = useState('');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<any | null>(null);
  const [loadingServices,  setLoadingServices]  = useState(true);
  const [loadingProviders, setLoadingProviders] = useState(true);
  const [isSubmitting,     setIsSubmitting]     = useState(false);
  const [requestData,      setRequestData]      = useState({
    date: '',
    time: '',
    governorate: '',
    city: '',
    street: '',
    exactLocation: '',
  });


const location = useLocation();

// زودي في الـ useEffect بتاع الـ services بعد ما بتجيبيهم
useEffect(() => {
  const load = async () => {
    setLoadingServices(true);
    const result = await getAllServices();
    setLoadingServices(false);
    if (result.success) {
      setServices(result.data);

      // لو في selectedService جاي من الـ home
      const stateServiceId = location.state?.selectedServiceId;
      if (stateServiceId) {
        const found = result.data.find((s: any) => s._id === stateServiceId);
        if (found) setSelectedService(found);
      }
    }
  };
  load();
}, []);
  // ============ LOAD SERVICES ============
  useEffect(() => {
    const load = async () => {
      setLoadingServices(true);
      const result = await getAllServices();
      setLoadingServices(false);
      if (result.success) {
        setServices(result.data);
      } else {
        toast.error(result.error || 'Failed to load services');
        setLoadingProviders(false);
      }
    };
    load();
  }, []);

  // ============ LOAD PROVIDERS ============
  useEffect(() => {
    if (services.length === 0) return;

    const load = async () => {
      setLoadingProviders(true);
      const token = localStorage.getItem('access_token');

      try {
        if (!selectedService) {
          const responses = await Promise.all(
            services.map((service) =>
              fetch(`/api/customer/providers/${service._id}`, {
                headers: { Authorization: `Bearer ${token}` },
              }).then((res) => res.json())
              
            )
          );
          const allProviders = responses.flat();
          console.log('API provider sample:', allProviders[0]);
          const unique = allProviders.filter(
  (p, index, self) =>
    index === self.findIndex((t) => (t._id || t.id) === (p._id || p.id))
);
console.log('unique providers:', unique.map(p => p.userName));
setProviders(unique);
          setProviders(unique);
        } else {
          const res = await fetch(`/api/customer/providers/${selectedService._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          setProviders(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to load providers');
      } finally {
        setLoadingProviders(false);
      }
    };

    load();
  }, [selectedService, services]);

  // ============ SUBMIT REQUEST ============
  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProvider) return;

    setIsSubmitting(true);
    const result = await createServiceRequest({
      providerId:    selectedProvider._id || selectedProvider.id,
      governorate:   requestData.governorate,
      city:          requestData.city,
      street:        requestData.street,
      exactLocation: requestData.exactLocation,
      serviceNeeded: selectedProvider.service?._id || selectedProvider.service?.id || '',
      dateNeeded:    requestData.date,
      startTime:     requestData.time,
    });
    setIsSubmitting(false);

    if (result.success) {
      toast.success('Service request submitted successfully!');
      setShowRequestModal(false);
      setRequestData({ date: '', time: '', governorate: '', city: '', street: '', exactLocation: '' });
    } else {
      toast.error(result.error || 'Failed to submit request');
    }
  };

  const filteredProviders = providers.filter((p) =>
    p.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <CustomerNavbar />

      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Find Service Providers</h1>
          <p className="text-muted-foreground">Browse verified professionals in your area</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <Card className="sticky top-20">
              <h2 className="font-semibold mb-4">Categories</h2>
              {loadingServices ? (
                <p className="text-sm text-muted-foreground animate-pulse">Loading...</p>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedService(null)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      !selectedService ? 'bg-primary text-white' : 'hover:bg-muted'
                    }`}
                  >
                    All Categories
                  </button>
                  {services.map((service) => (
                    <button
                      key={service._id}
                      onClick={() => setSelectedService(service)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedService?._id === service._id ? 'bg-primary text-white' : 'hover:bg-muted'
                      }`}
                    >
                      {service.name}
                    </button>
                  ))}
                </div>
              )}
            </Card>
          </aside>

          {/* Providers List */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-4 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search providers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12"
                />
              </div>
            </div>

            <div className="space-y-4">
              {loadingProviders ? (
                <><SkeletonCard /><SkeletonCard /><SkeletonCard /></>
              ) : filteredProviders.length === 0 ? (
                <EmptyState
                  icon={<Users className="w-10 h-10 text-muted-foreground" />}
                  title="No providers found"
                  description="Try adjusting your search or select a different category."
                  action={{ label: 'Clear Search', onClick: () => setSearchTerm('') }}
                />
              ) : (
                filteredProviders.map((provider) => (
                  <Card key={provider._id || provider.id} className="hover:shadow-lg transition-shadow">
                    <div className="flex flex-col md:flex-row gap-6">
                      <Link to={`/profile/provider/${provider._id || provider.id}`}
                      state={{ provider }} >
                        <img
                          src={provider.profileURL || 'https://i.pravatar.cc/150?img=12'}
                          alt={provider.userName}
                          className="w-32 h-32 rounded-xl object-cover cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = 'https://i.pravatar.cc/150?img=12';
                          }}
                        />
                      </Link>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <Link to={`/profile/provider/${provider._id || provider.id}`}
                            state={{ provider }} >
                              <h3 className="text-xl font-semibold mb-1 hover:text-primary transition-colors cursor-pointer">
                                {provider.userName || `${provider.firstName} ${provider.lastName}`}
                              </h3>
                            </Link>
                            <p className="text-sm text-muted-foreground">
                              {provider.service?.name || selectedService?.name || ''}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-full">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold text-yellow-900">{provider.averageRating}</span>
                            <span className="text-sm text-yellow-800">({provider.reviewsCount})</span>
                          </div>
                        </div>
                        <p className="text-muted-foreground mb-3">{provider.specialization}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                          <MapPin className="w-4 h-4" />
                          <span>{[provider.city, provider.state].filter(Boolean).join(', ')}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => {
                              setSelectedProvider(provider);
                              setShowRequestModal(true);
                            }}
                          >
                            Request Service
                          </Button>
                          <Link to={`/profile/provider/${provider._id || provider.id}`}
                          state={{ provider }} >
                            <Button variant="outline">View Profile</Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Request Modal */}
      <Modal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        title="Request Service"
        size="lg"
      >
        {selectedProvider && (
          <div className="mb-4">
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <img
                src={selectedProvider.profileURL || 'https://i.pravatar.cc/150?img=12'}
                alt={selectedProvider.userName}
                className="w-12 h-12 rounded-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = 'https://i.pravatar.cc/150?img=12';
                }}
              />
              <div>
                <p className="font-semibold">
                  {selectedProvider.userName || `${selectedProvider.firstName} ${selectedProvider.lastName}`}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedProvider.service?.name || selectedService?.name}
                </p>
              </div>
            </div>
          </div>
        )}
        <form onSubmit={handleSubmitRequest} className="space-y-4">
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
            <Input
              label="Governorate"
              placeholder="Enter governorate"
              value={requestData.governorate}
              onChange={(e) => setRequestData({ ...requestData, governorate: e.target.value })}
              required
            />
            <Input
              label="City"
              placeholder="Enter city"
              value={requestData.city}
              onChange={(e) => setRequestData({ ...requestData, city: e.target.value })}
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

      <Footer />
    </div>
  );
}