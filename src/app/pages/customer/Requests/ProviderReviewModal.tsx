import { useState } from 'react';
import { Star } from 'lucide-react';
import { toast } from 'sonner';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import Textarea from '../../../components/ui/Textarea';
import { submitProviderReview } from '../../shared/Services/ReviewActions';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  providerId: string;
  requestId: string;
  providerName?: string;
}

export default function ProviderReviewModal({ isOpen, onClose, providerId, requestId, providerName }: Props) {
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast.error('Please write a review');
      return;
    }

    setIsSubmitting(true);
    const result = await submitProviderReview(providerId, requestId, rating, content.trim());
    setIsSubmitting(false);

    if (result.success) {
      toast.success('Thanks for your review!');
      setContent('');
      setRating(5);
      onClose();
    } else {
      toast.error(result.error || 'Failed to submit review');
    }
  };

  const handleSkip = () => {
    setContent('');
    setRating(5);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleSkip} title="Rate Your Experience" size="sm">
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {providerName
            ? `How was your service with ${providerName}?`
            : 'How was your service?'}
        </p>

        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="p-1 hover:scale-110 transition-transform"
            >
              <Star
                className={`w-8 h-8 ${
                  star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>

        <Textarea
          label="Your Review"
          placeholder="Share your experience with this provider..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="flex gap-3">
          <Button variant="outline" onClick={handleSkip} className="flex-1" disabled={isSubmitting}>
            Skip
          </Button>
          <Button onClick={handleSubmit} className="flex-1" disabled={isSubmitting || !content.trim()}>
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}