import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import logo from "../components/images/logoWhite.png"
import {
  Menu,
  X,
  CheckCircle,
  Shield,
  MapPin,
  Star,
  MessageSquare,
  Clock,
  Zap,
  Users,
  Award,
  ChevronLeft,
  ChevronRight,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  Send,
  Trash2,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import Textarea from '../components/ui/Textarea';
import { SkeletonCard } from '../components/ui/Skeleton';
import { getGeneralCounts } from './shared/Services/generalCounts';
import landingImage from '../components/images/landing.jpg';
import { getGlobalReviews, submitGlobalReview, deleteGlobalReview } from './shared/Services/ReviewActions';
import Footer from '../components/layout/Footer';

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

const features = [
  {
    icon: Zap,
    title: 'Easy Service Booking',
    description: 'Book trusted home services in just a few clicks',
  },
  {
    icon: Shield,
    title: 'Verified Providers',
    description: 'All service providers are thoroughly vetted and verified',
  },
  {
    icon: Clock,
    title: 'Real-time Tracking',
    description: 'Track your service request status in real-time',
  },
  {
    icon: MessageSquare,
    title: 'Secure Communication',
    description: 'Communicate safely with providers through our platform',
  },
  {
    icon: Star,
    title: 'Ratings & Reviews',
    description: 'Read honest reviews from real customers',
  },
  {
    icon: MapPin,
    title: 'Location-based Services',
    description: 'Find the best providers in your area',
  },
];

function getUserIdFromToken(): string {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) return '';
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.id || payload._id || payload.userId || payload.sub || '';
  } catch {
    return '';
  }
}

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [currentReview, setCurrentReview] = useState(0);
  const [showAddReview, setShowAddReview] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null);
  const REVIEW_DEFAULT_AVATAR = 'https://i.pinimg.com/736x/07/fb/34/07fb3452c4640d881a16d08c2e314f3e.jpg';

  const [counts, setCounts] = useState({
    providerCount: 0,
    requesterCount: 0,
    userSatisfaction: 0,
  });
  const [loadingCounts, setLoadingCounts] = useState(true);

  // ============ LOAD CURRENT USER ID ============
  useEffect(() => {
    setCurrentUserId(getUserIdFromToken());
  }, []);

  // ============ LOAD REVIEWS ============
  useEffect(() => {
    const loadReviews = async () => {
      setLoadingReviews(true);
      const result = await getGlobalReviews();
      setLoadingReviews(false);

      if (result.success) setReviews(result.data ?? []);
    };
    loadReviews();
  }, []);

  // ============ LOAD COUNTS ============
  useEffect(() => {
    const loadCounts = async () => {
      setLoadingCounts(true);
      const result = await getGeneralCounts();
      setLoadingCounts(false);

      if (result.success) {
        setCounts({
          providerCount: result.data.providerCount ?? 0,
          requesterCount: result.data.requesterCount ?? 0,
          userSatisfaction: result.data.userSatisfaction ?? 0,
        });
      }
    };
    loadCounts();
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

      const newReview = {
        ...result.data,
        userId: {
          _id: getUserIdFromToken() || result.data.userId,
          userName: '',
          firstName: '',
          lastName: '',
          profileURL: '',
        },
      };

      setReviews((prev) => [newReview, ...prev]);
      setCurrentReview(0);
    } else {
      toast.error(result.error || 'Failed to submit review');
    }
  };

  // ============ DELETE REVIEW ============
  const handleDeleteReview = async (reviewId: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this review?');
    if (!confirmed) return;

    setDeletingReviewId(reviewId);
    const result = await deleteGlobalReview(reviewId);
    setDeletingReviewId(null);

    if (result.success) {
      toast.success(result.message || 'Review deleted successfully');
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
      setCurrentReview((prev) => (prev > 0 ? prev - 1 : 0));
    } else {
      const isForbidden = result.error?.toLowerCase().includes('forbidden');
      toast.error(
        isForbidden
          ? "Delete isn't working right now due to a server issue."
          : result.error || 'Failed to delete review'
      );
    }
  };

  // ============ REVIEW HELPERS ============
  const getReviewUser = (review: any) => {
    const user = typeof review?.userId === 'object' ? review.userId : null;
    return {
      name: user?.userName ||
        (user?.firstName && user?.lastName
          ? `${user.firstName} ${user.lastName}`
          : 'Anonymous'),
      photo: user?.profileURL || REVIEW_DEFAULT_AVATAR,
    };
  };

  const handleContactChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setContactForm({ ...contactForm, [e.target.name]: e.target.value });
  };

  const handleContactSubmit = (e: React.FormEvent<HTMLDivElement>) => {
    e.preventDefault();
    setContactSubmitted(true);
    setContactForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-background">

      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center overflow-hidden">
                <img
                  src={logo}
                  alt="ServEase"
                  className="w-8 h-8 object-contain"
                />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                ServEase
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <a href="#home" className="text-foreground hover:text-primary transition-colors">Home</a>
              <a href="#features" className="text-foreground hover:text-primary transition-colors">Features</a>
              <a href="#reviews" className="text-foreground hover:text-primary transition-colors">Reviews</a>
              <a href="#contact" className="text-foreground hover:text-primary transition-colors">Contact</a>
              <a href="#about" className="text-foreground hover:text-primary transition-colors">About</a>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <Link to="/signin"><Button variant="outline">Sign In</Button></Link>
              <Link to="/signup/customer"><Button>Sign Up</Button></Link>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-muted"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-white">
            <div className="container mx-auto px-4 py-4 space-y-3">
              <a href="#home" className="block py-2 text-foreground hover:text-primary">Home</a>
              <a href="#features" className="block py-2 text-foreground hover:text-primary">Features</a>
              <a href="#reviews" className="block py-2 text-foreground hover:text-primary">Reviews</a>
              <a href="#contact" className="block py-2 text-foreground hover:text-primary">Contact</a>
              <a href="#about" className="block py-2 text-foreground hover:text-primary">About</a>
              <div className="pt-3 space-y-2">
                <Link to="/signin" className="block">
                  <Button variant="outline" className="w-full">Sign In</Button>
                </Link>
                <Link to="/signup/customer" className="block">
                  <Button className="w-full">Sign Up</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent" />
        <div className="container mx-auto px-4 lg:px-8 py-20 lg:py-32 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Your Trusted Home & Office Services{' '}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Marketplace
                </span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Connect with verified professionals for all your home and office needs. Fast, reliable, and affordable.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup/customer">
                  <Button size="lg" className="w-full sm:w-auto group">
                    Find Service
                    <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </Button>
                </Link>
                <Link to="/signup/provider">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    I'm a Provider
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src={landingImage}
                alt="Home and office services illustration"
                className="w-full h-96 object-cover rounded-3xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">Why Choose ServEase</h2>
            <p className="text-xl text-muted-foreground">Everything you need for hassle-free home services</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Card key={feature.title} className="hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="py-20 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">Popular Services</h2>
            <p className="text-xl text-muted-foreground">Browse by category</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
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
        </div>
      </section>

      {/* ── Platform Reviews ── */}
      <section id="reviews" className="py-20 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Platform Reviews</h2>

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
              <Card className="p-8 relative">
                {(() => {
                  const rev = reviews[currentReview];
                  const { name, photo } = getReviewUser(rev);
                  const reviewOwnerId = typeof rev?.userId === 'object' ? rev.userId._id : rev?.userId;
                  const isOwnReview = currentUserId && reviewOwnerId === currentUserId;

                  return (
                    <div className="flex flex-col items-center text-center space-y-4">
                      {isOwnReview && (
                        <button
                          onClick={() => handleDeleteReview(rev._id)}
                          disabled={deletingReviewId === rev._id}
                          className="absolute top-4 right-4 p-2 rounded-full text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                          title="Delete review"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      <img
                        src={photo}
                        alt={name}
                        className="w-20 h-20 rounded-full border-4 border-primary object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = REVIEW_DEFAULT_AVATAR;
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
        </div>
      </section>

      {/* Statistics Section */}
      <section>
        <div className="bg-gradient-to-br from-primary to-accent text-white p-8 lg:p-12">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">
                {loadingCounts ? '—' : `${counts.providerCount.toLocaleString()}+`}
              </div>
              <p className="text-xl text-white/90">Registered Providers</p>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">
                {loadingCounts ? '—' : `${counts.requesterCount.toLocaleString()}+`}
              </div>
              <p className="text-xl text-white/90">Compeleted Services</p>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">
                {loadingCounts ? '—' : `${(counts.userSatisfaction * 20).toFixed(0)}%`}
              </div>
              <p className="text-xl text-white/90">User Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section id="contact" className="py-10 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">Contact Us</h2>
            <p className="text-xl text-muted-foreground">
              We'd love to hear from you. Our team typically responds within 24 hours.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold mb-6">Get in Touch</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Whether you have a question about our platform, need help with your account, or want to
                  partner with us — our dedicated support team is here to assist you every step of the way.
                </p>
              </div>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Email Support</p>
                    <a
                      href="mailto:noreply@contact.servease.me"
                      className="text-primary hover:underline text-sm"
                    >
                      ServEase &lt;noreply@contact.servease.me&gt;
                    </a>
                    <p className="text-muted-foreground text-sm mt-1">
                      Replies are sent from this address — please add it to your contacts.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Phone Support</p>
                    <p className="text-muted-foreground text-sm">+1 (555) 123-4567</p>
                    <p className="text-muted-foreground text-sm mt-1">Mon – Fri, 9 AM – 6 PM (EST)</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Response Time</p>
                    <p className="text-muted-foreground text-sm">We aim to respond within 24 hours</p>
                  </div>
                </div>
              </div>
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
            {/* Contact Form */}
            <div>
              {contactSubmitted ? (
                <Card className="flex flex-col items-center justify-center text-center py-16 space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-semibold">Message Sent!</h3>
                  <p className="text-muted-foreground max-w-sm">
                    Thank you for reaching out. We've received your message and will reply from{' '}
                    <span className="text-primary font-medium">noreply@contact.servease.me</span> within
                    24 hours.
                  </p>
                  <Button variant="outline" onClick={() => setContactSubmitted(false)}>
                    Send Another Message
                  </Button>
                </Card>
              ) : (
                <Card className="space-y-5">
                  <h3 className="text-xl font-semibold mb-2">Send Us a Message</h3>

                  <div
                    role="form"
                    onSubmit={handleContactSubmit}
                    className="space-y-5"
                  >
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-foreground">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          value={contactForm.name}
                          onChange={handleContactChange}
                          placeholder="Ahmed Mohamed"
                          className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-foreground">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          value={contactForm.email}
                          onChange={handleContactChange}
                          placeholder="ahmed@example.com"
                          className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-foreground">Subject</label>
                      <input
                        type="text"
                        name="subject"
                        value={contactForm.subject}
                        onChange={handleContactChange}
                        placeholder="How can we help you?"
                        className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-foreground">Message</label>
                      <textarea
                        name="message"
                        value={contactForm.message}
                        onChange={handleContactChange}
                        placeholder="Tell us more about your inquiry..."
                        rows={5}
                        className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition resize-none"
                      />
                    </div>

                    <p className="text-xs text-muted-foreground">
                      Our reply will be sent from{' '}
                      <span className="font-medium text-primary">noreply@contact.servease.me</span>.
                      Please check your spam folder if you don't receive a response within 24 hours.
                    </p>

                    <Button
                      onClick={handleContactSubmit}
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Send Message
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>


  );

}