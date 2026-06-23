import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { CheckCircle } from 'lucide-react';
import Button from '../../../components/ui/Button';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(5);

  useEffect(() => {
    const countdown = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    const redirect = setTimeout(() => {
      navigate('/provider/billing');
    }, 5000);

    return () => {
      clearInterval(countdown);
      clearTimeout(redirect);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <CheckCircle className="mx-auto text-green-600 mb-4" size={80} />
        <h1 className="text-3xl font-bold text-green-600 mb-3">Payment Successful</h1>
        <p className="text-gray-600 mb-4">Your payment has been completed successfully.</p>
        <p className="text-gray-500 mb-6">Redirecting to billing in {seconds} seconds...</p>
        <Button onClick={() => navigate('/provider/billing')} className="w-full">
          Back to Billing
        </Button>
      </div>
    </div>
  );
}