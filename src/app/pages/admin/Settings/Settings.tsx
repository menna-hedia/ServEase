import { useState, useEffect } from 'react';
import { Save, AlertCircle, Loader } from 'lucide-react';
import { toast } from 'sonner';
import AdminSidebar from '../../../components/layout/AdminSidebar';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import {
  getSettings,
  updateCommission,
  updateDebtLimit,
  updateProviderCancelFee,
  updateProviderCancelCount,
} from './SettingsActions';

export interface SettingsData {
  webCommission?: number;
  commission?: number;
  providerDebt?: number;
  debtLimit?: number;
  providerCancelFee?: number;
  providerCancelCount?: number;
  id?: string;
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function Settings() {
  const [commission, setCommission] = useState('');
  const [debtLimit, setDebtLimit] = useState('');
  const [cancelFee, setCancelFee] = useState('0');
  const [cancelCount, setCancelCount] = useState('0');
  const [loading, setLoading] = useState(true);
  const [isSavingCommission, setIsSavingCommission] = useState(false);
  const [isSavingDebt, setIsSavingDebt] = useState(false);
  const [isSavingCancelFee, setIsSavingCancelFee] = useState(false);
  const [isSavingCancelCount, setIsSavingCancelCount] = useState(false);
  const [commissionError, setCommissionError] = useState('');
  const [debtError, setDebtError] = useState('');
  const [cancelFeeError, setCancelFeeError] = useState('');
  const [cancelCountError, setCancelCountError] = useState('');

  // ============ LOAD SETTINGS ON MOUNT ============
  useEffect(() => {
    loadSettings();
  }, []);

  // ============ LOAD SETTINGS ============
  const loadSettings = async () => {
    try {
      setLoading(true);
      const result = await getSettings();

      if (result.success) {
        const data = result.data as SettingsData;

        setCommission((data.webCommission || 0).toString());
        setDebtLimit((data.providerDebt || 0).toString());
        setCancelFee((data.providerCancelFee || 0).toString());
        setCancelCount((data.providerCancelCount || 0).toString());

        toast.success('Settings loaded successfully');
      } else {
        toast.error(result.error || 'Failed to load settings');
        setCommission('0');
        setDebtLimit('0');
        setCancelFee('0');
        setCancelCount('0');
      }
    } catch (error) {
      toast.error('Error loading settings');
      setCommission('0');
      setDebtLimit('0');
      setCancelFee('0');
      setCancelCount('0');
    } finally {
      setLoading(false);
    }
  };

  // ============ VALIDATE COMMISSION ============
  const validateCommission = (value: string): boolean => {
    setCommissionError('');

    if (!value.trim()) {
      setCommissionError('Commission percentage is required');
      return false;
    }

    const num = parseFloat(value);
    if (isNaN(num)) {
      setCommissionError('Commission must be a valid number');
      return false;
    }

    if (num < 0) {
      setCommissionError('Commission cannot be negative');
      return false;
    }

    if (num > 100) {
      setCommissionError('Commission cannot exceed 100%');
      return false;
    }

    return true;
  };

  // ============ VALIDATE DEBT LIMIT ============
  const validateDebtLimit = (value: string): boolean => {
    setDebtError('');

    if (!value.trim()) {
      setDebtError('Debt limit is required');
      return false;
    }

    const num = parseFloat(value);
    if (isNaN(num)) {
      setDebtError('Debt limit must be a valid number');
      return false;
    }

    if (num < 0) {
      setDebtError('Debt limit cannot be negative');
      return false;
    }

    return true;
  };

  // ============ VALIDATE CANCEL FEE ============
  const validateCancelFee = (value: string): boolean => {
    setCancelFeeError('');

    if (!value.trim()) {
      setCancelFeeError('Cancel fee is required');
      return false;
    }

    const num = parseFloat(value);
    if (isNaN(num)) {
      setCancelFeeError('Cancel fee must be a valid number');
      return false;
    }

    if (num < 0) {
      setCancelFeeError('Cancel fee cannot be negative');
      return false;
    }

    return true;
  };

  // ============ VALIDATE CANCEL COUNT ============
  const validateCancelCount = (value: string): boolean => {
    setCancelCountError('');

    if (!value.trim()) {
      setCancelCountError('Cancel count is required');
      return false;
    }

    const num = parseInt(value);
    if (isNaN(num)) {
      setCancelCountError('Cancel count must be a valid number');
      return false;
    }

    if (num < 0) {
      setCancelCountError('Cancel count cannot be negative');
      return false;
    }

    return true;
  };

  // ============ HANDLE SAVE COMMISSION ============
  const handleSaveCommission = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateCommission(commission)) return;

    try {
      setIsSavingCommission(true);
      const commissionValue = parseFloat(commission);
      const result = await updateCommission(commissionValue);

      if (result.success) {
        toast.success(result.message || 'Commission updated successfully');
      } else {
        toast.error(result.error || 'Failed to update commission');
      }
    } catch (error) {
      toast.error('Error updating commission');
    } finally {
      setIsSavingCommission(false);
    }
  };

  // ============ HANDLE SAVE DEBT LIMIT ============
  const handleSaveDebtLimit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateDebtLimit(debtLimit)) return;

    try {
      setIsSavingDebt(true);
      const debtValue = parseFloat(debtLimit);
      const result = await updateDebtLimit(debtValue);

      if (result.success) {
        toast.success(result.message || 'Debt limit updated successfully');
      } else {
        toast.error(result.error || 'Failed to update debt limit');
      }
    } catch (error) {
      toast.error('Error updating debt limit');
    } finally {
      setIsSavingDebt(false);
    }
  };

  // ============ HANDLE SAVE CANCEL FEE ============
  const handleSaveCancelFee = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateCancelFee(cancelFee)) return;

    try {
      setIsSavingCancelFee(true);
      const feeValue = parseFloat(cancelFee);
      const result = await updateProviderCancelFee(feeValue);

      if (result.success) {
        toast.success(result.message || 'Cancel fee updated successfully');
      } else {
        toast.error(result.error || 'Failed to update cancel fee');
      }
    } catch (error) {
      toast.error('Error updating cancel fee');
    } finally {
      setIsSavingCancelFee(false);
    }
  };

  // ============ HANDLE SAVE CANCEL COUNT ============
  const handleSaveCancelCount = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateCancelCount(cancelCount)) return;

    try {
      setIsSavingCancelCount(true);
      const countValue = parseInt(cancelCount);
      const result = await updateProviderCancelCount(countValue);

      if (result.success) {
        toast.success(result.message || 'Cancel count updated successfully');
      } else {
        toast.error(result.error || 'Failed to update cancel count');
      }
    } catch (error) {
      toast.error('Error updating cancel count');
    } finally {
      setIsSavingCancelCount(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <AdminSidebar />
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="text-center">
            <Loader className="w-12 h-12 animate-spin text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Loading settings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage platform settings and configurations
          </p>
        </div>

        <div className="max-w-2xl space-y-6">
          {/* ============ COMMISSION SETTINGS ============ */}
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <Save className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-bold">Commission Settings</h2>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              Set the commission percentage that the platform takes from each service provider
            </p>

            <form onSubmit={handleSaveCommission} className="space-y-4">
              <div>
                <Input
                  type="number"
                  label="Commission Percentage (%)"
                  placeholder="Enter commission percentage"
                  value={commission}
                  onChange={(e) => {
                    setCommission(e.target.value);
                    setCommissionError('');
                  }}
                  min="0"
                  max="100"
                  step="0.1"
                  disabled={isSavingCommission}
                  required
                />
                {commissionError && (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {commissionError}
                  </div>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded p-4 text-sm text-blue-800">
                <p>
                  <strong>Current value:</strong> {commission}%
                </p>
              </div>

              <Button
                type="submit"
                disabled={isSavingCommission}
                className="w-full"
              >
                {isSavingCommission ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Commission
                  </>
                )}
              </Button>
            </form>
          </Card>

          {/* ============ DEBT LIMIT SETTINGS ============ */}
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <Save className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-bold">Debt Limit</h2>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              Set the maximum debt limit for providers on the platform
            </p>

            <form onSubmit={handleSaveDebtLimit} className="space-y-4">
              <div>
                <Input
                  type="number"
                  label="Maximum Debt Limit (EGP)"
                  placeholder="Enter maximum debt limit"
                  value={debtLimit}
                  onChange={(e) => {
                    setDebtLimit(e.target.value);
                    setDebtError('');
                  }}
                  min="0"
                  step="100"
                  disabled={isSavingDebt}
                  required
                />
                {debtError && (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {debtError}
                  </div>
                )}
              </div>

              <div className="bg-green-50 border border-green-200 rounded p-4 text-sm text-green-800">
                <p>
                  <strong>Current value:</strong> {debtLimit} EGP
                </p>
              </div>

              <Button
                type="submit"
                disabled={isSavingDebt}
                className="w-full"
              >
                {isSavingDebt ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Limit
                  </>
                )}
              </Button>
            </form>
          </Card>

          {/* ============ CANCEL FEE SETTINGS ============ */}
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <Save className="w-5 h-5 text-orange-600" />
              <h2 className="text-xl font-bold">Provider Cancel Fee</h2>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              Set the cancellation fee charged to providers when they cancel a request
            </p>

            <form onSubmit={handleSaveCancelFee} className="space-y-4">
              <div>
                <Input
                  type="number"
                  label="Cancel Fee (%)"
                  placeholder="Enter cancellation fee"
                  value={cancelFee}
                  onChange={(e) => {
                    setCancelFee(e.target.value);
                    setCancelFeeError('');
                  }}
                  min="0"
                  step="0.01"
                  disabled={isSavingCancelFee}
                  required
                />
                {cancelFeeError && (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {cancelFeeError}
                  </div>
                )}
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded p-4 text-sm text-orange-800">
                <p>
                  <strong>Current value:</strong> {cancelFee}% 
                </p>
              </div>

              <Button
                type="submit"
                disabled={isSavingCancelFee}
                className="w-full"
              >
                {isSavingCancelFee ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Cancel Fee
                  </>
                )}
              </Button>
            </form>
          </Card>

          {/* ============ CANCEL COUNT SETTINGS ============ */}
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <Save className="w-5 h-5 text-red-600" />
              <h2 className="text-xl font-bold">Provider Cancel Count</h2>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              Set the maximum number of cancellations allowed before taking action
            </p>

            <form onSubmit={handleSaveCancelCount} className="space-y-4">
              <div>
                <Input
                  type="number"
                  label="Cancel Count"
                  placeholder="Enter maximum cancel count"
                  value={cancelCount}
                  onChange={(e) => {
                    setCancelCount(e.target.value);
                    setCancelCountError('');
                  }}
                  min="0"
                  step="1"
                  disabled={isSavingCancelCount}
                  required
                />
                {cancelCountError && (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {cancelCountError}
                  </div>
                )}
              </div>

              <div className="bg-red-50 border border-red-200 rounded p-4 text-sm text-red-800">
                <p>
                  <strong>Current value:</strong> {cancelCount} cancellations
                </p>
              </div>

              <Button
                type="submit"
                disabled={isSavingCancelCount}
                className="w-full"
              >
                {isSavingCancelCount ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Cancel Count
                  </>
                )}
              </Button>
            </form>
          </Card>

          {/* ============ INFO BOX ============ */}
          <Card>
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-900 mb-2">
                  Important Information
                </h3>
                <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
                  <li>Changes to settings will take effect immediately</li>
                  <li>Commission percentage applies to all new transactions</li>
                  <li>Debt limit applies to all active providers</li>
                  <li>Cancel fee is charged when providers cancel requests</li>
                  <li>Cancel count is used to track provider behavior</li>
                  <li>Settings are stored securely on the server</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}