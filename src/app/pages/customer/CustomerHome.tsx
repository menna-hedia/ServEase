import { useState } from 'react';
import { Link } from 'react-router';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import CustomerNavbar from '../../components/layout/CustomerNavbar';
import Footer from '../../components/layout/Footer';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Modal from '../../components/ui/Modal';
import Textarea from '../../components/ui/Textarea';
import { toast } from 'sonner';

const categories = [
  { name: 'Electrician', icon: '⚡', color: 'bg-yellow-100' },
  { name: 'Plumber', icon: '🔧', color: 'bg-blue-100' },
  { name: 'Carpenter', icon: '🪚', color: 'bg-amber-100' },
  { name: 'Painter', icon: '🎨', color: 'bg-purple-100' },
  { name: 'Cleaning', icon: '🧹', color: 'bg-green-100' },
  { name: 'AC Technician', icon: '❄️', color: 'bg-cyan-100' },
  { name: 'Mechanic', icon: '🔩', color: 'bg-red-100' },
  { name: 'Internet Tech', icon: '📡', color: 'bg-indigo-100' },
];

const reviews = [
  {
    name: 'John Smith',
    rating: 5,
    text: 'Excellent electrician service! Very professional and quick.',
    photo: 'https://i.pravatar.cc/150?img=11',
  },
  {
    name: 'Emma Wilson',
    rating: 5,
    text: 'Best plumbing service I\'ve ever used. Highly recommend!',
    photo: 'https://i.pravatar.cc/150?img=9',
  },
  {
    name: 'Michael Brown',
    rating: 5,
    text: 'Great platform! Found a reliable carpenter in minutes.',
    photo: 'https://i.pravatar.cc/150?img=13',
  },
];

const serviceOptions = [
  { value: '', label: 'All Services' },
  { value: 'electrician', label: 'Electrician' },
  { value: 'plumber', label: 'Plumber' },
  { value: 'carpenter', label: 'Carpenter' },
];

export default function CustomerHome() {
  const [currentReview, setCurrentReview] = useState(0);
  const [showAddReview, setShowAddReview] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [selectedService, setSelectedService] = useState('');

  const nextReview = () => setCurrentReview((prev) => (prev + 1) % reviews.length);
  const prevReview = () => setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Review submitted successfully!');
    setShowAddReview(false);
    setReviewText('');
    setReviewRating(5);
  };

  return (
    <div className="min-h-screen bg-background">
      <CustomerNavbar />

      <div className="container mx-auto px-4 lg:px-8 py-8">
        <section className="mb-12">
          <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-accent rounded-3xl p-8 lg:p-16">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/20 rounded-full blur-2xl"></div>
            <div className="relative z-10 max-w-3xl">
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-white leading-tight">
                Find Your Perfect
                <br />
                <span className="text-white/90">Home Service</span>
              </h1>
              <p className="text-xl lg:text-2xl text-white/90 mb-8 max-w-2xl">
                Connect with verified professionals for all your home service needs.
                Quality service, trusted providers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/customer/services">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto shadow-xl">
                    Browse Services
                    <span className="ml-2">→</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Popular Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Card
                key={category.name}
                className="hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer text-center"
              >
                <div className={`w-16 h-16 ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-3 text-3xl`}>
                  {category.icon}
                </div>
                <h3 className="font-semibold">{category.name}</h3>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Find a Service</h2>
          <Card className="p-6">
            <Select
              options={serviceOptions}
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
            />
            <Link to="/customer/services">
              <Button className="w-full mt-4">Search</Button>
            </Link>
          </Card>
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Customer Reviews</h2>
            <Button onClick={() => setShowAddReview(true)} variant="outline">
              Add Review
            </Button>
          </div>
          <div className="max-w-3xl mx-auto">
            <Card className="p-8">
              <div className="flex flex-col items-center text-center space-y-4">
                <img
                  src={reviews[currentReview].photo}
                  alt={reviews[currentReview].name}
                  className="w-20 h-20 rounded-full border-4 border-primary"
                />
                <div>
                  <h3 className="text-xl font-semibold mb-2">{reviews[currentReview].name}</h3>
                  <div className="flex justify-center gap-1 mb-3">
                    {[...Array(reviews[currentReview].rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground italic">"{reviews[currentReview].text}"</p>
                </div>
              </div>
            </Card>
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={prevReview}
                className="p-3 rounded-full bg-primary text-white hover:bg-primary/90"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextReview}
                className="p-3 rounded-full bg-primary text-white hover:bg-primary/90"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </section>
      </div>

      <Modal
        isOpen={showAddReview}
        onClose={() => setShowAddReview(false)}
        title="Add Your Review"
      >
        <form onSubmit={handleSubmitReview} className="space-y-4">
          <div>
            <label className="block mb-2 font-medium">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReviewRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= reviewRating
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
            placeholder="Share your experience..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            required
          />
          <Button type="submit" className="w-full">
            Submit Review
          </Button>
        </form>
      </Modal>
      <Footer />
    </div>
  );
}
