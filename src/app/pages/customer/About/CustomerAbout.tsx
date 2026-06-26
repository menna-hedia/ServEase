import { useState, useEffect } from 'react';
import CustomerNavbar from '../../../components/layout/CustomerNavbar';
import Footer from '../../../components/layout/Footer';
import Card from '../../../components/ui/Card';
import { Zap, Shield, Clock, MessageSquare, Star, MapPin } from 'lucide-react';
import { getGeneralCounts } from '../../shared/Services/generalCounts';

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

const steps = [
  {
    number: '1',
    title: 'Choose a Service',
    description: 'Browse categories and select the service you need',
  },
  {
    number: '2',
    title: 'Request Service',
    description: 'Submit your request with details and preferred schedule',
  },
  {
    number: '3',
    title: 'Get Matched',
    description: 'Receive offers from verified providers in your area',
  },
  {
    number: '4',
    title: 'Book & Enjoy',
    description: 'Accept an offer and enjoy professional service',
  },
];

export default function CustomerAbout() {
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
      <CustomerNavbar />

      <div className="container mx-auto px-4 lg:px-8 py-8">
        <section className="mb-16">
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl p-8 lg:p-12 text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">About ServEase</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Your trusted platform for connecting with professional home service providers.
              We make finding and booking quality services simple, fast, and reliable.
            </p>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Platform Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.number} className="flex gap-6 mb-8 last:mb-0">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-white">{step.number}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                  {index < steps.length - 1 && (
                    <div className="w-1 h-12 bg-gradient-to-b from-primary/30 to-transparent ml-7 mt-4"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="bg-gradient-to-br from-primary to-accent text-white rounded-3xl p-8 lg:p-12">
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
      </div>
      <Footer />
    </div>
  );
}