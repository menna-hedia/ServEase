import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { Home } from "lucide-react";
import { toast } from "sonner";

import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import { ConfirmEmailAction, resendOTP } from "./ConfirmEmailAction";
import { checkForgetPasswordOTP } from "../PasswordActions";

export default function OTPVerification() {
  const navigate = useNavigate();
  const location = useLocation();

  const { type, role } = (location.state as { type?: string; role?: string }) || {};

  const email =
    (location.state as any)?.email ||
    sessionStorage.getItem("verifyEmail");

  const otpType =
    type ||
    (sessionStorage.getItem("verifyType") as string) ||
    "register";

  const userRole =
    (role as "customer" | "provider") ||
    (sessionStorage.getItem("verifyRole") as "customer" | "provider") ||
    "customer";

  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();

    const pasted = e.clipboardData.getData("text").slice(0, 5);
    const arr = pasted.split("");

    setOtp([...arr, ...Array(5 - arr.length).fill("")]);

    if (pasted.length === 5) {
      inputRefs.current[4]?.focus();
    } else {
      inputRefs.current[pasted.length]?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email is missing. Please start again.");
      navigate("/signin");
      return;
    }

    if (otp.some((d) => !d)) {
      toast.error("Please enter all 5 digits");
      return;
    }

    setIsLoading(true);

    try {
      if (otpType === "reset-password") {
        const result = await checkForgetPasswordOTP(email, otp.join(""));

        if (!result.success) {
          throw new Error(result.error || "Invalid OTP");
        }

        sessionStorage.setItem("resetEmail", email);
        sessionStorage.setItem("resetOTP", otp.join(""));
        toast.success(result.message || "OTP verified successfully");
        navigate("/change-password");

      } else {
  const result = await ConfirmEmailAction(email, otp.join(""));

  if (!result.success) {
    throw new Error(result.error || "Invalid OTP");
  }

  sessionStorage.removeItem("verifyEmail");
  sessionStorage.removeItem("verifyType");
  sessionStorage.removeItem("verifyRole");

  toast.success(result.message || "Verified successfully");

  if (userRole === "provider") {
    const token = localStorage.getItem('access_token');
    try {
      const profileRes = await fetch('/api/provider/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await profileRes.json();
      const profile = data.provider || data.data || data;

      if (profile.adminApproved === 'Active') {
        navigate('/provider/home');
      } else {
        navigate('/pending-approval');
      }
    } catch {
      navigate('/pending-approval');
    }
  } else {
    navigate("/customer/home");
  }
}
    } catch (err: any) {
      toast.error(err.message || "Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email || !canResend) return;

    setIsResending(true);

    try {
      const res = await resendOTP(email);
      toast.success(res.message || "OTP resent successfully");
      setCountdown(60);
      setCanResend(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to resend OTP");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="flex items-center justify-center gap-2 mb-8"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
            <Home className="w-7 h-7 text-white" />
          </div>
          <span className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            ServEase
          </span>
        </Link>

        <Card>
          <h1 className="text-2xl font-bold text-center mb-2">
            Verify Your Email
          </h1>

          <p className="text-center text-muted-foreground mb-8">
            Enter the 5-digit code sent to {email}
          </p>

          <form onSubmit={handleVerify} className="space-y-6">
            <div
              className="flex gap-3 justify-center"
              onPaste={handlePaste}
            >
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  value={digit}
                  maxLength={1}
                  inputMode="numeric"
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  disabled={isLoading}
                  className="w-14 h-14 text-center text-2xl font-bold border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                />
              ))}
            </div>

            <div className="text-center">
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isResending}
                  className="text-primary hover:underline disabled:opacity-50"
                >
                  {isResending ? "Sending..." : "Resend Code"}
                </button>
              ) : (
                <p className="text-muted-foreground">
                  Resend in {countdown}s
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={otp.some((d) => !d) || isLoading}
            >
              {isLoading ? "Verifying..." : "Verify Email"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}