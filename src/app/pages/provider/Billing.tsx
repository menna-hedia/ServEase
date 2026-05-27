import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import ProviderNavbar from '../../components/layout/ProviderNavbar';
import Footer from '../../components/layout/Footer';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import { SkeletonCard } from '../../components/ui/Skeleton';
import { DollarSign, TrendingUp, CheckCircle, AlertTriangle, CreditCard, Receipt } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const debtAmount = 845;
const summaryData = [
  { label: 'Total Earnings', value: '$8,450', icon: DollarSign, color: 'bg-green-100 text-green-600' },
  { label: 'Completed Services', value: '32', icon: CheckCircle, color: 'bg-blue-100 text-blue-600' },
  { label: 'Debt Amount', value: `$${debtAmount}`, icon: AlertTriangle, color: 'bg-orange-100 text-orange-600' },
];

const chartData = [
  { month: 'Jan', earnings: 1200 },
  { month: 'Feb', earnings: 1500 },
  { month: 'Mar', earnings: 1800 },
  { month: 'Apr', earnings: 1650 },
  { month: 'May', earnings: 2300 },
];

const transactions = [
  { id: 1, customer: 'Sarah Johnson', price: 150, commission: 15, date: '2026-05-12' },
  { id: 2, customer: 'Mike Chen', price: 200, commission: 20, date: '2026-05-10' },
  { id: 3, customer: 'James Wilson', price: 300, commission: 30, date: '2026-05-08' },
];

export default function Billing() {
  const navigate = useNavigate();
  const hasDebtWarning = debtAmount >= 500;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <ProviderNavbar />

      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Billing & Earnings</h1>
          <p className="text-muted-foreground">Track your earnings and transactions</p>
        </div>

        {hasDebtWarning && (
          <div className="mb-8 bg-destructive/10 border-2 border-destructive rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-destructive/20 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-destructive mb-2">Payment Required</h3>
                <p className="text-destructive/90 mb-4">
                  You must pay first. Your debt of ${debtAmount} LE has reached the limit. You cannot accept new requests until your debt is cleared.
                </p>
                <Button
                  variant="destructive"
                  size="lg"
                  onClick={() => navigate('/provider/checkout')}
                  className="gap-2"
                >
                  <CreditCard className="w-5 h-5" />
                  Pay Your Debt
                </Button>
              </div>
            </div>
          </div>
        )}

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
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid key="grid" strokeDasharray="3 3" />
              <XAxis key="xaxis" dataKey="month" />
              <YAxis key="yaxis" />
              <Tooltip key="tooltip" />
              <Bar key="bar-earnings" dataKey="earnings" fill="#2563EB" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h2 className="text-xl font-bold mb-6">Recent Transactions</h2>
          {loading ? (
            <SkeletonCard />
          ) : transactions.length === 0 ? (
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
                    <th className="text-left p-3 text-muted-foreground font-medium">Customer</th>
                    <th className="text-left p-3 text-muted-foreground font-medium">Price</th>
                    <th className="text-left p-3 text-muted-foreground font-medium">Commission</th>
                    <th className="text-left p-3 text-muted-foreground font-medium">Net</th>
                    <th className="text-left p-3 text-muted-foreground font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                      <td className="p-3">{transaction.customer}</td>
                      <td className="p-3">${transaction.price}</td>
                      <td className="p-3 text-destructive">-${transaction.commission}</td>
                      <td className="p-3 font-semibold">${transaction.price - transaction.commission}</td>
                      <td className="p-3 text-muted-foreground">{new Date(transaction.date).toLocaleDateString()}</td>
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
