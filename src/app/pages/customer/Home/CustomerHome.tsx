import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import CustomerNavbar from '../../../components/layout/CustomerNavbar';
import Footer from '../../../components/layout/Footer';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Select from '../../../components/ui/Select';
import Modal from '../../../components/ui/Modal';
import Textarea from '../../../components/ui/Textarea';
import { SkeletonCard } from '../../../components/ui/Skeleton';
import { toast } from 'sonner';
import { getGlobalReviews, submitGlobalReview } from './ReviewActions';
import { getAllServices } from '../../shared/Services/ServicesActions';

const DEFAULT_AVATAR = 'https://i.pinimg.com/736x/07/fb/34/07fb3452c4640d881a16d08c2e314f3e.jpg';

const categoryIcons: Record<string, { icon: string; color: string }> = {
  'Plumbing': { icon: '🔧', color: 'bg-blue-100' },
  'Electrical': { icon: '⚡', color: 'bg-yellow-100' },
  'Carpentry': { icon: '🪚', color: 'bg-amber-100' },
  'Cleaning': { icon: '🧹', color: 'bg-green-100' },
  'Painting': { icon: '🎨', color: 'bg-purple-100' },
  'AC Technician': { icon: '❄️', color: 'bg-cyan-100' },
  'Internet Technician': { icon: '📡', color: 'bg-indigo-100' },
  'Appliance Repair': { icon: '🔩', color: 'bg-red-100' },
  'Handyman': { icon: '🛠️', color: 'bg-orange-100' },
  'CCTV Installation': { icon: '📷', color: 'bg-gray-100' },
  'Furniture Moving': { icon: '🚚', color: 'bg-pink-100' },
  'Gardening': { icon: '🌱', color: 'bg-lime-100' },
  'Pest Control': { icon: '🐛', color: 'bg-rose-100' },
  'Water Heater Technician': { icon: '♨️', color: 'bg-red-100' },
  'Satellite Technician': { icon: '📡', color: 'bg-sky-100' },
  'Locksmith': { icon: '🔑', color: 'bg-slate-100' },
};

export default function CustomerHome() {
  const [currentReview, setCurrentReview] = useState(0);
  const [showAddReview, setShowAddReview] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [reviews, setReviews] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ============ LOAD DATA ============
  useEffect(() => {
    const load = async () => {
      setLoadingReviews(true);
      const [reviewsResult, servicesResult] = await Promise.all([
        getGlobalReviews(),
        getAllServices(),
      ]);
      setLoadingReviews(false);

      if (reviewsResult.success) setReviews(reviewsResult.data ?? []);
      if (servicesResult.success) setServices(servicesResult.data);
    };
    load();
  }, []);

  // ============ REVIEW NAV ============
  const nextReview = () => setCurrentReview((p) => (p + 1) % reviews.length);
  const prevReview = () => setCurrentReview((p) => (p - 1 + reviews.length) % reviews.length);

  // ============ SUBMIT REVIEW ============
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) { toast.error('Please write a review'); return; }

    setIsSubmitting(true);
    const result = await submitGlobalReview(reviewRating, reviewText.trim());
    setIsSubmitting(false);

    if (result.success) {
      toast.success('Review submitted successfully!');
      setShowAddReview(false);
      setReviewText('');
      setReviewRating(5);

      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

      const newReview = {
        ...result.data,
        userId: {
          _id: storedUser._id || storedUser.id || result.data.userId,
          userName: storedUser.userName || '',
          firstName: storedUser.firstName || '',
          lastName: storedUser.lastName || '',
          profileURL: storedUser.profileURL || '',
        },
      };

      setReviews((prev) => [newReview, ...prev]);
      setCurrentReview(0);
    } else {
      toast.error(result.error || 'Failed to submit review');
    }
  };

  // ============ HELPERS ============
  const getReviewUser = (review: any) => {
    const user = typeof review?.userId === 'object' ? review.userId : null;
    return {
      name: user?.userName ||
        (user?.firstName && user?.lastName
          ? `${user.firstName} ${user.lastName}`
          : 'Anonymous'),
      photo: user?.profileURL || DEFAULT_AVATAR,
    };
  };

  const serviceOptions = [
    { value: '', label: 'All Services' },
    ...services.map((s) => ({ value: s._id, label: s.name })),
  ];

  const displayedCategories = services.slice(0, 8);

  return (
    <div className="min-h-screen bg-background">
      <CustomerNavbar />

      <div className="container mx-auto px-4 lg:px-8 py-8">

        {/* ── Hero ── */}
        <section className="mb-12">
          <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-accent rounded-3xl p-8 lg:p-16">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/20 rounded-full blur-2xl" />
            <div className="relative z-10 max-w-3xl">
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-white leading-tight">
                Find Your Perfect
                <br />
                <span className="text-white/90">Home Service</span>
              </h1>
              <p className="text-xl lg:text-2xl text-white/90 mb-8 max-w-2xl">
                Connect with verified professionals for all your home service needs.
              </p>
              <Link to="/customer/services">
                <Button size="lg" variant="secondary" className="shadow-xl">
                  Browse Services →
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Categories ── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Popular Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {displayedCategories.map((service) => {
              const meta = categoryIcons[service.name] || { icon: '🔨', color: 'bg-gray-100' };
              return (
                <Link
                  key={service._id}
                  to="/customer/services"
                  state={{ selectedServiceId: service._id, selectedServiceName: service.name }}
                >
                  <Card className="hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer text-center">
                    <div className={`w-16 h-16 ${meta.color} rounded-2xl flex items-center justify-center mx-auto mb-3 text-3xl`}>
                      {meta.icon}
                    </div>
                    <h3 className="font-semibold text-sm">{service.name}</h3>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ── Find a Service ── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Find a Service</h2>
          <Card className="p-6">
            <Select
              options={serviceOptions}
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
            />
            <Link to="/customer/services" state={{ selectedServiceId: selectedService, selectedServiceName: services.find(s => s._id === selectedService)?.name }}>
              <Button className="w-full mt-4">Search</Button>
            </Link>
          </Card>
        </section>

        {/* ── Reviews ── */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Customer Reviews</h2>
            <Button onClick={() => setShowAddReview(true)} variant="outline">
              Add Review
            </Button>
          </div>

          {loadingReviews ? (
            <div className="max-w-3xl mx-auto"><SkeletonCard /></div>
          ) : reviews.length === 0 ? (
            <div className="max-w-3xl mx-auto">
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
              </Card>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto">
              <Card className="p-8">
                {(() => {
                  const rev = reviews[currentReview];
                  const { name, photo } = getReviewUser(rev);
                  return (
                    <div className="flex flex-col items-center text-center space-y-4">
                      <img
                        src={photo}
                        alt={name}
                        className="w-20 h-20 rounded-full border-4 border-primary object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = DEFAULT_AVATAR;
                        }}
                      />
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{name}</h3>
                        <div className="flex justify-center gap-1 mb-3">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${i < (rev?.rate || 0)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                                }`}
                            />
                          ))}
                        </div>
                        <p className="text-muted-foreground italic">"{rev?.content}"</p>
                        {rev?.createdAt && (
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(rev.createdAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </Card>

              {reviews.length > 1 && (
                <div className="flex justify-center items-center gap-4 mt-6">
                  <button
                    onClick={prevReview}
                    className="p-3 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <span className="text-sm text-muted-foreground">
                    {currentReview + 1} / {reviews.length}
                  </span>
                  <button
                    onClick={nextReview}
                    className="p-3 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              )}
            </div>
          )}
        </section>

      </div>

      {/* Add Review Modal */}
      <Modal
        isOpen={showAddReview}
        onClose={() => setShowAddReview(false)}
        title="Add Your Review"
      >
        <form onSubmit={handleSubmitReview} className="space-y-4">
          <div>
            <label className="block mb-2 font-medium text-sm">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReviewRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-8 h-8 ${star <= reviewRating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                      }`}
                  />
                </button>
              ))}
            </div>
          </div>
          <Textarea
            label="Your Review"
            placeholder="Share your experience with ServEase..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            required
          />
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </form>
      </Modal>

      <Footer />
    </div>
  );
}