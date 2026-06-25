import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, ChevronRight, Send, Mail, Phone, Clock, CheckCircle } from 'lucide-react';
import ProviderNavbar from '../../components/layout/ProviderNavbar';
import Footer from '../../components/layout/Footer';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { SkeletonCard } from '../../components/ui/Skeleton';
import { getProviderRequests } from './Requests/ProviderRequestsActions';
import { getProviderProfile } from './Profile/ProviderProfileActions';

const DEFAULT_AVATAR = 'https://i.pravatar.cc/150?img=1';

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
  return (
    <div className="min-h-screen bg-background">
      <ProviderNavbar />

      <div className="container mx-auto px-4 lg:px-8 py-8">

        {/* Hero */}
        <section className="mb-12">
          <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-accent rounded-3xl p-8 lg:p-16">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/20 rounded-full blur-2xl" />
            <div className="relative z-10">
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-white leading-tight">
                Welcome Back{providerName ? `, ${providerName}` : ''}! 👋
              </h1>
              <p className="text-xl lg:text-2xl text-white/90 mb-8 max-w-2xl">
                {waiting > 0
                  ? `You have ${waiting} new service request${waiting > 1 ? 's' : ''} waiting for your response.`
                  : "You're all caught up! No pending requests right now."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/provider/requests">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto shadow-xl">
                    View Requests
                    <span className="ml-2">→</span>
                  </Button>
                </Link>
                <Link to="/provider/calendar">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border-white/30"
                  >
                    My Calendar
                  </Button>
                </Link>
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
      </div>
      
      <Footer />
    </div>
  );
}
