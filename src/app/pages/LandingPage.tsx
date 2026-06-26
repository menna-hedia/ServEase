import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  Home as HomeIcon,
  Send,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { getGeneralCounts } from './shared/Services/generalCounts';
// import landingImage from '../images/landing.jpg';

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

const reviews = [
  {
    name: 'Sarah Johnson',
    role: 'Customer',
    rating: 5,
    text: 'Incredible service! Found an excellent electrician within minutes. The whole process was smooth and professional.',
    photo: 'https://i.pravatar.cc/150?img=1',
  },
  {
    name: 'Mike Chen',
    role: 'Provider',
    rating: 5,
    text: 'As a provider, ServEase has transformed my business. I receive quality job requests daily and the platform is easy to use.',
    photo: 'https://i.pravatar.cc/150?img=12',
  },
  {
    name: 'Emily Rodriguez',
    role: 'Customer',
    rating: 5,
    text: 'Best platform for home services! The providers are professional and the pricing is transparent. Highly recommended!',
    photo: 'https://i.pravatar.cc/150?img=5',
  },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentReview, setCurrentReview] = useState(0);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const nextReview = () => setCurrentReview((prev) => (prev + 1) % reviews.length);
  const prevReview = () => setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);

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
  const [counts, setCounts] = useState({
    providerCount: 0,
    requesterCount: 0,
    userSatisfaction: 0,
  });
  const [loadingCounts, setLoadingCounts] = useState(true);

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

  return (
    <div className="min-h-screen bg-background">

      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                <HomeIcon className="w-6 h-6 text-white" />
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
      {/* <div className="relative">
       <img
  src='.\images\landing.jpg'
  alt="Home and office services illustration"
  className="w-full h-96 object-cover rounded-3xl"
/>
      </div> */}
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

      {/* Reviews Section */}
      <section id="reviews" className="py-20 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-xl text-muted-foreground">Trusted by thousands of customers and providers</p>
          </div>
          <div className="max-w-4xl mx-auto relative">
            <Card className="p-8 lg:p-12">
              <div className="flex flex-col items-center text-center space-y-6">
                <img
                  src={reviews[currentReview].photo}
                  alt={reviews[currentReview].name}
                  className="w-20 h-20 rounded-full border-4 border-primary"
                />
                <div>
                  <h3 className="text-2xl font-semibold mb-1">{reviews[currentReview].name}</h3>
                  <p className="text-muted-foreground mb-3">{reviews[currentReview].role}</p>
                  <div className="flex justify-center gap-1 mb-4">
                    {[...Array(reviews[currentReview].rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-lg text-muted-foreground italic">"{reviews[currentReview].text}"</p>
                </div>
              </div>
            </Card>
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={prevReview}
                className="p-3 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextReview}
                className="p-3 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </section>
{/* 
      Statistics Section */}
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

      {/* Footer */}
      <footer id="about" className="bg-secondary text-white py-16">
        <div className="container mx-auto px-4 lg:px-8">

          {/* About ServEase */}
          <div className="mb-12 pb-12 border-b border-white/10">
            <h3 className="text-2xl font-bold mb-6 text-center">About ServEase</h3>
            <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
              <div className="space-y-3">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold">For Customers</h4>
                </div>
                <p className="text-white/75 text-sm leading-relaxed">
                  ServEase empowers homeowners and tenants to discover, compare, and book trusted home
                  service professionals in minutes. Our platform lets you browse verified provider profiles,
                  read authentic customer reviews, and track your service request in real time — all from one
                  convenient dashboard. Every booking is backed by our satisfaction guarantee, transparent
                  pricing, and secure in-app payment, so you can focus on what matters while we handle the rest.
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold">For Service Providers</h4>
                </div>
                <p className="text-white/75 text-sm leading-relaxed">
                  ServEase is built to help skilled professionals grow their business without the hassle of
                  traditional marketing. By joining our network, you gain instant access to a steady stream
                  of qualified job requests in your area, a professional profile that showcases your skills
                  and customer ratings, and seamless tools for scheduling, invoicing, and secure payment
                  collection. Whether you're an independent technician or a growing service company,
                  ServEase gives you the visibility and infrastructure to scale with confidence.
                </p>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                  <HomeIcon className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">ServEase</span>
              </div>
              <p className="text-white/80">
                Your trusted platform for connecting with professional home service providers.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <a href="#home" className="block text-white/80 hover:text-white">Home</a>
                <a href="#features" className="block text-white/80 hover:text-white">Features</a>
                <a href="#reviews" className="block text-white/80 hover:text-white">Reviews</a>
                <a href="#contact" className="block text-white/80 hover:text-white">Contact</a>
                <Link to="/signin" className="block text-white/80 hover:text-white">Sign In</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Providers</h4>
              <div className="space-y-2">
                <Link to="/signup/provider" className="block text-white/80 hover:text-white">
                  Join as Provider
                </Link>
                <a href="#" className="block text-white/80 hover:text-white">How it Works</a>
                <a href="#" className="block text-white/80 hover:text-white">Pricing</a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact Us</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-white/80">
                  <Mail className="w-5 h-5 flex-shrink-0" />
                  <a
                    href="mailto:noreply@contact.servease.me"
                    className="hover:text-white transition-colors text-sm"
                  >
                    noreply@contact.servease.me
                  </a>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <Phone className="w-5 h-5 flex-shrink-0" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex gap-3 mt-4">
                  <a href="#" className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a href="#" className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a href="#" className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a href="#" className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                    <Linkedin className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 text-center text-white/60">
            <p>&copy; 2026 ServEase. All rights reserved.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}