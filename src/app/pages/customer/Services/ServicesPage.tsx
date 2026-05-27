import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Search, Star, MapPin, Users } from 'lucide-react';
import { toast } from 'sonner';
import CustomerNavbar from '../../../components/layout/CustomerNavbar';
import Footer from '../../../components/layout/Footer';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Modal from '../../../components/ui/Modal';
import Textarea from '../../../components/ui/Textarea';
import EmptyState from '../../../components/ui/EmptyState';
import { SkeletonCard } from '../../../components/ui/Skeleton';
import { createServiceRequest } from './ServicesActions';

const categories = [
  'All Categories',
  'Electrician',
  'Plumber',
  'Carpenter',
  'Painter',
  'Cleaning',
  'AC Technician',
  'Mechanic',
  'Internet Technician',
];

const sortOptions = [
  { value: 'ratings', label: 'Ratings' },
  { value: 'nearest', label: 'Nearest' },
];

const providers = [
  {
    id: 1,
    name: 'Robert Johnson',
    category: 'Electrician',
    rating: 4.9,
    reviewCount: 127,
    description: 'Certified electrician with 10+ years of experience in residential and commercial projects.',
    photo: 'https://i.pravatar.cc/150?img=12',
    location: 'New York, NY',
  },
  {
    id: 2,
    name: 'Maria Garcia',
    category: 'Plumber',
    rating: 4.8,
    reviewCount: 93,
    description: 'Expert plumber specializing in emergency repairs and new installations.',
    photo: 'https://i.pravatar.cc/150?img=5',
    location: 'New York, NY',
  },
  {
    id: 3,
    name: 'James Wilson',
    category: 'Carpenter',
    rating: 5.0,
    reviewCount: 156,
    description: 'Master carpenter providing custom furniture and home renovation services.',
    photo: 'https://i.pravatar.cc/150?img=15',
    location: 'New York, NY',
  },
  {
    id: 4,
    name: 'Sarah Anderson',
    category: 'Painter',
    rating: 4.7,
    reviewCount: 84,
    description: 'Professional painter with expertise in interior and exterior painting.',
    photo: 'https://i.pravatar.cc/150?img=9',
    location: 'New York, NY',
  },
  {
    id: 5,
    name: 'David Lee',
    category: 'Cleaning',
    rating: 4.9,
    reviewCount: 112,
    description: 'Professional cleaning service with eco-friendly products and thorough attention to detail.',
    photo: 'https://i.pravatar.cc/150?img=13',
    location: 'New York, NY',
  },
  {
    id: 6,
    name: 'Emma Thompson',
    category: 'AC Technician',
    rating: 4.8,
    reviewCount: 76,
    description: 'HVAC specialist with expertise in air conditioning installation, repair, and maintenance.',
    photo: 'https://i.pravatar.cc/150?img=10',
    location: 'New York, NY',
  },
];

const cities = [
  { value: '', label: 'Select City' },
  { value: 'cairo', label: 'Cairo' },
  { value: 'alexandria', label: 'Alexandria' },
  { value: 'giza', label: 'Giza' },
];

const governorates = [
  { value: '', label: 'Select Governorate' },
  { value: 'cairo', label: 'Cairo' },
  { value: 'alexandria', label: 'Alexandria' },
  { value: 'giza', label: 'Giza' },
];

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('ratings');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<typeof providers[0] | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestData, setRequestData] = useState({
    description: '',
    date: '',
    time: '',
    city: '',
    governorate: '',
    street: '',
    exactLocation: '',
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleRequestService = (provider: typeof providers[0]) => {
    setSelectedProvider(provider);
    setShowRequestModal(true);
  };

 const handleSubmitRequest = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!selectedProvider) return;

  setIsSubmitting(true);

  const result = await createServiceRequest({
    providerId: String(selectedProvider.id),
    governorate: requestData.governorate,
    city: requestData.city,
    street: requestData.street,
    exactLocation: requestData.exactLocation,
    serviceNeeded: selectedProvider.category,
    dateNeeded: requestData.date,
    startTime: requestData.time,
  });

  setIsSubmitting(false);

  if (result.success) {
    toast.success('Service request submitted successfully!');
    setShowRequestModal(false);
    setRequestData({
      description: '',
      date: '',
      time: '',
      city: '',
      governorate: '',
      street: '',
      exactLocation: '',
    });
  } else {
    toast.error(result.error || 'Failed to submit request');
  }
};

  const getCurrentLocation = () => {
    toast.success('Location detected successfully');
    setRequestData({ ...requestData, city: 'cairo', governorate: 'cairo' });
  };

  const filteredProviders = providers.filter((provider) => {
    const matchesCategory = selectedCategory === 'All Categories' || provider.category === selectedCategory;
    const matchesSearch = provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <CustomerNavbar />

      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Find Service Providers</h1>
          <p className="text-muted-foreground">
            Browse verified professionals in your area
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          <aside className="lg:col-span-1">
            <Card className="sticky top-20">
              <h2 className="font-semibold mb-4">Categories</h2>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === category
                        ? 'bg-primary text-white'
                        : 'hover:bg-muted'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </Card>
          </aside>

          <div className="lg:col-span-3">
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-4 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search providers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12"
                />
              </div>
              <Select
                options={sortOptions}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              {loading ? (
                <>
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                </>
              ) : filteredProviders.length === 0 ? (
                <EmptyState
                  icon={<Users className="w-10 h-10 text-muted-foreground" />}
                  title="No providers found"
                  description="Try adjusting your search or category filter to find service providers."
                  action={{
                    label: 'Clear Filters',
                    onClick: () => {
                      setSelectedCategory('All Categories');
                      setSearchTerm('');
                    },
                  }}
                />
              ) : (
                filteredProviders.map((provider) => (
                <Card key={provider.id} className="hover:shadow-lg transition-shadow">
                  <div className="flex flex-col md:flex-row gap-6">
                    <Link to={`/profile/provider/${provider.id}`}>
                      <img
                        src={provider.photo}
                        alt={provider.name}
                        className="w-32 h-32 rounded-xl object-cover cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                      />
                    </Link>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <Link to={`/profile/provider/${provider.id}`}>
                            <h3 className="text-xl font-semibold mb-1 hover:text-primary transition-colors cursor-pointer">
                              {provider.name}
                            </h3>
                          </Link>
                          <p className="text-sm text-muted-foreground">{provider.category}</p>
                        </div>
                        <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-full">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold text-yellow-900">
                            {provider.rating}
                          </span>
                          <span className="text-sm text-yellow-800">
                            ({provider.reviewCount})
                          </span>
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-3">{provider.description}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <MapPin className="w-4 h-4" />
                        <span>{provider.location}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => handleRequestService(provider)}>
                          Request Service
                        </Button>
                        <Link to={`/profile/provider/${provider.id}`}>
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
                src={selectedProvider.photo}
                alt={selectedProvider.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="font-semibold">{selectedProvider.name}</p>
                <p className="text-sm text-muted-foreground">{selectedProvider.category}</p>
              </div>
            </div>
          </div>
        )}
        <form onSubmit={handleSubmitRequest} className="space-y-4">
          <Textarea
            label="Description"
            placeholder="Describe the service you need..."
            value={requestData.description}
            onChange={(e) => setRequestData({ ...requestData, description: e.target.value })}
            required
          />
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
              options={governorates}
              value={requestData.governorate}
              onChange={(e) => setRequestData({ ...requestData, governorate: e.target.value })}
              required
            />
            <Select
              label="City"
              options={cities}
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
