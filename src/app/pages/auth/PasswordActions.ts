export async function sendForgotPasswordOTP(email: string) {
  try {
    const res = await fetch(`/api/auth/forget-passwordOTP`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const result = await res.json();
    console.log('Forgot password OTP response:', result);

    if (res.ok) {
      return {
        success: true,
        message: result.message || 'OTP sent successfully',
      };
    }

    return {
      success: false,
      error: result.message || result.error || 'Failed to send OTP',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

// Check Forget Password OTP
export async function checkForgetPasswordOTP(email: string, otp: string) {
  try {
    const res = await fetch(`/api/auth/check-forget-password-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp }),
    });

    const result = await res.json();
    console.log('Verify forgot password OTP response:', result);

    if (res.ok) {
      return {
        success: true,
        message: result.message || 'OTP verified successfully',
      };
    }

    return {
      success: false,
      error: result.message || result.error || 'Invalid OTP',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

// Change Password After OTP
export async function changePasswordAfterOTP(
  email: string,
  otp: string,
  newPassword: string
) {
  try {
    const res = await fetch(`/api/auth/change-password-after-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp, newPassword }),
    });

    const result = await res.json();
    console.log('Change password after OTP response:', result);

    if (res.ok) {
      return {
        success: true,
        message: result.message || 'Password changed successfully',
      };
    }

    return {
      success: false,
      error: result.message || result.error || 'Password change failed',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}
