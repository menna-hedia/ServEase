import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft, MapPin, Calendar, Clock,
  AlertTriangle, User, Briefcase,
} from 'lucide-react';
import { toast } from 'sonner';
import AdminSidebar from '../../../components/layout/AdminSidebar';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import Textarea from '../../../components/ui/Textarea';
import { cancelAdminRequest } from './ManageRequestsActions';
import { getSettings } from '../Settings/SettingsActions';
import { SettingsData } from './../Settings/Settings';
import { getAllServices } from '../../shared/Services/ServicesActions';

const DEFAULT_AVATAR = 'https://i.pinimg.com/736x/07/fb/34/07fb3452c4640d881a16d08c2e314f3e.jpg';

type RequestStatus =
  | 'confirmed'
  | 'waiting'
  | 'pending'
  | 'completed'
  | 'refused'
  | 'outdated'
  | 'cancelled'
  | 'open';

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

export default function AdminRequestDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const request = location.state?.request;

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason,    setCancelReason]    = useState('');
  const [isCancelling,    setIsCancelling]    = useState(false);
  const [currentStatus,   setCurrentStatus]   = useState(request?.status || '');
  const [commission,      setCommission]      = useState('0');
  const [cancelFee,       setCancelFee]       = useState('0');
  const [loading,         setLoading]         = useState(true);
  const [customerData,    setCustomerData]    = useState<any>(null);
  const [providerData,    setProviderData]    = useState<any>(null);
  const [services,        setServices]        = useState<any[]>([]);

  useEffect(() => {
    const loadServices = async () => {
      const result = await getAllServices();
      if (result.success) setServices(result.data);
    };
    loadServices();
  }, []);

  const getServiceName = (serviceId: string) => {
    if (typeof serviceId === 'object') return (serviceId as any)?.name || '—';
    const found = services.find((s) => s._id === serviceId);
    return found?.name || serviceId || '—';
  };

  // ============ LOAD ON MOUNT ============
  useEffect(() => {
    loadSettings();
    if (request) loadUsers();
  }, []);

  // ============ LOAD USERS ============
  const loadUsers = async () => {
    const token = localStorage.getItem('admin_token');

    const customerId = request?.customerId?._id || request?.customerId;
    const providerId = request?.providerId?._id || request?.providerId;

    if (customerId) {
      try {
        const res = await fetch(`/api/admin/user/${customerId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setCustomerData(data);
      } catch {
        console.error('Failed to load customer data');
      }
    }

    if (providerId) {
      try {
        const res = await fetch(`/api/admin/user/${providerId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setProviderData(data);
      } catch {
        console.error('Failed to load provider data');
      }
    }
  };

  // ============ LOAD SETTINGS ============
  const loadSettings = async () => {
    try {
      setLoading(true);
      const result = await getSettings();

      if (result.success) {
        const data = result.data as SettingsData;
        setCommission((data.webCommission || 0).toString());
        setCancelFee((data.providerCancelFee || 0).toString());
      } else {
        setCommission('0');
        setCancelFee('0');
      }
    } catch {
      setCommission('0');
      setCancelFee('0');
    } finally {
      setLoading(false);
    }
  };

  // ============ FORCE CANCEL ============
  const handleForceCancel = async () => {
    if (!cancelReason.trim()) {
      toast.error('Please provide a reason for cancellation');
      return;
    }
    setIsCancelling(true);
    const result = await cancelAdminRequest(id!);
    setIsCancelling(false);

    if (result.success) {
      toast.success('Request cancelled successfully');
      setCurrentStatus('REFUSED');
      setShowCancelModal(false);
    } else {
      toast.error(result.error || 'Failed to cancel request');
    }
  };

  // ============ HELPERS ============
  const getName = (obj: any) =>
    obj?.fullName ||
    (obj?.firstName && obj?.lastName ? `${obj.firstName} ${obj.lastName}` : null) ||
    obj?.userName || obj?.email || '—';

  const canCancel = (status: string) =>
    ['waiting', 'pending', 'confirmed', 'open'].includes(status?.toLowerCase());

  if (!request) {
    return (
      <div className="flex min-h-screen bg-background">
        <AdminSidebar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <p className="text-muted-foreground">Request data not available.</p>
          <Button onClick={() => navigate('/admin/requests')}>Back to Requests</Button>
        </div>
      </div>
    );
  }

  const status = (currentStatus || '').toLowerCase() as RequestStatus;
  const customer = request.customerId;
  const provider = request.providerId;
  const location_str = [
    request.exactLocation,
    request.street,
    request.city,
    request.governorate,
  ].filter(Boolean).join(', ');

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
                  <Briefcase className="w-5 h-5 text-primary mt-0.5 shrink-0" />
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
                        {new Date(request.dateNeeded).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}

                {request.startTime && (
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-sm">Start Time</p>
                      <p className="text-muted-foreground text-sm">{request.startTime}</p>
                    </div>
                  </div>
                )}

                {request.endTime && (
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-sm">End Time</p>
                      <p className="text-muted-foreground text-sm">{request.endTime}</p>
                    </div>
                  </div>
                )}

                {location_str && (
                  <div className="flex items-start gap-3 md:col-span-2">
                    <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-sm">Location</p>
                      <p className="text-muted-foreground text-sm">{location_str}</p>
                    </div>
                  </div>
                )}

                {request.createdAt && (
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-sm">Created At</p>
                      <p className="text-muted-foreground text-sm">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Payment */}
            {request.price && status !== 'refused' && (
              <Card>
                <h2 className="text-xl font-bold mb-4">Payment Details</h2>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Service Price</span>
                    <span className="font-semibold">EGP {request.price}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Platform Commission</span>
                    <span className="font-semibold text-green-600">
                      EGP {(request.price * parseFloat(commission) / 100).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Provider Earnings</span>
                    <span className="font-semibold">
                      EGP {(request.price - request.price * parseFloat(commission) / 100).toFixed(2)}
                    </span>
                  </div>
                </div>
              </Card>
            )}

            {/* Admin Actions */}
            {canCancel(status) && (
              <Card className="border-destructive/50">
                <h2 className="text-xl font-bold mb-2 text-destructive flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Admin Actions
                </h2>
                <p className="text-muted-foreground text-sm mb-4">
                  Force cancel this request if there are issues or policy violations.
                </p>
                <Button variant="destructive" onClick={() => setShowCancelModal(true)}>
                  Force Cancel Request
                </Button>
              </Card>
            )}
          </div>

          {/* ── Right column ── */}
          <div className="space-y-6">

            {/* Customer */}
            <Card
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => {
                const cid = customer?._id || customer;
                if (cid) navigate(`/admin/details/${cid}`);
              }}
            >
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <User className="w-4 h-4" /> Customer
              </h3>
              {customer ? (
                <div className="flex items-center gap-3">
                  <img
                    src={customerData?.profileURL || DEFAULT_AVATAR}
                    alt={getName(customer)}
                    className="w-12 h-12 rounded-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = DEFAULT_AVATAR;
                    }}
                  />
                  <div>
                    <p className="font-semibold text-sm">{getName(customerData || customer)}</p>
                    <p className="text-xs text-muted-foreground">{customer.email}</p>
                    {(customerData?.mobileNumber || customer.mobileNumber) && (
                      <p className="text-xs text-muted-foreground">
                        {customerData?.mobileNumber || customer.mobileNumber}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No customer assigned</p>
              )}
            </Card>

            {/* Provider */}
            <Card
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => {
                const pid = provider?._id || provider;
                if (pid) navigate(`/admin/details/${pid}`);
              }}
            >
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Briefcase className="w-4 h-4" /> Provider
              </h3>
              {provider ? (
                <div className="flex items-center gap-3">
                  <img
                    src={providerData?.profileURL || DEFAULT_AVATAR}
                    alt={getName(provider)}
                    className="w-12 h-12 rounded-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = DEFAULT_AVATAR;
                    }}
                  />
                  <div>
                    <p className="font-semibold text-sm">{getName(providerData || provider)}</p>
                    <p className="text-xs text-muted-foreground">
                      {getServiceName(provider.service)}
                    </p>
                    <p className="text-xs text-muted-foreground">{provider.email}</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No provider assigned yet</p>
              )}
            </Card>

            {/* Map */}
            {location_str && (
              <Card>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Location
                </h3>
                <p className="text-sm text-muted-foreground mb-3">{location_str}</p>
                <div className="rounded-xl overflow-hidden border border-border">
                  <iframe
                    title="Request Location"
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(location_str)}&output=embed&iwloc=&z=15`}
                    className="w-full h-48 border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location_str)}`}
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

        {/* Force Cancel Modal */}
        <Modal
          isOpen={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          title="Force Cancel Request"
        >
          <div className="space-y-4">
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
              <p className="text-sm text-destructive">
                <strong>Warning:</strong> This will immediately cancel the request and notify
                both the customer and provider.
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
              <Button
                variant="outline"
                onClick={() => setShowCancelModal(false)}
                className="flex-1"
                disabled={isCancelling}
              >
                Go Back
              </Button>
              <Button
                variant="destructive"
                onClick={handleForceCancel}
                className="flex-1"
                disabled={isCancelling}
              >
                {isCancelling ? 'Cancelling...' : 'Confirm Cancellation'}
              </Button>
            </div>
          </div>
        </Modal>

      </div>
    </div>
  );
}