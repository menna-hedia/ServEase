import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, MapPin, Calendar, DollarSign, Clock, User, CheckCircle, X } from 'lucide-react';
import { toast } from 'sonner';
import CustomerNavbar from '../../components/layout/CustomerNavbar';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';

const mockRequest = {
  id: 1,
  customer: {
    name: 'Sarah Johnson',
    photo: 'https://i.pravatar.cc/150?img=1',
    email: 'sarah@example.com',
    phone: '+1 555-0101',
    city: 'New York',
    state: 'NY',
  },
  provider: {
    name: 'Robert Johnson',
    photo: 'https://i.pravatar.cc/150?img=12',
    email: 'robert@example.com',
    phone: '+1 555-0102',
    rating: 4.9,
    category: 'Electrician',
  },
  description: 'Fix electrical outlet in kitchen and check wiring in living room',
  requestDate: '2026-05-10',
  scheduledDate: '2026-05-20',
  scheduledTime: '10:00 AM',
  endTime: '12:00 PM',
  status: 'confirmed' as const,
  price: 200,
  location: {
    address: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
  },
  timeline: [
    { status: 'Request Submitted', date: '2026-05-10 09:30 AM', completed: true },
    { status: 'Provider Accepted', date: '2026-05-10 02:15 PM', completed: true },
    { status: 'Offer Accepted', date: '2026-05-10 03:00 PM', completed: true },
    { status: 'Service Scheduled', date: '2026-05-20 10:00 AM', completed: false },
    { status: 'Service Completed', date: 'Pending', completed: false },
  ],
};

export default function CustomerRequestDetails() {
  const navigate = useNavigate();
  const [showCancelModal, setShowCancelModal] = useState(false);

  const handleCancel = () => {
    toast.success('Service cancelled successfully');
    setShowCancelModal(false);
    navigate('/customer/requests');
  };

  const handleComplete = () => {
    navigate('/complete-service', { state: { requestId: mockRequest.id } });
  };

  return (
    <div className="min-h-screen bg-background">
      <CustomerNavbar />

      <div className="container mx-auto px-4 lg:px-8 py-8">
        <button
          onClick={() => navigate('/customer/requests')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Requests
        </button>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Request Details</h1>
                <Badge variant={mockRequest.status}>
                  {mockRequest.status.charAt(0).toUpperCase() + mockRequest.status.slice(1)}
                </Badge>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">{mockRequest.description}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-semibold">Scheduled Date</p>
                      <p className="text-muted-foreground">
                        {new Date(mockRequest.scheduledDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-semibold">Time</p>
                      <p className="text-muted-foreground">
                        {mockRequest.scheduledTime} - {mockRequest.endTime}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <DollarSign className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-semibold">Price</p>
                      <p className="text-2xl font-bold text-primary">${mockRequest.price}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-semibold">Location</p>
                      <p className="text-muted-foreground">
                        {mockRequest.location.address}
                        <br />
                        {mockRequest.location.city}, {mockRequest.location.state}{' '}
                        {mockRequest.location.zipCode}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {mockRequest.status === 'confirmed' && (
                <div className="flex gap-3 mt-6 pt-6 border-t border-border">
                  <Button className="flex-1" onClick={handleComplete}>
                    <CheckCircle className="w-4 h-4" />
                    Complete Service
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => setShowCancelModal(true)}
                  >
                    <X className="w-4 h-4" />
                    Cancel Service
                  </Button>
                </div>
              )}
            </Card>

            {/* <Card>
              <h2 className="text-xl font-bold mb-6">Status Timeline</h2>
              <div className="space-y-4">
                {mockRequest.timeline.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          item.completed
                            ? 'bg-success text-white'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {item.completed ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <div className="w-3 h-3 rounded-full bg-current" />
                        )}
                      </div>
                      {index < mockRequest.timeline.length - 1 && (
                        <div className="w-0.5 h-12 bg-border" />
                      )}
                    </div>
                    <div className="flex-1 pb-8">
                      <p className="font-semibold">{item.status}</p>
                      <p className="text-sm text-muted-foreground">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card> */}
          </div>

          <div className="space-y-6">
            <Card>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Provider Information
              </h2>
              <div className="flex flex-col items-center text-center mb-4">
                <img
                  src={mockRequest.provider.photo}
                  alt={mockRequest.provider.name}
                  className="w-20 h-20 rounded-full mb-3 border-4 border-primary"
                />
                <h3 className="font-semibold text-lg">{mockRequest.provider.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{mockRequest.provider.category}</p>
                <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-full">
                  <span className="text-yellow-600 font-semibold">{mockRequest.provider.rating}</span>
                  <span className="text-yellow-600">★</span>
                </div>
              </div>
              {/* <div className="space-y-2 pt-4 border-t border-border">
                <p className="text-sm">
                  <span className="text-muted-foreground">Email:</span>
                  <br />
                  {mockRequest.provider.email}
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Phone:</span>
                  <br />
                  {mockRequest.provider.phone}
                </p>
              </div> */}
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <h3 className="font-semibold mb-2 text-blue-900">Location Map</h3>
              <div className="aspect-video bg-blue-200 rounded-lg flex items-center justify-center">
                <MapPin className="w-12 h-12 text-blue-600" />
              </div>
              <p className="text-sm text-blue-800 mt-3">
                {mockRequest.location.address}, {mockRequest.location.city}
              </p>
            </Card>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Service"
        size="sm"
      >
        <div className="space-y-4">
          <p>Are you sure you want to cancel this service? This action cannot be undone.</p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowCancelModal(false)} className="flex-1">
              No, Keep It
            </Button>
            <Button variant="destructive" onClick={handleCancel} className="flex-1">
              Yes, Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
