import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, ChevronLeft, ChevronRight, Send, Mail, Phone, Clock, CheckCircle } from 'lucide-react';
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
import { useNavigate } from 'react-router-dom';
import CreateBroadcastModal from '../Broadcast/CreateBroadcastModal';

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
  const [contactSubmitted, setContactSubmitted] = useState(false);
const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const navigate = useNavigate();
  const [showBroadcast, setShowBroadcast] = useState(false);
  const DEFAULT_AVATAR = 'https://i.pinimg.com/736x/07/fb/34/07fb3452c4640d881a16d08c2e314f3e.jpg';
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

              <div className="flex flex-wrap gap-4">
                <Link to="/customer/services">
                  <Button size="lg" variant="secondary" className="shadow-xl">
                    Browse Services →
                  </Button>
                </Link>

                <Button
                  size="lg"
                  variant="outline"
                  className="shadow-xl border-white text-white hover:bg-white hover:text-primary transition-colors"
                  onClick={() => setShowBroadcast(true)}
                >
                  Broadcast Request
                </Button>
              </div>
            </div>
          </div>
        </section>

        <CreateBroadcastModal
          isOpen={showBroadcast}
          onClose={() => setShowBroadcast(false)}
          onSuccess={(requestId) => navigate(`/customer/broadcast/${requestId}/offers`)}
        />
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
                    {/* <p className="text-muted-foreground text-sm mt-1">Priority support available for Pro accounts</p> */}
                  </div>
                </div>
              </div>
            </div>

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
