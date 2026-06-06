import { SignInObjectType } from "./SignInSchema";
import { resendOTP } from "../OTPVerification/ConfirmEmailAction";

export async function SignInAction(data: SignInObjectType) {
  try {
    const res = await fetch(`/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    console.log("Sign in response:", result);

    // success login
    if (res.ok) {
      if (result?.access_token) {
        localStorage.setItem("access_token", result.access_token);
      }

      if (result?.refresh_token) {
        localStorage.setItem("refresh_token", result.refresh_token);
      }

      if (result?.user) {
        localStorage.setItem("user", JSON.stringify(result.user));
      }
      if (result?.role) {
        localStorage.setItem('role', result.role);
      }
      return { success: true, data: result };
    }

    // email not verified
    if (
      res.status === 403 ||
      result.message?.toLowerCase().includes("not verified") ||
      result.message?.toLowerCase().includes("verify")
    ) {
      return {
        success: false,
        notVerified: true,
        email: data.email,
      };
    }

    return {
      success: false,
      error: result.message || result.error || "Login failed",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error",
    };
  }
}

// ============ REFRESH TOKEN FUNCTION ============

export async function refreshToken() {
  const refresh_token = localStorage.getItem("refresh_token");

  if (!refresh_token) {
    return { success: false, error: "No refresh token found" };
  }

  try {
    const res = await fetch("/api/auth/refresh-token", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${refresh_token}`,
      },
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("access_token", data.access_token);
      return { success: true, access_token: data.access_token };
    }

    return { success: false, error: data.message || "Refresh failed" };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error",
    };
  }
}