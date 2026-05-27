import { useState } from 'react';
import { useNavigate } from 'react-router';
import { CreditCard, Lock, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import ProviderNavbar from '../../components/layout/ProviderNavbar';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';

const debtAmount = 845;

const paymentMethods = [
  { value: 'credit-card', label: 'Credit Card' },
  { value: 'debit-card', label: 'Debit Card' },
  { value: 'paypal', label: 'PayPal' },
];

export default function Checkout() {
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    paymentMethod: 'credit-card',
  });

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Payment processed successfully! Your debt has been cleared.');
    setTimeout(() => {
      navigate('/provider/billing');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <ProviderNavbar />

      <div className="container mx-auto px-4 lg:px-8 py-8">
        <button
          onClick={() => navigate('/provider/billing')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Billing
        </button>

        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Payment Checkout</h1>
            <p className="text-muted-foreground">Complete your payment to clear your debt</p>
          </div>

          <div className="grid gap-6">
            <Card className="bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Amount Due</p>
                  <p className="text-4xl font-bold text-destructive">${debtAmount}</p>
                </div>
                <div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center">
                  <CreditCard className="w-8 h-8 text-destructive" />
                </div>
              </div>
            </Card>

            <Card>
              <h2 className="text-xl font-bold mb-6">Payment Details</h2>
              <form onSubmit={handlePayment} className="space-y-4">
                <Select
                  label="Payment Method"
                  options={paymentMethods}
                  value={paymentData.paymentMethod}
                  onChange={(e) => setPaymentData({ ...paymentData, paymentMethod: e.target.value })}
                  required
                />

                <Input
                  label="Card Number"
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={paymentData.cardNumber}
                  onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value })}
                  maxLength={19}
                  required
                />

                <Input
                  label="Cardholder Name"
                  type="text"
                  placeholder="John Doe"
                  value={paymentData.cardName}
                  onChange={(e) => setPaymentData({ ...paymentData, cardName: e.target.value })}
                  required
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Expiry Date"
                    type="text"
                    placeholder="MM/YY"
                    value={paymentData.expiryDate}
                    onChange={(e) => setPaymentData({ ...paymentData, expiryDate: e.target.value })}
                    maxLength={5}
                    required
                  />
                  <Input
                    label="CVV"
                    type="text"
                    placeholder="123"
                    value={paymentData.cvv}
                    onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value })}
                    maxLength={3}
                    required
                  />
                </div>

                <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
                  <Lock className="w-5 h-5 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Your payment information is encrypted and secure
                  </p>
                </div>

                <Button type="submit" className="w-full" size="lg">
                  Pay ${debtAmount}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
