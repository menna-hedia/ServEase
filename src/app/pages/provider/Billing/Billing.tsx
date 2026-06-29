import { useState, useEffect } from 'react';
import ProviderNavbar from '../../../components/layout/ProviderNavbar';
import Footer from '../../../components/layout/Footer';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import EmptyState from '../../../components/ui/EmptyState';
import { SkeletonCard } from '../../../components/ui/Skeleton';
import { DollarSign, TrendingUp, CheckCircle, AlertTriangle, CreditCard, Receipt } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';
import { getProviderBilling, payProviderDebt, ProviderBillingData } from './BillingActions';

export default function Billing() {
  const [billingData, setBillingData] = useState<ProviderBillingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [payingDebt, setPayingDebt] = useState(false);

  // ============ FETCH ============
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const result = await getProviderBilling();
      setLoading(false);

      if (result.success && result.data) {
        setBillingData(result.data);
      } else {
        setFetchError(result.error || 'Failed to load billing data');
      }
    };
    load();
  }, []);

  // ============ PAY DEBT ============
  const handlePayDebt = async () => {
    if (!billingData || billingData.debt <= 0) return;

    setPayingDebt(true);
    const result = await payProviderDebt();
    setPayingDebt(false);

    if (result.success && result.paymentUrl) {
      window.location.href = result.paymentUrl;
    } else {
      toast.error(result.error || 'Failed to start payment');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <ProviderNavbar />
        <div className="container mx-auto px-4 lg:px-8 py-8">
          <SkeletonCard />
        </div>
        <Footer />
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-background">
        <ProviderNavbar />
        <div className="container mx-auto px-4 lg:px-8 py-8">
          <EmptyState
            icon={<AlertTriangle className="w-10 h-10 text-destructive" />}
            title="Could not load billing data"
            description={fetchError}
          />
        </div>
        <Footer />
      </div>
    );
  }

  const debtAmount = billingData?.debt ?? 0;
  const adminApproved = billingData?.adminApproved ?? 'Active';
  const hasDebtWarning = adminApproved !== 'Active';

  const summaryData = [
    {
      label: 'Total Earnings',
      value: `EGP ${billingData?.totalEarnings ?? 0}`,
      icon: DollarSign,
      color: 'bg-green-100 text-green-600',
    },
    {
      label: 'Completed Services',
      value: `${billingData?.completedServices ?? 0}`,
      icon: CheckCircle,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'Debt Amount',
      value: `EGP ${debtAmount}`,
      icon: AlertTriangle,
      color: 'bg-orange-100 text-orange-600',
    },
  ];

  const chartData = billingData?.monthlyEarnings ?? [];
  const transactions = billingData?.transactions ?? [];

  return (
    <div className="min-h-screen bg-background">
      <ProviderNavbar />

      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Billing & Earnings</h1>
          <p className="text-muted-foreground">Track your earnings and transactions</p>
        </div>

        {hasDebtWarning ? (
          <div className="mb-8 bg-destructive/10 border-2 border-destructive rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-destructive/20 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-destructive mb-2">Payment Required</h3>
                <p className="text-destructive/90 mb-4">
                  Your account status is <span className="font-semibold">{adminApproved}</span>
                  {debtAmount > 0 && <> due to an outstanding debt of EGP {debtAmount}</>}.
                  Please pay to continue accepting new requests.
                </p>

                <Button
                  variant="destructive"
                  size="lg"
                  onClick={handlePayDebt}
                  disabled={payingDebt}
                  className="gap-2"
                >
                  <CreditCard className="w-5 h-5" />
                  {payingDebt ? 'Opening payment...' : 'Pay Your Debt'}
                </Button>
              </div>
            </div>
          </div>
        ):<div className="mb-8 bg-destructive/10 border-2 border-destructive rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-destructive/20 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-destructive mb-2">Payment Required</h3>
                <p className="text-destructive/90 mb-4">
                 you have
                  {debtAmount > 0 && <>  EGP {debtAmount}</>}.
                  you can pay now.
                </p>

                <Button
                  variant="destructive"
                  size="lg"
                  onClick={handlePayDebt}
                  disabled={payingDebt}
                  className="gap-2"
                >
                  <CreditCard className="w-5 h-5" />
                  {payingDebt ? 'Opening payment...' : 'Pay Your Debt'}
                </Button>
              </div>
            </div>
          </div>
        }

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {summaryData.map((item) => (
            <Card key={item.label} className="hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground mb-1">{item.label}</p>
                  <p className="text-3xl font-bold">{item.value}</p>
                </div>
                <div className={`w-14 h-14 rounded-xl ${item.color} flex items-center justify-center`}>
                  <item.icon className="w-7 h-7" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="mb-8">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Monthly Earnings
          </h2>
          {chartData.length === 0 ? (
            <EmptyState
              icon={<TrendingUp className="w-10 h-10 text-muted-foreground" />}
              title="No earnings data yet"
              description="Your monthly earnings chart will appear here once you complete services."
            />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#2563EB" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card>
          <h2 className="text-xl font-bold mb-6">Recent Transactions</h2>
          {transactions.length === 0 ? (
            <EmptyState
              icon={<Receipt className="w-10 h-10 text-muted-foreground" />}
              title="No transactions yet"
              description="You haven't completed any services yet. Start accepting requests to see your transactions here."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-3 text-muted-foreground font-medium">Service</th>
                    <th className="text-left p-3 text-muted-foreground font-medium">Type</th>
                    <th className="text-left p-3 text-muted-foreground font-medium">Amount</th>
                    <th className="text-left p-3 text-muted-foreground font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t) => (
                    <tr key={t.serviceRequestId} className="border-b border-border last:border-0 hover:bg-muted/50">
                      <td className="p-3">{t.title}</td>
                      <td className="p-3 capitalize">{t.type}</td>
                      <td className="p-3 font-semibold text-green-600">+ EGP {t.amount}</td>
                      <td className="p-3 text-muted-foreground">
                        {new Date(t.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
      <Footer />
    </div>
  );
}