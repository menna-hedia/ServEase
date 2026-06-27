import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, ChevronRight, Send, Mail, Phone, Clock, CheckCircle, Star, ChevronLeft, Trash2 } from 'lucide-react';
import ProviderNavbar from '../../../components/layout/ProviderNavbar';
import Footer from '../../../components/layout/Footer';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Modal from '../../../components/ui/Modal';
import Textarea from '../../../components/ui/Textarea';
import { SkeletonCard } from '../../../components/ui/Skeleton';
import { toast } from 'sonner';
import { getProviderRequests } from '../Requests/ProviderRequestsActions';
import { getProviderProfile } from '../Profile/ProviderProfileActions';
import { getGlobalReviews, submitGlobalReview, deleteGlobalReview } from '../../shared/Services/ReviewActions';

const DEFAULT_AVATAR = 'https://i.pravatar.cc/150?img=1';

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

export default function ProviderHome() {
  const [providerName,  setProviderName]  = useState('');
  const [requests,      setRequests]      = useState<any[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  // ============ REVIEWS STATE ============
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

  useEffect(() => {
    setCurrentUserId(getUserIdFromToken());
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const [profileResult, requestsResult] = await Promise.all([
        getProviderProfile(),
        getProviderRequests(),
      ]);

      if (profileResult.success) {
        const p = profileResult.data;
        setProviderName(
          p.userName ||
          (p.firstName && p.lastName ? `${p.firstName} ${p.lastName}` : '') ||
          'Provider'
        );
      }

      if (requestsResult.success) {
        setRequests(Array.isArray(requestsResult.data) ? requestsResult.data : []);
      }

      setLoading(false);
    };

    load();
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

  // ============ STATS ============
  const total     = requests.length;
  const waiting   = requests.filter((r) => r.status?.toUpperCase() === 'WAITING').length;
  const completed = requests.filter((r) => r.status?.toUpperCase() === 'COMPLETED').length;

  const stats = [
    { label: 'Total Requests', value: total,     icon: Briefcase,   color: 'bg-blue-100 text-blue-600'   },
    { label: 'Unanswered',     value: waiting,   icon: Clock,       color: 'bg-orange-100 text-orange-600' },
    { label: 'Completed',      value: completed, icon: CheckCircle, color: 'bg-green-100 text-green-600'  },
  ];

  const latestWaiting = requests
    .filter((r) => r.status?.toUpperCase() === 'WAITING')
    .slice(0, 3);

  const getName = (customer: any) =>
    customer?.userName ||
    (customer?.firstName && customer?.lastName
      ? `${customer.firstName} ${customer.lastName}`
      : null) ||
    '—';

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

  return (
    <div className="min-h-screen bg-background">
      <ProviderNavbar />

      <div className="container mx-auto px-4 lg:px-8 py-8">

        {/* Hero */}
        <section className="mb-12">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary via-primary/95 to-accent shadow-2xl">

            {/* Background decoration */}
            <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-cyan-300/10 blur-3xl" />

            {/* Grid Pattern */}
            <div
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10 p-8 lg:p-14">

              {/* Left */}
              <div className="max-w-2xl">
                <span className="inline-flex items-center rounded-full bg-white/15 backdrop-blur px-4 py-1 text-sm text-white border border-white/20">
                  Provider Dashboard
                </span>

                <h1 className="mt-5 text-4xl lg:text-5xl font-bold text-white leading-tight">
                  Welcome back
                  {providerName && (
                    <span className="text-cyan-200">, {providerName}</span>
                  )}
                </h1>

                <p className="mt-4 text-lg text-white/85 leading-relaxed max-w-xl">
                  {waiting > 0
                    ? `You have ${waiting} pending request${waiting > 1 ? "s" : ""}. Respond quickly to improve your acceptance rate.`
                    : "Everything looks great! No pending requests at the moment."}
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  <Link to="/provider/requests">
                    <Button
                      size="lg"
                      className="shadow-xl bg-white text-primary hover:bg-gray-100"
                    >
                      View Requests →
                    </Button>
                  </Link>

                  <Link to="/provider/calendar">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur"
                    >
                      My Calendar
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right */}
              <div className="hidden lg:flex flex-col gap-4 min-w-[240px]">

                <div className="rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 p-5">
                  <p className="text-sm text-white/70">
                    Pending Requests
                  </p>

                  <h2 className="mt-1 text-5xl font-bold text-white">
                    {waiting}
                  </h2>
                </div>

                <div className="rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 p-5">
                  <p className="text-sm text-white/70">
                    Status
                  </p>

                  <h3 className="mt-2 font-semibold text-green-300">
                    ● Available for Work
                  </h3>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Quick Statistics</h2>
          {loading ? (
            <div className="grid md:grid-cols-3 gap-6">
              <SkeletonCard /><SkeletonCard /><SkeletonCard />
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {stats.map((stat) => (
                <Card key={stat.label} className="hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                    </div>
                    <div className={`w-14 h-14 rounded-xl ${stat.color} flex items-center justify-center`}>
                      <stat.icon className="w-7 h-7" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Latest Requests */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Latest Waiting Requests</h2>
            <Link to="/provider/requests">
              <Button variant="ghost">
                View All
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="space-y-4">
              <SkeletonCard /><SkeletonCard />
            </div>
          ) : latestWaiting.length === 0 ? (
            <Card>
              <p className="text-center text-muted-foreground py-6">
                No waiting requests right now.
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {latestWaiting.map((request) => {
                const id       = request._id || request.id;
                const customer = request.customer;
                const status   = (request.status || '').toLowerCase();

                return (
                  <Card key={id} className="hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-4">
                      <img
                        src={customer?.profileURL || DEFAULT_AVATAR}
                        alt={getName(customer)}
                        className="w-16 h-16 rounded-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = DEFAULT_AVATAR;
                        }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{getName(customer)}</h3>
                          <Badge variant={status as any}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{request.serviceNeeded}</p>
                        {request.dateNeeded && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(request.dateNeeded).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <Link to="/provider/requests">
                        <Button size="sm">Respond</Button>
                      </Link>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </section>

        {/* ── Platform Reviews ── */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Platform Reviews</h2>
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
      </div>

      <Footer />
    </div>
  );
}