// ============ GET PROFILE ============
export async function getCustomerProfile() {
  try {
    const token = localStorage.getItem('access_token');

    const res = await fetch('/api/customer/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();
    console.log('Profile API response:', result);
    if (res.ok) {
      return { success: true, data: result };
    }

    return {
      success: false,
      error: result.message || 'Failed to fetch profile',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

// ============ UPDATE PROFILE ============
export async function updateCustomerProfile(data: {
  firstName: string;
  lastName: string;
  mobileNumber: string;
  state: string;
  city: string;
  gender: string;
}) {
  try {
    const token = localStorage.getItem('access_token');

    const res = await fetch('/api/customer/update-profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (res.ok) {
      return {
        success: true,
        data: result,
      };
    }

    return {
      success: false,
      error: result.message || 'Failed to update profile',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

// ============ UPDATE PASSWORD ============
export async function updatePasswordAction(
  oldPassword: string,
  newPassword: string
) {
  try {
    const token = localStorage.getItem('access_token');

    const res = await fetch('/api/customer/update-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    });

    const result = await res.json();

    if (res.ok) {
      return {
        success: true,
        message: result.message || 'Password updated successfully',
      };
    }

    return {
      success: false,
      error: result.message || result.error || 'Failed to update password',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

// ============ DELETE ACCOUNT ============
export async function deleteAccountAction() {
  try {
    const token = localStorage.getItem('access_token');

    const res = await fetch('/api/customer/delete-account', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();

    if (res.ok) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');

      return {
        success: true,
        message: result.message || 'Account deleted successfully',
      };
    }

    return {
      success: false,
      error: result.message || result.error || 'Failed to delete account',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}