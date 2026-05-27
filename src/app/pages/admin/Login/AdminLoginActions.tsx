export async function adminLoginAction(email: string, password: string) {
  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await res.json();
    console.log('Admin login response:', result);

    if (res.ok) {
      localStorage.setItem('admin_token', result.access_token);
      return {
        success: true,
        message: 'Logged in successfully',
      };
    }

    return {
      success: false,
      error: result.message || result.error || 'Invalid email or password',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

// logout 
export function adminLogoutAction() {
  localStorage.removeItem('admin_token');

  return {
    success: true,
    message: 'Logged out successfully',
  };
}