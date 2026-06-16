import { useState, useEffect } from 'react';
import { MapPin, Calendar, Clock, DollarSign, FileX, Star } from 'lucide-react';
import { toast } from 'sonner';
import ProviderNavbar from '../../../components/layout/ProviderNavbar';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Modal from '../../../components/ui/Modal';
import { getAvailableBroadcasts, respondToBroadcast } from './BroadcastActions';

type ActionType = 'ACCEPT' | 'COUNTER_OFFER' | 'REFUSE';

export default function ProviderBroadcastPage() {
  const [broadcasts, setBroadcasts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<{ broadcast: any; action: ActionType } | null>(null);
  const [endTime, setEndTime] = useState('');
  const [counterPrice, setCounterPrice] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchBroadcasts = async () => {
    setLoading(true);
    const res = await getAvailableBroadcasts();
    if (res.success) setBroadcasts(res.data??[]);
    else toast.error(res.error);
    setLoading(false);
  };

  useEffect(() => {
    fetchBroadcasts();
  }, []);

  const openModal = (broadcast: any, action: ActionType) => {
    setSelected({ broadcast, action });
    setEndTime('');
    setCounterPrice('');
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!selected) return;
    const { broadcast, action } = selected;

    if ((action === 'ACCEPT' || action === 'COUNTER_OFFER') && !endTime) {
      toast.error('Please enter an end time');
      return;
    }
    if (action === 'COUNTER_OFFER' && !counterPrice) {
      toast.error('Please enter your offered price');
      return;
    }

    setSubmitting(true);
    const res = await respondToBroadcast({
      requestId: broadcast.request._id,
      action,
      offeredEndTime: endTime || undefined,
      offeredPrice: counterPrice ? parseFloat(counterPrice) : undefined,
    });

    if (res.success) {
      toast.success(
        action === 'ACCEPT' ? 'Request accepted' :
        action === 'COUNTER_OFFER' ? 'Counter offer sent' :
        'Request refused'
      );
      setModalOpen(false);
      fetchBroadcasts();
    } else {
      toast.error(res.error);
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ProviderNavbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Available Requests</h1>

        {loading ? (
          <p className="text-center text-gray-500 py-16">Loading...</p>
        ) : broadcasts.length === 0 ? (
          <Card className="p-8 text-center text-gray-400">
            <FileX size={40} className="mx-auto mb-3" />
            No available requests in your area right now.
          </Card>
        ) : (
          <div className="space-y-4">
            {broadcasts.map((broadcast) => {
              const req = broadcast.request;           // ← البيانات جوه .request
              const isHourly = req.paymentMode === 'HOURLY';

              return (
                <Card key={broadcast.offerId} className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-lg">{req.serviceNeeded}</p>
                      <Badge variant="waiting">
                        {isHourly ? 'Hourly' : 'Fixed Price'}
                      </Badge>
                    </div>
                    {req.preferredPrice && (
                      <span className="flex items-center gap-1 text-green-600 font-bold">
                        <DollarSign size={16} />
                        {req.preferredPrice} EGP
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 text-sm text-gray-600 mb-4">
                    <p className="flex items-center gap-2">
                      <MapPin size={14} />
                      {[req.exactLocation, req.street, req.city, req.governorate]
                        .filter(Boolean).join(' — ')}
                    </p>
                    <p className="flex items-center gap-2">
                      <Calendar size={14} />
                      {req.dateNeeded
                        ? new Date(req.dateNeeded).toLocaleDateString()
                        : '—'}
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock size={14} /> {req.startTime || '—'}
                    </p>
                    {req.matchByTopRated && (
                      <p className="flex items-center gap-2 text-yellow-600">
                        <Star size={14} fill="currentColor" />
                        Customer prefers top-rated providers
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <Button onClick={() => openModal(broadcast, 'ACCEPT')}>
                      Accept
                    </Button>
                    {!isHourly && (
                      <Button variant="outline" onClick={() => openModal(broadcast, 'COUNTER_OFFER')}>
                        Counter Offer
                      </Button>
                    )}
                    <Button variant="destructive" onClick={() => openModal(broadcast, 'REFUSE')}>
                      Refuse
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={
            selected?.action === 'ACCEPT' ? 'Accept Request' :
            selected?.action === 'COUNTER_OFFER' ? 'Send Counter Offer' :
            'Refuse Request'
          }
        >
          {selected?.action !== 'REFUSE' && (
            <div className="space-y-4 mb-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Expected End Time
                </label>
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
              {selected?.action === 'COUNTER_OFFER' && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Offered Price (EGP)
                  </label>
                  <Input
                    type="number"
                    value={counterPrice}
                    onChange={(e) => setCounterPrice(e.target.value)}
                    placeholder="Enter your price"
                  />
                </div>
              )}
            </div>
          )}

          {selected?.action === 'REFUSE' && (
            <p className="text-gray-600 mb-4">
              Are you sure you want to refuse this request?
            </p>
          )}

          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              variant={selected?.action === 'REFUSE' ? 'destructive' : 'default'}
            >
              {submitting ? 'Submitting...' : 'Confirm'}
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
}