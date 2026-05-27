import ProviderNavbar from '../../components/layout/ProviderNavbar';
import Footer from '../../components/layout/Footer';
import Card from '../../components/ui/Card';
import { Briefcase, Clock, CheckCircle, Star, ChevronRight } from 'lucide-react';
import { Link } from 'react-router';
import Button from '../../components/ui/Button';

const stats = [
  { label: 'Total Requests', value: '47', icon: Briefcase, color: 'bg-blue-100 text-blue-600' },
  { label: 'Unanswered', value: '8', icon: Clock, color: 'bg-orange-100 text-orange-600' },
  { label: 'Completed', value: '32', icon: CheckCircle, color: 'bg-green-100 text-green-600' },
];

const latestRequests = [
  {
    id: 1,
    customerName: 'Sarah Johnson',
    customerPhoto: 'https://i.pravatar.cc/150?img=1',
    category: 'Electrician',
    description: 'Fix electrical outlet in kitchen',
    date: '2026-05-18',
    status: 'waiting',
  },
  {
    id: 2,
    customerName: 'Mike Chen',
    customerPhoto: 'https://i.pravatar.cc/150?img=12',
    category: 'Electrician',
    description: 'Install ceiling fan in bedroom',
    date: '2026-05-19',
    status: 'waiting',
  },
];

export default function ProviderHome() {
  return (
    <div className="min-h-screen bg-background">
      <ProviderNavbar />

      <div className="container mx-auto px-4 lg:px-8 py-8">
        <section className="mb-12">
          <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-accent rounded-3xl p-8 lg:p-16">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/20 rounded-full blur-2xl"></div>
            <div className="relative z-10">
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-white leading-tight">
                Welcome Back, Robert! 👋
              </h1>
              <p className="text-xl lg:text-2xl text-white/90 mb-8 max-w-2xl">
                You have {stats[1].value} new service requests waiting for your response. Keep up the great work!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/provider/requests">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto shadow-xl">
                    View Requests
                    <span className="ml-2">→</span>
                  </Button>
                </Link>
                <Link to="/provider/calendar">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border-white/30">
                    My Calendar
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Quick Statistics</h2>
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
        </section>

        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Latest Requests</h2>
            <Link to="/provider/requests">
              <Button variant="ghost">
                View All
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="space-y-4">
            {latestRequests.map((request) => (
              <Card key={request.id} className="hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4">
                  <img
                    src={request.customerPhoto}
                    alt={request.customerName}
                    className="w-16 h-16 rounded-full"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{request.customerName}</h3>
                    <p className="text-sm text-muted-foreground">{request.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(request.date).toLocaleDateString()}
                    </p>
                  </div>
                  <Link to="/provider/requests">
                    <Button size="sm">Respond</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
