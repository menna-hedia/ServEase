// ============ OTP verification ============
export async function ConfirmEmailAction(email: string, otp: string) {
  try {
    const res = await fetch(`/api/auth/confirm-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp }),
    });

    const result = await res.json();
    console.log('Email verification response:', result);

    if (res.ok) {
  if (result?.access_token) {
    localStorage.setItem("access_token", result.access_token);
  }
  return {
    success: true,
    message: result.message || 'Verification successful',
  };
}
    return {
      success: false,
      error: result.message || result.error || 'Verification failed',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

// ============ resend otp ============
export async function resendOTP(email: string) {
  try {
    const res = await fetch(`/api/auth/resend-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const result = await res.json();
    console.log('Resend OTP response:', result);

    if (res.ok) {
      return {
        success: true,
        message: result.message || 'OTP resent successfully',
      };
    }

    return {
      success: false,
      error: result.message || result.error || 'Resend failed',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}