import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { createBroadcastRequest } from './BroadcastActions';
import { getAllServices } from '../../shared/Services/ServicesActions';
import { getStates, getCities } from '../../../services/locationService';

type StateOption = { value: string; label: string; iso2: string };

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (requestId: string) => void;
}

export default function CreateBroadcastModal({ isOpen, onClose, onSuccess }: Props) {
  const navigate = useNavigate();
  const [services,     setServices]     = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData,     setFormData]     = useState({
    serviceId:      '',
    serviceNeeded:  '',
    governorate:    '',
    city:           '',
    street:         '',
    exactLocation:  '',
    dateNeeded:     '',
    startTime:      '',
    locationScope:  'GOVERNORATE' as 'GOVERNORATE' | 'DISTRICT',
    matchByTopRated: false,
    paymentMode:    'FIXED' as 'FIXED' | 'HOURLY',
    preferredPrice: '',
  });

  // ── Governorate / City dropdown data ──────────────────────
  const [requestStates,        setRequestStates]        = useState<StateOption[]>([]);
  const [requestCities,        setRequestCities]        = useState<{ value: string; label: string }[]>([]);
  const [loadingRequestStates, setLoadingRequestStates] = useState(false);
  const [loadingRequestCities, setLoadingRequestCities] = useState(false);

  useEffect(() => {
    getAllServices().then((r) => {
      if (r.success) setServices(r.data);
    });
  }, []);

  // ── Load governorates (states) ────────────────────────────
  useEffect(() => {
    const loadStates = async () => {
      try {
        setLoadingRequestStates(true);
        const statesData = await getStates();
        const mapped: StateOption[] = Array.isArray(statesData)
          ? statesData.map((s: any) => ({
              value: s.name,
              label: s.name,
              iso2: s.iso2,
            }))
          : [];
        setRequestStates(mapped);
      } catch {
        toast.error('Failed to load governorates');
      } finally {
        setLoadingRequestStates(false);
      }
    };
    loadStates();
  }, []);

  // ── Load cities whenever governorate changes ─────────────
  useEffect(() => {
    if (!formData.governorate || requestStates.length === 0) {
      setRequestCities([]);
      return;
    }

    const loadCities = async () => {
      try {
        setLoadingRequestCities(true);
        const stateObj = requestStates.find((s) => s.value === formData.governorate);
        if (!stateObj) return;

        const data = await getCities(stateObj.iso2);
        const mapped = Array.isArray(data)
          ? data.map((c: any) => ({ value: c.name, label: c.name }))
          : [];
        setRequestCities(mapped);
      } catch {
        toast.error('Failed to load cities');
      } finally {
        setLoadingRequestCities(false);
      }
    };

    loadCities();
  }, [formData.governorate, requestStates]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.serviceId) {
      toast.error('Please select a service');
      return;
    }

    if (formData.paymentMode === 'FIXED' && !formData.preferredPrice) {
      toast.error('Please enter a preferred price for fixed payment');
      return;
    }

    setIsSubmitting(true);
    const result = await createBroadcastRequest({
      serviceId:      formData.serviceId,
      serviceNeeded:  formData.serviceNeeded,
      governorate:    formData.governorate,
      city:           formData.city,
      street:         formData.street,
      exactLocation:  formData.exactLocation,
      dateNeeded:     formData.dateNeeded,
      startTime:      formData.startTime,
      locationScope:  formData.locationScope,
      matchByTopRated: formData.matchByTopRated,
      paymentMode:    formData.paymentMode,
      ...(formData.paymentMode === 'FIXED' && {
        preferredPrice: Number(formData.preferredPrice),
      }),
    });
    setIsSubmitting(false);

    if (result.success) {
      toast.success('Broadcast request created successfully!');
      const requestId = result.data?.request?._id
                     || result.data?.request?.id
                     || result.data?._id
                     || result.data?.id;
      onSuccess?.(requestId);
      onClose();
      navigate('/customer/requests');   
    } else {
      toast.error(result.error || 'Failed to create broadcast');
    }
  };

  const set = (field: string, value: any) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Broadcast Request" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Service */}
        <div>
          <label className="block text-sm font-medium mb-1">Service</label>
          <select
            value={formData.serviceId}
            onChange={(e) => {
              const selected = services.find((s) => s._id === e.target.value);
              set('serviceId', e.target.value);
              set('serviceNeeded', selected?.name || '');
            }}
            className="w-full h-12 px-4 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            required
          >
            <option value="">Select a service</option>
            {services.map((s) => (
              <option key={s._id} value={s._id}>{s.name}</option>
            ))}
          </select>
        </div>

        {/* Date & Time */}
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            type="date"
            label="Preferred Date"
            value={formData.dateNeeded}
            onChange={(e) => set('dateNeeded', e.target.value)}
            required
          />
          <Input
            type="time"
            label="Start Time"
            value={formData.startTime}
            onChange={(e) => set('startTime', e.target.value)}
            required
          />
        </div>

        {/* Location */}
        <div className="grid md:grid-cols-2 gap-4">
          <Select
            label="Governorate"
            value={formData.governorate}
            onChange={(e) => {
              set('governorate', e.target.value);
              set('city', '');
            }}
            options={[
              {
                value: '',
                label: loadingRequestStates ? 'Loading...' : 'Select Governorate',
              },
              ...requestStates,
            ]}
            required
          />
          <Select
            label="City"
            value={formData.city}
            onChange={(e) => set('city', e.target.value)}
            disabled={!formData.governorate || loadingRequestCities}
            options={[
              {
                value: '',
                label: loadingRequestCities ? 'Loading...' : 'Select City',
              },
              ...requestCities,
            ]}
            required
          />
        </div>
        <Input
          label="Street"
          placeholder="Enter street"
          value={formData.street}
          onChange={(e) => set('street', e.target.value)}
          required
        />
        <Input
          label="Exact Location"
          placeholder="Building, floor, apartment..."
          value={formData.exactLocation}
          onChange={(e) => set('exactLocation', e.target.value)}
          required
        />

        {/* Location Scope */}
        <div>
          <label className="block text-sm font-medium mb-2">Search Scope</label>
          <div className="grid grid-cols-2 gap-3">
            {(['GOVERNORATE', 'DISTRICT'] as const).map((scope) => (
              <button
                key={scope}
                type="button"
                onClick={() => set('locationScope', scope)}
                className={`py-2 px-4 rounded-lg border text-sm font-medium transition-colors ${
                  formData.locationScope === scope
                    ? 'bg-primary text-white border-primary'
                    : 'border-border hover:bg-muted'
                }`}
              >
                {scope === 'GOVERNORATE' ? 'Governorate' : 'District'}
              </button>
            ))}
          </div>
        </div>

        {/* Payment Mode */}
        <div>
          <label className="block text-sm font-medium mb-2">Payment Mode</label>
          <div className="grid grid-cols-2 gap-3">
            {(['FIXED', 'HOURLY'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => set('paymentMode', mode)}
                className={`py-2 px-4 rounded-lg border text-sm font-medium transition-colors ${
                  formData.paymentMode === mode
                    ? 'bg-primary text-white border-primary'
                    : 'border-border hover:bg-muted'
                }`}
              >
                {mode === 'FIXED' ? 'Fixed Price' : 'Hourly'}
              </button>
            ))}
          </div>
        </div>

        {/* Preferred Price */}
        {formData.paymentMode === 'FIXED' && (
          <Input
            type="number"
            label="Preferred Price (EGP)"
            placeholder="Enter your budget"
            value={formData.preferredPrice}
            onChange={(e) => set('preferredPrice', e.target.value)}
            required
          />
        )}

        {/* Top Rated */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.matchByTopRated}
            onChange={(e) => set('matchByTopRated', e.target.checked)}
            className="w-4 h-4 accent-primary"
          />
          <span className="text-sm">Match with top-rated providers only</span>
        </label>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Broadcast Request'}
        </Button>
      </form>
    </Modal>
  );
}