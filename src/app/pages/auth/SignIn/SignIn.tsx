import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import logo from "../../../components/images/logoWhite.png"
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Card from "../../../components/ui/Card";

import { SignInSchema, SignInObjectType } from "./SignInSchema";
import { SignInAction } from "./SignInActions";
import { resendOTP } from "../OTPVerification/ConfirmEmailAction";
import Modal from './../../../components/ui/Modal';

export default function SignIn() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<"customer" | "provider">("customer");
  const [showPassword, setShowPassword] = useState(false);
  const [showDeletedAccountModal, setShowDeletedAccountModal] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInObjectType>({
    resolver: zodResolver(SignInSchema),
  });

  const onSubmit = async (data: SignInObjectType) => {
    const result = await SignInAction(data);

    // email not verified
    if (result.notVerified && result.email) {
      toast.info("Email not verified. Sending OTP...");

      await resendOTP(result.email);

      sessionStorage.setItem("verifyEmail", result.email);
      sessionStorage.setItem("verifyType", "register");
      sessionStorage.setItem("verifyRole", userType);

      navigate("/verify-otp", {
        state: {
          email: result.email,
          type: "register",
          role: userType,
        },
      });

      return;
    }

    // login failed
    if (!result.success) {
      toast.error(result.error || "Login failed");
      return;
    }

    // success
    toast.success('Signed in successfully!');

    const role = result.data?.role;

    if (role === 'Provider') {
      const token = result.data?.access_token;
      try {
        const profileRes = await fetch('/api/provider/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const profile = await profileRes.json();

        if (profile.adminApproved === 'PendingApproval') {
          localStorage.setItem('provider_approved', 'false');
          navigate('/pending-approval');
        } else {

          localStorage.setItem('provider_approved', 'true');
          navigate('/provider/home');
        }
      } catch {
        localStorage.setItem('provider_approved', 'true');
        navigate('/provider/home');
      }
    } else {
      navigate('/customer/home');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
              <img
    src={logo}
    alt="ServEase"
    className="w-10 h-10 object-contain"
  />
          </div>
          <span className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            ServEase
          </span>
        </Link>

        <Card>
          <h1 className="text-2xl font-bold text-center mb-6">Welcome Back</h1>

          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => setUserType("customer")}
              className={`flex-1 py-2.5 rounded-lg font-medium ${userType === "customer"
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground"
                }`}
            >
              Customer
            </button>

            <button
              type="button"
              onClick={() => setUserType("provider")}
              className={`flex-1 py-2.5 rounded-lg font-medium ${userType === "provider"
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground"
                }`}
            >
              Provider
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <Input
              type="email"
              label="Email"
              placeholder="Enter your email"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                label="Password"
                placeholder="Enter your password"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-11"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}

            <div className="text-right">
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-sm text-primary hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to={`/signup/${userType}`} className="text-primary font-medium">
              Sign up
            </Link>
          </div>
        </Card>
      </div>
      <Modal
        isOpen={showDeletedAccountModal}
        onClose={() => setShowDeletedAccountModal(false)}
        title="Account Deleted"
        size="sm"
      >
        <div className="space-y-4">
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
            <p className="text-destructive font-medium mb-2">
              Your account is not deleted permanently.
            </p>

            <p className="text-sm text-muted-foreground">
              If you change your mind, you can recover your account within 30 days
              by contacting the support team.
            </p>

            <p className="text-sm text-primary mt-2">
              Contact:{' '}
              <a
                href="mailto:support@servease.com"
                className="underline"
              >
                support@servease.com
              </a>
            </p>
          </div>
        </div>
      </Modal>

    </div>

  );
}

export async function logoutAction() {
  try {
    const token = localStorage.getItem("access_token");

    const res = await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Logout failed",
    };
  }
}
