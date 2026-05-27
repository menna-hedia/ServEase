import { useState } from 'react';
import { toast } from 'sonner';
import AdminSidebar from '../../components/layout/AdminSidebar';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function Settings() {
  const [commission, setCommission] = useState('10');
  const [debtLimit, setDebtLimit] = useState('5000');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Settings saved successfully');
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage platform settings</p>
        </div>

        <div className="max-w-2xl space-y-6">
          <Card>
            <h2 className="text-xl font-bold mb-6">Commission Settings</h2>
            <form onSubmit={handleSaveSettings} className="space-y-4">
              <Input
                type="number"
                label="Commission Percentage (%)"
                value={commission}
                onChange={(e) => setCommission(e.target.value)}
                required
              />
              <Button type="submit">Save Commission</Button>
            </form>
          </Card>

          <Card>
            <h2 className="text-xl font-bold mb-6">Debt Limit</h2>
            <form onSubmit={handleSaveSettings} className="space-y-4">
              <Input
                type="number"
                label="Maximum Debt Limit ($)"
                value={debtLimit}
                onChange={(e) => setDebtLimit(e.target.value)}
                required
              />
              <Button type="submit">Save Limit</Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
