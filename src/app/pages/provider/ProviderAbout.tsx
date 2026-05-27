import ProviderNavbar from '../../components/layout/ProviderNavbar';
import Footer from '../../components/layout/Footer';
import Card from '../../components/ui/Card';
import { Zap, Shield, Clock, DollarSign } from 'lucide-react';

const features = [
  { icon: Zap, title: 'More Job Opportunities', description: 'Access a steady stream of verified customer requests' },
  { icon: Shield, title: 'Verified Platform', description: 'Work with verified customers on a trusted platform' },
  { icon: Clock, title: 'Flexible Schedule', description: 'Accept jobs that fit your schedule and availability' },
  { icon: DollarSign, title: 'Transparent Pricing', description: 'Set your own prices and get paid fairly' },
];

export default function ProviderAbout() {
  return (
    <div className="min-h-screen bg-background">
      <ProviderNavbar />

      <div className="container mx-auto px-4 lg:px-8 py-8">
        <section className="mb-16">
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl p-8 lg:p-12 text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">Grow Your Business</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join thousands of service providers who are building successful businesses on ServEase
            </p>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose ServEase</h2>
          <div className="grid md:grid-cols-2 gap-6">
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

        <section>
          <div className="bg-gradient-to-br from-primary to-accent text-white rounded-3xl p-8 lg:p-12">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-5xl font-bold mb-2">5,000+</div>
                <p className="text-xl text-white/90">Active Providers</p>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">$2M+</div>
                <p className="text-xl text-white/90">Total Earnings</p>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">98%</div>
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
