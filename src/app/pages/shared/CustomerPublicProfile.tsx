import { useNavigate } from 'react-router';
import { ArrowLeft, MapPin, User } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const mockCustomer = {
  name: 'Sarah Johnson',
  photo: 'https://i.pravatar.cc/150?img=1',
  city: 'New York',
  state: 'NY',
  memberSince: '2025-01-15',
  completedRequests: 12,
};

export default function CustomerPublicProfile() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <Card className="text-center">
          <div className="flex flex-col items-center mb-6">
            <div className="w-32 h-32 bg-gradient-to-br from-primary to-accent rounded-full p-1 mb-4">
              <img
                src={mockCustomer.photo}
                alt={mockCustomer.name}
                className="w-full h-full rounded-full object-cover border-4 border-white"
              />
            </div>
            <h1 className="text-3xl font-bold mb-2">{mockCustomer.name}</h1>
            <div className="flex items-center gap-2 text-muted-foreground mb-4">
              <MapPin className="w-4 h-4" />
              <span>
                {mockCustomer.city}, {mockCustomer.state}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 py-6 border-y border-border">
            <div>
              <p className="text-3xl font-bold text-primary mb-1">{mockCustomer.completedRequests}</p>
              <p className="text-sm text-muted-foreground">Services Requested</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary mb-1">
                {new Date(mockCustomer.memberSince).getFullYear()}
              </p>
              <p className="text-sm text-muted-foreground">Member Since</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted/50 rounded-xl">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <User className="w-5 h-5" />
              <p>Verified Customer</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
