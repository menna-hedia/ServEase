import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, MapPin, Calendar, DollarSign, Clock, User, Key } from 'lucide-react';
import { toast } from 'sonner';
import ProviderNavbar from '../../components/layout/ProviderNavbar';
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
  completionOTP: '4729',
};

export default function ProviderRequestDetails() {
  const navigate = useNavigate();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);

  const handleCancel = () => {
    toast.success('Service cancelled successfully');
    setShowCancelModal(false);
    navigate('/provider/requests');
  };

  return (
    <div className="min-h-screen bg-background">
      <ProviderNavbar />

      <div className="container mx-auto px-4 lg:px-8 py-8">
        <button
          onClick={() => navigate('/provider/requests')}
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
                  <h3 className="font-semibold mb-2">Service Description</h3>
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
                      <p className="font-semibold">Agreed Price</p>
                      <p className="text-2xl font-bold text-success">${mockRequest.price}</p>
                      <p className="text-sm text-muted-foreground">
                        Commission (10%): ${mockRequest.price * 0.1}
                      </p>
                      <p className="text-sm font-semibold">
                        Your Earnings: ${mockRequest.price * 0.9}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-semibold">Service Location</p>
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
                <div className="mt-6 pt-6 border-t border-border">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                    <div className="flex items-start gap-3">
                      <Key className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-semibold text-blue-900 mb-1">Completion OTP Code</p>
                        <p className="text-sm text-blue-800 mb-2">
                          Share this code with the customer when the service is completed
                        </p>
                        <div className="bg-white rounded-lg px-4 py-2 inline-block">
                          <span className="text-2xl font-bold tracking-wider text-blue-600">
                            {mockRequest.completionOTP}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => setShowCancelModal(true)}
                  >
                    Cancel Service
                  </Button>
                </div>
              )}
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Customer Information
              </h2>
              <div className="flex flex-col items-center text-center mb-4">
                <img
                  src={mockRequest.customer.photo}
                  alt={mockRequest.customer.name}
                  className="w-20 h-20 rounded-full mb-3 border-4 border-primary"
                />
                <h3 className="font-semibold text-lg">{mockRequest.customer.name}</h3>
              </div>
              {/* <div className="space-y-2 pt-4 border-t border-border">
                <p className="text-sm">
                  <span className="text-muted-foreground">Email:</span>
                  <br />
                  {mockRequest.customer.email}
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Phone:</span>
                  <br />
                  {mockRequest.customer.phone}
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Location:</span>
                  <br />
                  {mockRequest.customer.city}, {mockRequest.customer.state}
                </p>
              </div> */}
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <h3 className="font-semibold mb-2 text-blue-900">Service Location</h3>
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
          <p>Are you sure you want to cancel this service? The customer will be notified.</p>
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
