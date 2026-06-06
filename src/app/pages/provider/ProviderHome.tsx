import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Briefcase, Clock, CheckCircle, ChevronRight } from 'lucide-react';
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

      </div>
      <Footer />
    </div>
  );
}