import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Clock, CheckCircle, FileCheck } from 'lucide-react';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import { toast } from 'sonner';

export default function PendingApproval() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(false);

  const handleCheckStatus = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch('/api/provider/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const profile = data.provider || data.data || data;
      console.log('profile:', profile);

      if (profile.adminApproved === 'Active') {
        navigate('/provider/home', { replace: true });
      } else {
        toast.info('Your application is still under review');
      }
    } catch {
      toast.error('Failed to check status');
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center">
        <p className="text-muted-foreground animate-pulse">Checking status...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
            <Home className="w-7 h-7 text-white" />
          </div>
          <span className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            ServEase
          </span>
        </Link>

        <Card className="text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Clock className="w-10 h-10 text-yellow-600" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Application Under Review</h1>
            <p className="text-muted-foreground">
              Your provider application is being reviewed by our team
            </p>
          </div>

          <div className="bg-muted/50 rounded-xl p-6 mb-6">
            <h2 className="font-semibold mb-4">Review Process</h2>
            <div className="space-y-4 text-left">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium">Application Submitted</p>
                  <p className="text-sm text-muted-foreground">
                    Your application has been received
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-warning rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
                  <FileCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium">Document Verification</p>
                  <p className="text-sm text-muted-foreground">
                    We're reviewing your credentials and documents
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-border rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Final Approval</p>
                  <p className="text-sm text-muted-foreground">
                    You'll be able to sign in when approved
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-blue-900">
              <strong>Estimated Time:</strong> 2-3 business days
            </p>
            <p className="text-sm text-blue-800 mt-1">
              You'll receive an email notification once your application is reviewed
            </p>
          </div>

          <div className="flex gap-3 justify-center">
            {/* <Button onClick={handleCheckStatus}>
              Check Status
            </Button> */}
          </div>
        </Card>
      </div>
    </div>
  );
}
