import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Clock, User, Key, DollarSign, Loader2, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import ProviderNavbar from '../../../components/layout/ProviderNavbar';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import { acceptRequest, rejectRequest, cancelRequest, getRequestDetails } from './ProviderRequestsActions';
import Input from './../../../components/ui/Input';

const DEFAULT_AVATAR = 'https://i.pravatar.cc/150?img=1';

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  confirmed: { bg: 'bg-green-100',   text: 'text-green-700',   label: 'Confirmed'  },
  waiting:   { bg: 'bg-orange-100',  text: 'text-orange-700',  label: 'Waiting'    },
  pending:   { bg: 'bg-yellow-100',  text: 'text-yellow-700',  label: 'Pending'    },
  completed: { bg: 'bg-emerald-100', text: 'text-emerald-800', label: 'Completed'  },
  refused:   { bg: 'bg-red-100',     text: 'text-red-700',     label: 'Refused'    },
  outdated:  { bg: 'bg-gray-100',    text: 'text-gray-600',    label: 'Outdated'   },
  cancelled: { bg: 'bg-rose-100',    text: 'text-rose-700',    label: 'Cancelled'  },
  open:      { bg: 'bg-blue-100',    text: 'text-blue-700',    label: 'Open'       },
};

function StatusBadge({ status }: { status: string }) {
  const key = status?.toLowerCase() ?? '';
  const style = STATUS_STYLES[key] ?? { bg: 'bg-gray-100', text: 'text-gray-600', label: status };
  return (
    <span className={`inline-flex items-center px-3 py-2 rounded-full text-xs font-semibold ${style.bg} ${style.text}`}>
      {style.label}
    </span>
  );
}

export default function ProviderRequestDetails() {
  const { id }     = useParams<{ id: string }>();
  const navigate   = useNavigate();
  const location   = useLocation();

  const [request,        setRequest]        = useState<any>(location.state?.request || null);
  const [loadingRequest, setLoadingRequest] = useState(true);
  const [currentStatus,  setCurrentStatus]  = useState(location.state?.request?.status || '');

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling,    setIsCancelling]    = useState(false);

  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [offerData,       setOfferData]       = useState({ price: '', endTime: '' });
  const [isAccepting,     setIsAccepting]     = useState(false);
  const [isRejecting,     setIsRejecting]     = useState(false);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      setLoadingRequest(true);
      const result = await getRequestDetails(id);
      setLoadingRequest(false);

      if (result.success) {
        setRequest(result.data);
        setCurrentStatus(result.data?.status || '');
      } else {
        if (!request) toast.error(result.error || 'Failed to load request details');
      }
    };

    load();
  }, [id]);

  const handleAccept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerData.price || !offerData.endTime) {
      toast.error('Please fill all fields');
      return;
    }
    setIsAccepting(true);
    const result = await acceptRequest(id!, Number(offerData.price), offerData.endTime);
    setIsAccepting(false);

    if (result.success) {
      toast.success(result.message || 'Offer submitted successfully!');
      setCurrentStatus('PENDING');
      setShowAcceptModal(false);
      setOfferData({ price: '', endTime: '' });
    } else {
      toast.error(result.error || 'Failed to submit offer');
    }
  };

  const handleReject = async () => {
    setIsRejecting(true);
    const result = await rejectRequest(id!);
    setIsRejecting(false);

    if (result.success) {
      toast.success(result.message || 'Request rejected');
      setCurrentStatus('REFUSED');
    } else {
      toast.error(result.error || 'Failed to reject request');
    }
  };

  const handleCancel = async () => {
    setIsCancelling(true);
    const result = await cancelRequest(id!);
    setIsCancelling(false);

    if (result.success) {
      toast.success('Service cancelled successfully');
      setCurrentStatus('REFUSED');
      setShowCancelModal(false);
    } else {
      toast.error(result.error || 'Failed to cancel service');
    }
  };

  if (loadingRequest && !request) {
    return (
      <div className="min-h-screen bg-background">
        <ProviderNavbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 py-40">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading request details...</p>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-background">
        <ProviderNavbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 py-20">
          <p className="text-muted-foreground">Request not found.</p>
          <Button onClick={() => navigate('/provider/requests')}>Back to Requests</Button>
        </div>
      </div>
    );
  }

  const status   = (currentStatus || '').toLowerCase();
  const customer = request.customer;

  const getName = (c: any) =>
    c?.userName ||
    (c?.firstName && c?.lastName ? `${c.firstName} ${c.lastName}` : null) ||
    '—';

  const locationStr = [
    request.exactLocation,
    request.street,
    request.city,
    request.governorate,
  ].filter(Boolean).join(', ');

  const calcHourlyPrice = (start: string, end: string, hourPrice: number) => {
    if (!start || !end || !hourPrice) return null;
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    const hours = (Math.ceil((eh * 60 + em) - (sh * 60 + sm))) / 60;
    if (hours <= 0) return null;
    return Math.ceil(hours * hourPrice);
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

          {/* ── Left column ── */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">
                  Request{' '}
                  <span className="text-muted-foreground text-lg">
                    #{(request._id || request.id)?.slice(-6)}
                  </span>
                </h1>
                <StatusBadge status={status} />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <DollarSign className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Service</p>
                    <p className="text-muted-foreground text-sm">{request.serviceNeeded || '—'}</p>
                  </div>
                </div>

                {request.dateNeeded && (
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-sm">Date Needed</p>
                      <p className="text-muted-foreground text-sm">
                        {new Date(request.dateNeeded).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                )}

                {request.startTime && (
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-sm">Time</p>
                      <p className="text-muted-foreground text-sm">
                        {request.startTime}
                        {request.endTime ? ` → ${request.endTime}` : ''}
                      </p>
                    </div>
                  </div>
                )}

                {locationStr && (
                  <div className="flex items-start gap-3 md:col-span-2">
                    <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-sm">Location</p>
                      <p className="text-muted-foreground text-sm">{locationStr}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment */}
              {request.price > 0 ? (
                <div className="mt-6 pt-6 border-t border-border">
                  <h3 className="font-semibold mb-3">Payment Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Service Price</span>
                      <span className="font-semibold">EGP {request.price}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Platform Commission</span>
                      <span className="text-destructive">− EGP {request.commission}</span>
                    </div>
                    <div className="flex justify-between text-sm border-t pt-2">
                      <span className="font-semibold">Your Earnings</span>
                      <span className="font-bold text-green-600">EGP {request.earnings}</span>
                    </div>
                  </div>
                </div>
              ) : request.paymentMode === 'HOURLY' ? (
                <div className="mt-6 pt-6 border-t border-border">
                  <h3 className="font-semibold mb-3">Hourly Pricing</h3>
                  <div className="space-y-2">
                    {(() => {
                      const estimated = calcHourlyPrice(
                        request.startTime,
                        request.endTime,
                        request.customer?.hourPrice
                      );
                      return (
                        <>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Hourly Rate</span>
                            <span className="font-semibold">EGP {request.customer?.hourPrice}/hr</span>
                          </div>
                          {estimated && (
                            <>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Estimated Hours</span>
                                <span className="font-semibold">{(estimated / (request.customer?.hourPrice || 1)).toFixed(1)} hours</span>
                              </div>
                              <div className="flex justify-between text-sm border-t pt-2">
                                <span className="font-semibold">Estimated Earnings</span>
                                <span className="font-bold text-green-600">EGP {estimated}</span>
                              </div>
                            </>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>
              ) : request.preferredPrice > 0 ? (
                <div className="mt-6 pt-6 border-t border-border">
                  <h3 className="font-semibold mb-3">Preferred Pricing</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Customer Preferred Price</span>
                      <span className="font-semibold">EGP {request.preferredPrice}</span>
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Completion OTP */}
              {status === 'confirmed' && request.completionCode && (
                <div className="mt-6 pt-6 border-t border-border">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <Key className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-semibold text-blue-900 mb-1">Completion OTP Code</p>
                        <p className="text-sm text-blue-800 mb-2">
                          Share this code with the customer when the service is completed
                        </p>
                        <div className="bg-white rounded-lg px-4 py-2 inline-block">
                          <span className="text-2xl font-bold tracking-wider text-blue-600">
                            {request.completionCode}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Waiting Actions */}
              {status === 'waiting' && (
                <div className="mt-4 flex gap-3">
                  <Button className="flex-1"
                   variant="success"
                  onClick={() => setShowAcceptModal(true)}>
                    <Check className="w-4 h-4" />
                    Accept
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    disabled={isRejecting}
                    onClick={handleReject}
                  >
                    <X className="w-4 h-4" />
                    {isRejecting ? 'Rejecting...' : 'Reject'}
                  </Button>
                </div>
              )}

              {/* Cancel Button */}
              {status === 'confirmed' && (
                <div className="mt-4">
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => setShowCancelModal(true)}
                  >
                    <X className="w-4 h-4" />
                    Cancel Service
                  </Button>
                </div>
              )}
            </Card>
          </div>

          {/* ── Right column ── */}
          <div className="space-y-6">
            <Card>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <User className="w-5 h-5" /> Customer
              </h2>
              <div className="flex flex-col items-center text-center">
                <img
                  src={customer?.profileURL || DEFAULT_AVATAR}
                  alt={getName(customer)}
                  className="w-20 h-20 rounded-full mb-3 border-4 border-primary object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = DEFAULT_AVATAR;
                  }}
                />
                <h3 className="font-semibold text-lg">{getName(customer)}</h3>
                {customer?.email && status === 'confirmed' && (
                  <p className="text-sm text-muted-foreground">{customer.email}</p>
                )}
                {customer?.mobileNumber && status === 'confirmed' && (
                  <p className="text-sm text-muted-foreground">{customer.mobileNumber}</p>
                )}
              </div>
            </Card>

            {locationStr && (
              <Card>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Location
                </h3>
                <p className="text-sm text-muted-foreground mb-3">{locationStr}</p>
                <div className="rounded-xl overflow-hidden border border-border">
                  <iframe
                    title="Service Location"
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(locationStr)}&output=embed&iwloc=&z=15`}
                    className="w-full h-48 border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationStr)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 mt-3 text-sm text-primary hover:underline"
                >
                  <MapPin className="w-4 h-4" />
                  Open in Google Maps
                </a>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Accept Modal */}
      <Modal
        isOpen={showAcceptModal}
        onClose={() => setShowAcceptModal(false)}
        title="Accept Request & Submit Offer"
      >
        <form onSubmit={handleAccept} className="space-y-4">
          <Input
            type="number"
            label="Price (EGP)"
            placeholder="Enter your price"
            value={offerData.price}
            onChange={(e) => setOfferData({ ...offerData, price: e.target.value })}
            required
          />
          <Input
            type="time"
            label="Estimated End Time"
            value={offerData.endTime}
            onChange={(e) => setOfferData({ ...offerData, endTime: e.target.value })}
            required
          />
          <Button type="submit" className="w-full" disabled={isAccepting}>
            {isAccepting ? 'Submitting...' : 'Submit Offer'}
          </Button>
        </form>
      </Modal>

      {/* Cancel Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Service"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Are you sure you want to cancel this service? The customer will be notified.
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowCancelModal(false)}
              className="flex-1"
              disabled={isCancelling}
            >
              No, Keep It
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancel}
              className="flex-1"
              disabled={isCancelling}
            >
              {isCancelling ? 'Cancelling...' : 'Yes, Cancel'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}