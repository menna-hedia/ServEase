import { useState, useEffect } from 'react';
import { FileText, CheckCircle, X, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import AdminSidebar from '../../../components/layout/AdminSidebar';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import Textarea from '../../../components/ui/Textarea';
import { SkeletonCard } from '../../../components/ui/Skeleton';
import {
  getPendingProviders,
  approveProvider,
  rejectProvider,
} from './ProviderApprovalActions';

interface Provider {
  id?: string;
  name?: string;
  cvUrl?: string;
  userName?: string;
  email: string;
  age: string;
mobileNumber?: string;
  service?: string;
  specialization?: string;
  nationalNumber?: string;
  cvFile?: string;
  writtenCv?: string;
profileURL?: string;
  createdAt?: string;
  status?: string;
  location?: string;
  city?: string;
  state?: string;
}

export default function ProviderApproval() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  // ============ LOAD PROVIDERS ON MOUNT ============
  useEffect(() => {
    loadPendingProviders();
  }, []);

  // ============ LOAD PENDING PROVIDERS ============
  const loadPendingProviders = async () => {
    try {
      setLoading(true);
      const result = await getPendingProviders();

      if (result.success) {
        const providersList = Array.isArray(result.data) ? result.data : [];
        setProviders(providersList);

        if (providersList.length === 0) {
          toast.info('No pending providers to review');
        }
      } else {
        toast.error(result.error || 'Failed to load pending providers');
        setProviders([]);
      }
    } catch (error) {
      toast.error('Error loading pending providers');
      setProviders([]);
    } finally {
      setLoading(false);
    }
  };

  // ============ HANDLE APPROVE ============
  const handleApprove = async (provider: Provider) => {
    try {
      setIsApproving(true);
      const providerId = provider.id

      if (!providerId) {
        toast.error('Invalid provider ID');
        return;
      }

      const result = await approveProvider(providerId);

      if (result.success) {
        toast.success(result.message || 'Provider approved successfully');
        setProviders(providers.filter((p) => (p.id ) !== providerId));

        if (providers.length === 1) {
          toast.info('No more pending providers');
        }
      } else {
        toast.error(result.error || 'Failed to approve provider');
      }
    } catch (error) {
      toast.error('Error approving provider');
    } finally {
      setIsApproving(false);
    }
  };

  // ============ HANDLE REJECT ============
  const handleReject = async () => {
    if (!selectedProviderId) {
      toast.error('Invalid provider ID');
      return;
    }

    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    try {
      setIsRejecting(true);
      const result = await rejectProvider(selectedProviderId, rejectionReason);

      if (result.success) {
        toast.success(result.message || 'Provider rejected successfully');
        setProviders(
          providers.filter((p) => (p.id ) !== selectedProviderId)
        );
        setShowRejectModal(false);
        setRejectionReason('');
        setSelectedProviderId(null);

        if (providers.length === 1) {
          toast.info('No more pending providers');
        }
      } else {
        toast.error(result.error || 'Failed to reject provider');
      }
    } catch (error) {
      toast.error('Error rejecting provider');
    } finally {
      setIsRejecting(false);
    }
  };

  // ============ GET PROVIDER NAME ============
  const getProviderName = (provider: Provider): string => {
    if (provider.userName) {
      return provider.userName;
    }
    return 'Provider';
  };

  // ============ GET PROVIDER PHOTO ============
  const getProviderPhoto = (provider: Provider): string => {
    return (
      provider.profileURL ||
      'https://tse4.mm.bing.net/th/id/OIP.23wzRzOwtSR-WAQZM4mWzAHaHa?r=0&cb=thfc1falcon&rs=1&pid=ImgDetMain&o=7&rm=3'
    );
  };

  // ============ GET PROVIDER EMAIL ============
  const getProviderEmail = (provider: Provider): string => {
    return provider.email || 'No email provided';
  };

   // ============ GET AGE ============
  const getProviderAge = (provider: Provider): string => {
    return (
      provider.age||
      'No age provided '
    );
  };

  // ============ GET PROVIDER PHONE ============
  // const getProviderPhone = (provider: Provider): string => {
  //   return provider.mobileNumber || 'No phone provided';
  // };

  // ============ GET PROVIDER CATEGORY ============
  const getProviderCategory = (provider: Provider): string => {
    return provider.service || 'No category specified';
  };

    // ============ GET PROVIDER ID ============
  const getProviderId = (provider: Provider): string => {
    return provider.nationalNumber || 'No ID provided';
  };

  // ============ GET PROVIDER SPECIALIZATION ============
  const getProviderSpecialization = (provider: Provider): string => {
    return (
      provider.specialization ||
      'No specialization provided'
    );
  };

  // ============ GET CV TEXT ============
  const getProviderCV = (provider: Provider): string => {
    return (
      provider.writtenCv ||
      'No CV provided'
    );
  };

  // ============ GET CV FILE ============
  const getProviderCVFile = (provider: Provider): string | null => {
    return provider.cvUrl || null;
  };

  // ============ GET PROVIDER LOCATION ============
  const getProviderLocation = (provider: Provider): string => {
    if (provider.city && provider.state) {
      return `${provider.city}, ${provider.state}`;
    }
    if (provider.location) {
      return provider.location;
    }
    if (provider.city) {
      return provider.city;
    }
    return 'Location not specified';
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Provider Approval</h1>
          <p className="text-muted-foreground">
            Review and approve pending provider applications
          </p>
        </div>

        <div className="space-y-6">
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : providers.length === 0 ? (
            <Card>
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  No pending providers to review
                </p>
                <Button variant="outline" onClick={loadPendingProviders}>
                  Refresh
                </Button>
              </div>
            </Card>
          ) : (
            providers.map((provider) => (
              <Card key={provider.id}>
                {/* ============ HEADER SECTION ============ */}
                <div className="flex items-start gap-6 mb-8 pb-6 border-b">
                  <img
                    src={getProviderPhoto(provider)}
                    alt={getProviderName(provider)}
                    className="w-28 h-28 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2">
                      {getProviderName(provider)}
                    </h3>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground font-semibold">
                          EMAIL
                        </p>
                        <p className="text-sm">{getProviderEmail(provider)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-semibold">
                          Age
                        </p>
                        <p className="text-sm">{getProviderAge(provider)}</p>
                      </div>
                      {/* <div>
                        <p className="text-xs text-muted-foreground font-semibold">
                          PHONE
                        </p>
                        <p className="text-sm">{getProviderPhone(provider)}</p>
                      </div> */}
                      <div>
                        <p className="text-xs text-muted-foreground font-semibold">
                          CATEGORY
                        </p>
                        <p className="text-sm">{getProviderCategory(provider)}</p>
                      </div>
              
                      <div>
                        <p className="text-xs text-muted-foreground font-semibold">
                          NATIONAL ID
                        </p>
                          <p className="text-sm">{getProviderId(provider)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-semibold">
                          LOCATION
                        </p>
                        <p className="text-sm">{getProviderLocation(provider)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ============ DETAILS SECTION ============ */}
                <div className="space-y-6 mb-8">
                  {/* Specialization */}
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Specialization</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {getProviderSpecialization(provider)}
                    </p>
                  </div>
                </div>

                {/* ============ CV SECTION ============ */}
                {getProviderCVFile(provider) && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-lg mb-2">CV Document</h4>
                    <div className="flex items-center gap-3 p-4 bg-muted rounded-lg hover:bg-muted/80 transition">
                      <FileText className="w-6 h-6 text-blue-600 flex-shrink-0" />
                      <a
                        href={getProviderCVFile(provider)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-medium flex-1"
                      >
                        Download CV
                      </a>
                    </div>
                  </div>
                )}

                {/* ============ WRITTEN CV SECTION ============ */}
                {getProviderCV(provider) !== 'No CV provided' && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-lg mb-2">Written CV</h4>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-muted-foreground leading-relaxed text-sm line-clamp-4">
                        {getProviderCV(provider)}
                      </p>
                    </div>
                  </div>
                )}

                {/* ============ ACTION BUTTONS ============ */}
                <div className="flex gap-3 pt-6 border-t">
                  <Button
                    variant="success"
                    onClick={() => handleApprove(provider)}
                    disabled={isApproving || isRejecting}
                    className="flex-1"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve Provider
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setSelectedProviderId(provider.id || null);
                      setShowRejectModal(true);
                    }}
                    disabled={isApproving || isRejecting}
                    className="flex-1"
                  >
                    <X className="w-4 h-4" />
                    Reject Application
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* ============ REJECT MODAL ============ */}
        <Modal
          isOpen={showRejectModal}
          onClose={() => setShowRejectModal(false)}
          title="Reject Application"
        >
          <div className="space-y-4">
            <Textarea
              label="Rejection Reason"
              placeholder="Provide a reason for rejection..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              disabled={isRejecting}
              required
            />
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowRejectModal(false)}
                className="flex-1"
                disabled={isRejecting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                className="flex-1"
                disabled={isRejecting}
              >
                {isRejecting ? 'Rejecting...' : 'Reject'}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
