import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, MapPin, Calendar, DollarSign, Clock, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import AdminSidebar from '../../components/layout/AdminSidebar';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Textarea from '../../components/ui/Textarea';

const mockRequest = {
  id: 1,
  customer: {
    name: 'Sarah Johnson',
    photo: 'https://i.pravatar.cc/150?img=1',
    email: 'sarah@example.com',
    phone: '+1 555-0101',
  },
  provider: {
    name: 'Robert Johnson',
    photo: 'https://i.pravatar.cc/150?img=12',
    email: 'robert@example.com',
    phone: '+1 555-0102',
    category: 'Electrician',
  },
  description: 'Fix electrical outlet in kitchen and check wiring in living room',
  requestDate: '2026-05-10',
  scheduledDate: '2026-05-20',
  scheduledTime: '10:00 AM',
  status: 'confirmed' as const,
  price: 200,
  commission: 20,
  location: {
    address: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
  },
};

export default function AdminRequestDetails() {
  const navigate = useNavigate();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const handleForceCancel = () => {
    if (!cancelReason.trim()) {
      toast.error('Please provide a reason for cancellation');
      return;
    }
    toast.success('Request cancelled successfully');
    setShowCancelModal(false);
    navigate('/admin/requests');
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <div className="flex-1 p-8">
        <button
          onClick={() => navigate('/admin/requests')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Requests
        </button>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Request #{mockRequest.id}</h1>
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
                        {new Date(mockRequest.scheduledDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-semibold">Time</p>
                      <p className="text-muted-foreground">{mockRequest.scheduledTime}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-semibold">Location</p>
                      <p className="text-muted-foreground">
                        {mockRequest.location.address}, {mockRequest.location.city}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <h2 className="text-xl font-bold mb-4">Payment Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Service Price</span>
                  <span className="font-semibold">${mockRequest.price}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Platform Commission (10%)</span>
                  <span className="font-semibold text-success">${mockRequest.commission}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Provider Earnings</span>
                  <span className="font-semibold">
                    ${mockRequest.price - mockRequest.commission}
                  </span>
                </div>
              </div>
            </Card>

            <Card className="border-destructive/50">
              <h2 className="text-xl font-bold mb-4 text-destructive flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Admin Actions
              </h2>
              <p className="text-muted-foreground mb-4">
                Force cancel this request if there are issues or policy violations.
              </p>
              <Button variant="destructive" onClick={() => setShowCancelModal(true)}>
                Force Cancel Request
              </Button>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <h3 className="font-semibold mb-4">Customer</h3>
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={mockRequest.customer.photo}
                  alt={mockRequest.customer.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="font-semibold">{mockRequest.customer.name}</p>
                  <p className="text-sm text-muted-foreground">{mockRequest.customer.email}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{mockRequest.customer.phone}</p>
            </Card>

            <Card>
              <h3 className="font-semibold mb-4">Provider</h3>
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={mockRequest.provider.photo}
                  alt={mockRequest.provider.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="font-semibold">{mockRequest.provider.name}</p>
                  <p className="text-sm text-muted-foreground">{mockRequest.provider.category}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{mockRequest.provider.email}</p>
              <p className="text-sm text-muted-foreground">{mockRequest.provider.phone}</p>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <h3 className="font-semibold mb-2 text-blue-900">Location Map</h3>
              <div className="aspect-video bg-blue-200 rounded-lg flex items-center justify-center">
                <MapPin className="w-12 h-12 text-blue-600" />
              </div>
            </Card>
          </div>
        </div>

        <Modal
          isOpen={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          title="Force Cancel Request"
        >
          <div className="space-y-4">
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
              <p className="text-sm text-destructive">
                <strong>Warning:</strong> This will immediately cancel the request and notify both
                the customer and provider.
              </p>
            </div>
            <Textarea
              label="Cancellation Reason"
              placeholder="Explain why this request is being cancelled..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              required
            />
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowCancelModal(false)} className="flex-1">
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleForceCancel} className="flex-1">
                Confirm Cancellation
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
