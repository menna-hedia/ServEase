import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, MapPin, Star, ChevronLeft, ChevronRight, Briefcase } from 'lucide-react';
import { toast } from 'sonner';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Textarea from '../../components/ui/Textarea';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';

const mockProvider = {
  name: 'Robert Johnson',
  photo: 'https://i.pravatar.cc/150?img=12',
  category: 'Electrician',
  rating: 4.9,
  reviewCount: 127,
  city: 'New York',
  state: 'NY',
  memberSince: '2023-03-10',
  completedServices: 94,
  specialization: 'Certified electrician with 10+ years of experience in residential and commercial projects. Expert in electrical repairs, installations, and safety inspections.',
};

const reviews = [
  {
    customerName: 'Sarah Johnson',
    customerPhoto: 'https://i.pravatar.cc/150?img=1',
    rating: 5,
    text: 'Excellent work! Robert was professional, punctual, and fixed the issue quickly.',
    date: '2026-05-10',
  },
  {
    customerName: 'Mike Chen',
    customerPhoto: 'https://i.pravatar.cc/150?img=12',
    rating: 5,
    text: 'Very knowledgeable and reliable. Would definitely hire again!',
    date: '2026-05-05',
  },
  {
    customerName: 'Emily Rodriguez',
    customerPhoto: 'https://i.pravatar.cc/150?img=5',
    rating: 4,
    text: 'Great service and fair pricing. Highly recommend.',
    date: '2026-04-28',
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

export default function ProviderPublicProfile() {
  const navigate = useNavigate();
  const [currentReview, setCurrentReview] = useState(0);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestData, setRequestData] = useState({
    description: '',
    date: '',
    time: '',
    city: '',
    governorate: '',
    street: '',
    exactLocation: '',
  });

  const nextReview = () => setCurrentReview((prev) => (prev + 1) % reviews.length);
  const prevReview = () => setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Service request sent successfully!');
    setShowRequestModal(false);
    setRequestData({ description: '', date: '', time: '', city: '', governorate: '', street: '', exactLocation: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                <div className="w-32 h-32 bg-gradient-to-br from-primary to-accent rounded-full p-1 flex-shrink-0">
                  <img
                    src={mockProvider.photo}
                    alt={mockProvider.name}
                    className="w-full h-full rounded-full object-cover border-4 border-white"
                  />
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">{mockProvider.name}</h1>
                  <div className="flex items-center gap-2 mb-3">
                    <Briefcase className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{mockProvider.category}</span>
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1.5 rounded-full">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-yellow-900">{mockProvider.rating}</span>
                      <span className="text-sm text-yellow-800">({mockProvider.reviewCount})</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {mockProvider.city}, {mockProvider.state}
                      </span>
                    </div>
                  </div>
                  <Button onClick={() => setShowRequestModal(true)} size="lg" className="w-full md:w-auto">
                    Request Service
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-y border-border">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary mb-1">
                    {mockProvider.completedServices}
                  </p>
                  <p className="text-sm text-muted-foreground">Completed Services</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary mb-1">
                    {new Date().getFullYear() - new Date(mockProvider.memberSince).getFullYear()}+ yrs
                  </p>
                  <p className="text-sm text-muted-foreground">On Platform</p>
                </div>
              </div>

              <div className="mt-6">
                <h2 className="text-xl font-bold mb-3">About</h2>
                <p className="text-muted-foreground">{mockProvider.specialization}</p>
              </div>
            </Card>

            <Card>
              <h2 className="text-xl font-bold mb-6">Customer Reviews</h2>
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-xl">
                  <div className="flex items-start gap-3 mb-3">
                    <img
                      src={reviews[currentReview].customerPhoto}
                      alt={reviews[currentReview].customerName}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1">
                      <p className="font-semibold">{reviews[currentReview].customerName}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-0.5">
                          {[...Array(reviews[currentReview].rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(reviews[currentReview].date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground italic">"{reviews[currentReview].text}"</p>
                </div>

                <div className="flex justify-center gap-4">
                  <button
                    onClick={prevReview}
                    className="p-2 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextReview}
                    className="p-2 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-primary to-accent text-white sticky top-6">
              <h3 className="text-xl font-bold mb-4">Ready to Book?</h3>
              <p className="text-white/90 mb-4">
                Get professional {mockProvider.category.toLowerCase()} service from {mockProvider.name}
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

      <Modal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        title={`Request Service from ${mockProvider.name}`}
        size="lg"
      >
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
          <Button type="submit" className="w-full">
            Submit Request
          </Button>
        </form>
      </Modal>
    </div>
  );
}
